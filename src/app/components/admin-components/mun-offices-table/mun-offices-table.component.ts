import { Component, inject, InjectionToken, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonResponse } from '../../../interfaces/responses/common-response';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { ExportDataButtonComponent } from '../../export-data-button/export-data-button.component';
import { QuickSearchComponent } from '../../quick-search/quick-search.component';
import { ExcelColumnNames } from '../../../enums/excel-column-names';
import { AddMunOfficeDialogComponent } from '../add-munoffice-dialog/add-mun-office-dialog/add-munoffice-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from '../../../services/alert.service';
import { UtilityService } from '../../../services/utility/utility.service';
import { MunicipalOfficesService } from '../../../services/municipalOffices.service';

@Component({
  selector: 'app-mun-offices-table',
  standalone:true,
  imports: [CommonModule, MatTooltipModule, MatChipsModule, ExportDataButtonComponent,MatButtonModule,MatIconModule,MatMenuModule,MatTableModule,TranslateModule,],
  templateUrl: './mun-offices-table.component.html',
  styleUrls: ['./mun-offices-table.component.scss']
})
export class MunicipalOfficesTableComponent implements OnInit, OnChanges {

  @Input() municipalOffices: CommonResponse[] = [];
  dataSource = new MatTableDataSource<CommonResponse>([]);
  displayedColumns: string[] = ['id', 'name', 'actions'];
  columnNames = ExcelColumnNames;
  alertService = inject(AlertService);
  utilityService= inject(UtilityService);
  munOfficesService = inject(MunicipalOfficesService);

  constructor(private dialog: MatDialog){}
  
  ngOnInit(): void {
    this.dataSource.data = this.municipalOffices;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['municipalOffices']){
      this.dataSource.data = this.municipalOffices;
    }
  }

  editMunOffice(office: CommonResponse): void {
    const dialogRef = this.dialog.open(AddMunOfficeDialogComponent, {
      width: '500px',
      data: { munOffice: office }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.isConfirmed) {
        
      }
    });
  }

  deleteMunOffice(id: number, currentName: string): void {
    this.alertService.showDeleteItemAlert(currentName).then((result) => {
      if (result.isConfirmed) {
        this.munOfficesService.deleteMunicipalOffice(id).subscribe((response) => {
          this.utilityService.handleResponse(
            response.success,
            'successMessages.office.deleted.successfully',
            'errorMessages.unexpected.error',
            'notificationMessages.office.deleted',
            { officeName: currentName }
          );
        });
      }
    });
  }

}
