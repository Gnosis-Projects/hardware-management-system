import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormArray,
} from '@angular/forms';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { DeviceService } from '../../../services/device.service';
import { DeviceStateService } from '../../../services/state-management/device-state.service';
import { EditDeviceRequest } from '../../../interfaces/requests/device-request';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { DeviceType, NetEquipmentType, PrinterType, RemoteDesktopAppType } from '../../../enums/device-type';
import { UtilityService } from '../../../services/utility/utility.service';
import { filter } from 'rxjs';
import { operationSystems } from '../../../shared/os';

@Component({
  selector: 'app-edit-device',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, TranslateModule],
  templateUrl: './edit-device.component.html',
  styleUrls: ['./edit-device.component.scss'],
})
export class EditDeviceComponent implements OnInit {

  editForm: FormGroup;
  deviceId: number | null = null;
  deviceType: DeviceType | null = null;
  previousPath: string = '';
  RemoteDesktopAppType = RemoteDesktopAppType;
  operationSystems = operationSystems
  DeviceType = DeviceType;
  printerType = PrinterType;
  netEquipmentType = NetEquipmentType

  constructor(
    private fb: FormBuilder,
    private deviceService: DeviceService,
    private deviceStateService: DeviceStateService,
    private router: Router,
    private translate: TranslateService,
    private toastr: ToastrService,
    private utilityService: UtilityService,
  ) {
    this.editForm = this.fb.group({
      model: ['', Validators.required],
      serialNumber: ['', Validators.required],
      deviceName: ['', Validators.required],
      ram: [0],
      comments: [''],
      ip: [''],
      macAddress: [''],
      machineType: [''],
      operatingSystem: [''],
      phoneNumber: [''],
      monitorType: [''],
      outlet: [''],
      workGroupDomain: [''],
      antivirus: [''],
      purchaseDate: [''],
      remoteDesktopApp: [0],
      remoteDesktopApps: this.fb.array([]),
      printerTypeId: [null],
      floor: [''],
      networkEquipmentTypeId: [null],
    });

    this.editForm.get('comments')?.setValue('');

    router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.previousPath = event.url;
      });
  }

  ngOnInit(): void {
    this.deviceId = this.deviceStateService.getSelectedDeviceId();
    this.deviceType = this.deviceStateService.getSelectedDeviceType();
    if (this.deviceId !== null && this.deviceType !== null) {
      this.loadDeviceData(this.deviceId, this.deviceType);
    }
    if (this.deviceType !== DeviceType.COMPUTER) {
      this.removeNonEssentialFields();
    }
  }

  removeNonEssentialFields(): void {
    const nonEssentialFields = [
      'ram', 'ip', 'macAddress', 'machineType', 'operatingSystem',
      'monitorType', 'outlet', 'workGroupDomain', 'antivirus',
      'purchaseDate', 'remoteDesktopApps'
    ];
    nonEssentialFields.forEach(field => this.editForm.removeControl(field));
  }

  get remoteDesktopApps(): FormArray {
    return this.editForm.get('remoteDesktopApps') as FormArray;
  }

  loadDeviceData(deviceId: number | null, deviceType: DeviceType): void {
    if (deviceId !== null && deviceType !== null) {
      this.deviceService.getDeviceById(deviceId, deviceType).subscribe({
        next: (response) => {
          if (response.success) {
            this.editForm.patchValue(response.data);
            this.editForm.get('comments')?.setValue('');
            if (response.data.remoteDesktopApps && response.data.remoteDesktopApps.length) {
              response.data.remoteDesktopApps.forEach(app => {
                this.remoteDesktopApps.push(this.fb.group({
                  typeId: [app.typeId],
                  userId: [app.userId],
                  password: [app.password],
                }));
              });
            }

            if (deviceType === DeviceType.PRINTER && response.data.printerType) {
              this.editForm.get('printerTypeId')?.setValue(response.data.printerType.id);
            }
            if (deviceType === DeviceType.NETWORK_EQUIPMENT && response.data.networkEquipmentType) {
              this.editForm.get('networkEquipmentTypeId')?.setValue(response.data.networkEquipmentType.id);
              this.editForm.get('floor')?.setValue(response.data.floor);
            }
            if (deviceType === DeviceType.PHONE && response.data.phoneNumber) {
              this.editForm.get('phoneNumber')?.setValue(response.data.phoneNumber);
            }
          } else {
            console.error(response.message);
          }
        },
        error: (error) => {
          console.error('Error loading device data:', error);
        },
      });
    }
  }

  onRemoteDesktopAppChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const typeId = Number(target.value) as RemoteDesktopAppType;
    this.remoteDesktopApps.clear();
    const appGroup = this.fb.group({
      typeId: [typeId, Validators.required],
      userId: ['', Validators.required],
      password: [''],
    });
    this.remoteDesktopApps.push(appGroup);
  }

  submitEdit(): void {
    if (this.editForm.valid && this.deviceId !== null && this.deviceType !== null) {
      const editRequest: EditDeviceRequest = {
        id: this.deviceId,
        ...this.editForm.value,
      };

      if (this.deviceType === 'computer' && this.editForm.get('ram')?.value < 2) {
        this.toastr.error(this.translate.instant('Error'));
        return;
      }

      if (this.deviceType === DeviceType.PHONE || this.deviceType === DeviceType.PRINTER) {
        delete editRequest.ip;
        delete editRequest.ram;
        delete editRequest.macAddress;
        delete editRequest.machineType;
        delete editRequest.operatingSystem;
        delete editRequest.monitorType;
        delete editRequest.outlet;
        delete editRequest.workGroupDomain;
        delete editRequest.antivirus;
        delete editRequest.purchaseDate;
        delete editRequest.remoteDesktopApps;
      }

      this.deviceService.editDevice(editRequest, this.deviceType).subscribe({
        next: (response) => {
          if (response.success) {
            this.handleSuccessResponse(response);
            this.editForm.get('comments')?.setValue('');
          } else {
            this.toastr.error(response.message);
          }
        },
        error: () => {
          this.toastr.error(this.translate.instant('errorMessages.error.editing.device'));
        },
      });
    }
  }

  private handleSuccessResponse(response: any): void {
    this.deviceStateService.updateLocalStorageDeviceId(response.data.id);
    this.deviceStateService.clearDeviceHistory();
    this.loadDeviceHistory();
    this.utilityService.handleResponse(
      response.success,
      'successMessages.device.updated.successfully',
      'errorMessages.unexpected.error',
      'notificationMessages.device.updated',
      { deviceName: response.data.deviceName }
    );
    if (this.previousPath === '/workstation') {
      this.router.navigate(['/workstation']);
    } else {
      this.router.navigate(['/selectedDevice']);
    }
  }

  private loadDeviceHistory(): void {
    if (this.deviceId !== null && this.deviceType !== null) {
      this.deviceService.getDeviceHistory(this.deviceId, this.deviceType).subscribe({
        next: (historyResponse) => {
          if (historyResponse.success) {
            this.deviceStateService.setDeviceHistory(historyResponse);
          } else {
            this.toastr.error(historyResponse.message);
          }
        },
        error: () => {
          this.toastr.error(this.translate.instant('Error loading device data'));
        },
      });
    }
  }
}
