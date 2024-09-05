import { CommonModule } from '@angular/common';
import { Component, effect, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DeviceService } from '../../../services/device.service';
import { DeviceStateService } from '../../../services/state-management/device-state.service';
import { SingleDeviceResponse } from '../../../interfaces/responses/device-response';
import { MatIconModule } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AlertService } from '../../../services/alert.service';
import { MatMenuModule } from '@angular/material/menu';
import { DeviceType } from '../../../enums/device-type';
import { UtilityService } from '../../../services/utility/utility.service';
import { EditDeviceComponent } from "../edit-device/edit-device.component";
import { ExportDataButtonComponent } from "../../../components/export-data-button/export-data-button.component";
import { ExcelColumnNames } from '../../../enums/excel-column-names';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { ItemInfoComponent } from '../../../components/item-info/item-info.component';
import { WorkStationStateService } from '../../../services/state-management/workstation-state.service';
@Component({
  selector: 'app-device-detail',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, RouterModule,MatDividerModule,ItemInfoComponent,MatButtonModule, MatIconModule, MatMenuModule, TranslateModule, EditDeviceComponent, ExportDataButtonComponent],
  templateUrl: './device-detail.component.html',
  styleUrls: ['./device-detail.component.scss']
})
export class DeviceDetailComponent implements OnInit {

  device: SingleDeviceResponse | null = null;
  deviceType: DeviceType | null = null;
  showDeleteAlert: boolean = false;
  columnNames = ExcelColumnNames;
  showEdit: boolean = false;
  showGeneralInfo: boolean = true;
  showTechnicalInfo: boolean = false;
  showWorkstationInfo: boolean = false; 


  constructor(
    private deviceService: DeviceService,
    private deviceStateService: DeviceStateService,
    private router: Router,
    private toastr: ToastrService,
    private translate: TranslateService,
    private alertService: AlertService,
    private workstationState: WorkStationStateService,
    private utilityService: UtilityService
  ) {
  }

  ngOnInit(): void {
    const deviceId = this.deviceStateService.getSelectedDeviceId();
    this.deviceType = this.deviceStateService.getSelectedDeviceType();
    if (deviceId !== null) {
      this.fetchDevice(deviceId);
    }
  }

  toggleSection(section: string) {
    this.showGeneralInfo = section === 'general';
    this.showTechnicalInfo = section === 'technical';
    this.showWorkstationInfo = section === 'workstation';
  }
  
  onSuccess(updatedDeviceResponse: SingleDeviceResponse): void {
    if (updatedDeviceResponse) {
      this.device = updatedDeviceResponse;

    }
    this.showEdit = false;
  }

  toggleConfirmDelete() {
    if (this.device) {
      this.alertService.showDeleteItemAlert(this.device?.data?.deviceName).then(result => {
        if (result.isConfirmed) {
          this.deleteDevice();
        }
      });
    }
  }


  fetchDevice(id: number): void {
    if (this.deviceType !== null) {
      this.deviceService.getDeviceById(id, this.deviceType).subscribe({
        next: (response: SingleDeviceResponse | null) => {
          this.device = response;
        },
        error: (error: any) => {
          console.error('Error fetching computer:', error);
        }
      });
    }
  }

  viewHistory() {
    this.router.navigate(['/view-history']);
  }

  editDevice() {
    this.router.navigate(['/selectedDevice/edit']);
  }

  goToWorkstation(){
    this.workstationState.setWorkstationId(Number(this.device?.data.workStation?.id));
    this.router.navigate(['/workstation'])
  }

  deleteDevice() {
    if (this.device && this.device.data && this.deviceType) {
      this.deviceService.deleteDevice(this.device.data.id, this.deviceType).subscribe({
        next: (response: any) => {
          this.utilityService.handleResponse(
            response.success,
            'successMessages.device.deleted.successfully',
            'errorMessages.unexpected.error',
            'notificationMessages.device.deleted',
            { deviceName: this.device?.data.deviceName }
          );
          this.deviceStateService.clearDeviceHistory();
          this.router.navigate(['/selectedCarrier']);
        },
        error: (error: any) => {
          this.toastr.error(this.translate.instant('errorMessages.unexpected.error'));
        }
      });
    }
  }
}
