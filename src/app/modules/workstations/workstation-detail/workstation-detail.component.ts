import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SingleWorkStationResponse } from '../../../interfaces/responses/workstation-response';
import { WorkStationStateService } from '../../../services/state-management/workstation-state.service';
import { ItemDetailsComponent } from '../../../components/mobile-screen/item-details/item-details.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { DeviceType } from '../../../enums/device-type';
import { ItemTableComponent } from '../../../components/tables/item-table/item-table.component';
import { MatTableModule } from '@angular/material/table';
import { Utils } from '../../../shared/utils';
import { ToastrService } from 'ngx-toastr';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { ExportDataButtonComponent } from '../../../components/export-data-button/export-data-button.component';
import { ExcelColumnNames } from '../../../enums/excel-column-names';

@Component({
  selector: 'app-workstation-detail',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    ExportDataButtonComponent,
    MatDividerModule,
    MatChipsModule,
    MatMenuModule,
    TranslateModule,
    ItemDetailsComponent,
    ItemTableComponent,
    MatTableModule
  ],
  templateUrl: './workstation-detail.component.html',
  styleUrls: ['./workstation-detail.component.scss']
})
export class WorkstationDetailComponent implements OnInit {
  workstation: SingleWorkStationResponse | null = null;
  aUnitId: number | null = null;
  deviceType = DeviceType;
  currentView: string = 'COMPUTER';
  columnNames = ExcelColumnNames
  carrierName:string = ''
  constructor(
    private router: Router,
    private workStationStateService: WorkStationStateService,
    private translate: TranslateService,
    private toastr: ToastrService,
    private utils: Utils
  ) {}

  ngOnInit(): void {
    const workstationId = this.workStationStateService.getWorkstationId();
    if (workstationId !== null) {
      this.utils.fetchWorkstation(workstationId, (response) => {
        if (response.success) {
          this.workstation = response;
          this.carrierName = response?.data?.carrier?.name
        } else {
          this.toastr.error(this.translate.instant('errorMessages.unexpected.error'));
        }
      });
    }
  }

  setView(view: string): void {
    this.currentView = view;
  }

  removeDeletedItem(itemId: number, deviceType: DeviceType): void {
    if (this.workstation) {
      switch (deviceType) {
        case DeviceType.COMPUTER:
          this.workstation.data.computers_list = this.workstation.data.computers_list.filter(item => item.id !== itemId);
          break;
        case DeviceType.PHONE:
          this.workstation.data.phones_list = this.workstation.data.phones_list.filter(item => item.id !== itemId);
          break;
        case DeviceType.PRINTER:
          this.workstation.data.printers_list = this.workstation.data.printers_list.filter(item => item.id !== itemId);
          break;
        case DeviceType.NETWORK_EQUIPMENT:
          this.workstation.data.network_equipment_list = this.workstation.data.network_equipment_list.filter(item => item.id !== itemId);
          break;
        case DeviceType.SERVER:
          this.workstation.data.servers_list = this.workstation.data.servers_list.filter(item => item.id !== itemId);
            break;
      }
    }
  }

  editWorkStation(): void {
    if (this.workstation) {
      this.utils.editWorkStation(this.workstation);
    }
  }

  deleteWorkStation(id: number): void {
    this.utils.deleteWorkStation(id, () => {
      this.router.navigate(['/carriers']);
    });
  }

  openAddDeviceDialog(deviceType: DeviceType): void {
    if (this.workstation?.data.id !== undefined) {
      this.utils.toggleForm(deviceType, this.workstation.data.id, (response) => {
        if (response.success) {
          this.toastr.success(this.translate.instant('successMessages.device.added.successfully'));
          this.utils.fetchWorkstation(this.workstation!.data.id, (response) => {
            if (response.success) {
              this.workstation = response;
            } else {
              this.toastr.error(this.translate.instant('errorMessages.unexpected.error'));
            }
          });
        } else {
          this.toastr.error(this.translate.instant('errorMessages.unexpected.error'));
        }
      });
    }
  }
}
