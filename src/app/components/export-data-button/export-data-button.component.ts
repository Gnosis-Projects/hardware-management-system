import { Component, Input } from '@angular/core';
import { ExportDataService } from '../../services/export-data/export-data.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ExcelColumnNames } from '../../enums/excel-column-names';
import { AlertService } from '../../services/alert.service';
import { NotificationsService } from '../../services/notifications.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-export-data-button',
  templateUrl: './export-data-button.component.html',
  styleUrls: ['./export-data-button.component.scss'],
  standalone: true,
  imports: [TranslateModule, MatButtonModule,MatIconModule,MatMenuModule, MatTooltipModule]
})
export class ExportDataButtonComponent {
  @Input() data: any[] = [];
  @Input() fileName: string = 'export';
  @Input() columnNames: any = ExcelColumnNames;

  constructor(private exportDataService: ExportDataService, private router: Router, private toastr: ToastrService, private alertService: AlertService, private notificationsService: NotificationsService) {}

  exportToExcel(): void {
    if (this.data && this.data.length) {
      this.alertService.showExportAlert().then(result => {
        if(result.isConfirmed){
          this.notificationsService.addNotification('Έγινε εξαγωγή δεδομένων');
          if (this.router.url === '/workstation') {
            this.exportDataService.exportDataToExcelWithSheets(this.data, this.fileName, this.columnNames);
          } else {
            this.exportDataService.exportDataToExcel(this.data, this.fileName, this.columnNames);
          }
        }
      });
    } else {
      this.toastr.error('Δεν υπάρχουν δεδομένα για εξαγωγή');
    }
  }

}
