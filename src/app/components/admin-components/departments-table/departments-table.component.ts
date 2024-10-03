import { Component, inject, Input, OnInit, SimpleChanges } from '@angular/core';
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
import { ExcelColumnNames } from '../../../enums/excel-column-names';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from '../../../services/alert.service';
import { UtilityService } from '../../../services/utility/utility.service';
import { DepartmentsService } from '../../../services/departments.service';
import { AddDepartmentDialog } from '../add-department-dialog/add-department-dialog.component';

@Component({
  selector: 'app-departments-table',
  standalone:true,
  imports: [CommonModule, MatTooltipModule, MatChipsModule, ExportDataButtonComponent,MatButtonModule,MatIconModule,MatMenuModule,MatTableModule,TranslateModule,],
  templateUrl: './departments-table.component.html',
  styleUrls: ['./departments-table.component.scss']
})
export class DepartmentsTableComponent implements OnInit {

  @Input() departments: CommonResponse[] = [];
  dataSource = new MatTableDataSource<CommonResponse>([]);
  displayedColumns: string[] = ['id', 'name', 'actions'];
  columnNames = ExcelColumnNames;
  alertService = inject(AlertService);
  utilityService= inject(UtilityService);
  departmentService = inject(DepartmentsService);

  constructor(private dialog: MatDialog){}
  
  ngOnInit(): void {
    this.dataSource.data = this.departments;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['departments']){
      this.dataSource.data = this.departments;
    }
  }

  editDepartment(department: CommonResponse): void {
    const dialogRef = this.dialog.open(AddDepartmentDialog, {
      width: '500px',
      data: { department: department }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.isConfirmed) {
        
      }
    });
  }

  deleteDepartment(id: number, currentName: string): void {
    this.alertService.showDeleteItemAlert(currentName).then((result) => {
      if (result.isConfirmed) {
        this.departmentService.deleteDepartment(id).subscribe((response) => {
          this.utilityService.handleResponse(
            response.success,
            'successMessages.department.deleted.successfully',
            'errorMessages.unexpected.error',
            'notificationMessages.department.deleted',
            { departmentName: currentName }
          );
        });
      }
    });
  }

}
