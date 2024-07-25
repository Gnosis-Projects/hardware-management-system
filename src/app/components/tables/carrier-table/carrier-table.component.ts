import { Component, OnInit, Input, ViewChild, SimpleChanges } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonResponse } from '../../../interfaces/responses/common-response';
import { CarrierStateService } from '../../../services/state-management/carrier-state.service';
import { CarrierService } from '../../../services/carrier.service';
import { AUnitService } from '../../../services/aunit.service';
import { AUnitStateService } from '../../../services/state-management/aunit-state.service';
import { AlertService } from '../../../services/alert.service';
import { UtilityService } from '../../../services/utility/utility.service';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { CarrierTableHeaders } from '../../../enums/table-headers.enum';
import { ExcelColumnNames } from '../../../enums/excel-column-names';
import { CommonModule } from '@angular/common';
import { FilterSearchComponent } from '../../filter-search/filter-search.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ExportDataButtonComponent } from '../../export-data-button/export-data-button.component';
import { Helper } from '../../../shared/helpers';
import { AuthStateService } from '../../../services/state-management/auth-state.service';

@Component({
  selector: 'app-carrier-table',
  standalone: true,
  templateUrl: './carrier-table.component.html',
  styleUrls: ['./carrier-table.component.scss'],
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, ExportDataButtonComponent, MatMenuModule, MatTooltipModule, TranslateModule, FilterSearchComponent],
})
export class CarrierTableComponent implements OnInit {
  carriers: CommonResponse[] = [];
  dataSource = new MatTableDataSource<CommonResponse>(this.carriers);
  allChecked: boolean = false;
  checkedIds: number[] = [];
  displayedColumns = Object.keys(CarrierTableHeaders);
  columnNames = ExcelColumnNames;
  isSuperAdmin = this.authStateService.isSuperAdmin();

  constructor(
    private carrierService: CarrierService,
    private carrierStateService: CarrierStateService,
    private aUnitService: AUnitService,
    private utilityService: UtilityService,
    private aUnitStateService: AUnitStateService,
    private alertService: AlertService,
    private authStateService: AuthStateService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.carrierService
      .getAllCarriers()
      .pipe(take(1))
      .subscribe((response) => {
        if (response.success) {
          this.carrierStateService.setAllCarriers(response.data);
          this.carriers = response.data;
          this.dataSource.data = this.carriers;
          this.fetchAUnitsForAllCarriers();
        } else {
          console.error(response.message);
        }
      });
  }


  fetchAUnitsForAllCarriers(): void {
    if (this.carriers && !this.carriers.length) return;
    this.carriers.forEach((carrier) => {
      this.aUnitService
        .getAUnitsByCarrierId(carrier.id)
        .pipe(take(1))
        .subscribe((response) => {
          if (response.success) {
            this.aUnitStateService.setAUnits(carrier.id, response.data);
          } else {
            console.error(response.message);
          }
        });
    });
  }

  onSearch(term: string): void {
      this.dataSource.data = term ? Helper.filterCarriers(term, this.carriers) : this.carriers;
  }

  editCarrier(id: number, currentName: string): void {
    this.alertService.showAddOrEditUnitAlert(currentName).then((result) => {
      if (result.isConfirmed) {
        const carrierName = result.value?.unitName;
        if (carrierName) {
          this.carrierService
            .updateCarrier(id, carrierName)
            .subscribe((response) => {
              this.utilityService.handleResponse(
                response.success,
                'successMessages.carrier.updated.successfully',
                'errorMessages.unexpected.error',
                'notificationMessages.carrier.updated',
                { carrierName }
              );
              if (response.success) {
                this.fetchData();
              }
            });
        }
      }
    });
  }

  deleteCarrier(id: number, currentName: string): void {
    this.alertService.showDeleteItemAlert(currentName).then((result) => {
      if (result.isConfirmed) {
        this.carrierService.deleteCarrier(id).subscribe((response) => {
          this.utilityService.handleResponse(
            response.success,
            'successMessages.carrier.deleted.successfully',
            'errorMessages.unexpected.error',
            'notificationMessages.carrier.deleted',
            { carrierName: currentName }
          );
          if (response.success) {
            this.fetchData();
          }
        });
      }
    });
  }

  getAUnits(carrierId: number): CommonResponse[] {
    return this.aUnitStateService.getAUnits(carrierId) ?? [];
  }

  viewCarrierDetails(carrier: CommonResponse): void {
    this.carrierStateService.setSelectedCarrier(carrier);
    this.router.navigate(['/selectedCarrier']);
  }
}
