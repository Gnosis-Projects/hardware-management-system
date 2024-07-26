import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DeviceHistoryResponse } from '../../../interfaces/responses/device-response';
import { DeviceStateService } from '../../../services/state-management/device-state.service';
import { DeviceService } from '../../../services/device.service';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ExportDataButtonComponent } from '../../../components/export-data-button/export-data-button.component';
import { ExcelColumnNames } from '../../../enums/excel-column-names';
import { ItemHistoryComponent } from '../../../components/item-history/item-history.component';
import { DeviceType } from '../../../enums/device-type';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-device-history',
  standalone: true,
  imports: [CommonModule, MatButtonModule,MatIconModule,ItemHistoryComponent,TranslateModule,ExportDataButtonComponent,LoadingSpinnerComponent],
  templateUrl: './device-history.component.html',
  styleUrls: ['./device-history.component.scss']
})

export class DeviceHistoryComponent implements OnInit {
  
  deviceHistory: DeviceHistoryResponse | null = null;
  columnNames = ExcelColumnNames;
  isLoading: boolean = false;

  constructor(
    private deviceStateService: DeviceStateService,
    private deviceService: DeviceService,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.deviceHistory = this.deviceStateService.getDeviceHistory();
    if (!this.deviceHistory) {
      const deviceId = this.deviceStateService.getSelectedDeviceId();
      const deviceType = this.deviceStateService.getSelectedDeviceType();
      if (deviceId !== null && deviceType !== null) {
        this.fetchDeviceHistory(deviceId, deviceType);
      }
    } else {
      this.isLoading = false; 
    }
  }

  isComputer(deviceHistory: any): boolean {
    return deviceHistory.data.some((item: any) => 'ram' in item);
  }

  goBack(){
    this.router.navigate(['/selectedDevice']);
  }

  fetchDeviceHistory(deviceId: number, deviceType: DeviceType): void {
    this.isLoading = true; 
    this.deviceService.getDeviceHistory(deviceId, deviceType).subscribe({
      next: response => {
        this.isLoading = false;
        if (response.success) {
          this.deviceHistory = response;
          this.deviceStateService.setDeviceHistory(response);
        } else {
          console.error(response.message);
        }
      },
      error: error => {
        this.isLoading = false; 
        console.error(error);
      }
    });
  }
}