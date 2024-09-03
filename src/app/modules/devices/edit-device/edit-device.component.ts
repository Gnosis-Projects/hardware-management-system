import { CommonModule } from '@angular/common';
<<<<<<< HEAD
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
=======
import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
>>>>>>> 39ba3696e5be5a68965b90ff459682334efc0bf1
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormArray,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DeviceService } from '../../../services/device.service';
import { DeviceStateService } from '../../../services/state-management/device-state.service';
import { EditDeviceRequest, IpType, OperatingSystem, PhoneType, ServerDiskType } from '../../../interfaces/requests/device-request';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { DeviceType } from '../../../enums/device-type';
import { UtilityService } from '../../../services/utility/utility.service';
import { operationSystems } from '../../../shared/os';
import { DropdownService } from '../../../services/dropdown.service';
import { PrinterType,RemoteDesktopAppType } from '../../../interfaces/requests/device-request';
import { NetworkEquipmentType } from '../../../interfaces/responses/device-response';
import { WorkStationStateService } from '../../../services/state-management/workstation-state.service';

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
  operationSystems = operationSystems;
  DeviceType = DeviceType;
  operatingSystems: OperatingSystem[] = []
  diskTypes: ServerDiskType[] = []
  printerTypes: PrinterType[] = []
  remoteDesktopAppTypes: RemoteDesktopAppType[] = []
  phoneTypes: PhoneType[] = [];
  ipTypes: IpType[] = [];
  netTypes: NetworkEquipmentType[] = [];
  newId: number = 0;

  constructor(
    private fb: FormBuilder,
    private deviceService: DeviceService,
    private deviceStateService: DeviceStateService,
    private workstationStateService: WorkStationStateService,
    private router: Router,
    private translate: TranslateService,
    private dropdownService: DropdownService,
    private toastr: ToastrService,
    private utilityService: UtilityService,
  ) {
    this.editForm = this.fb.group({
      id: [null],
      model: ['', Validators.required],
      serialNumber: ['', Validators.required],
      deviceName: ['', Validators.required],
      ram: [null],  
      ip: [''],  
      macAddress: [''],  
      machineType: [''],  
      monitorType: [''],  
      outlet: [''],  
      antivirus: [''],  
      workGroupDomain: [''], 
      operatingSystemId: [null],  
      disks: this.fb.array([]),  
      phoneNumber: [''],
      phoneSocket: [''],
      phoneTypeId: [null],  
      switchAddress: [''],
      printerTypeId: [null],  
      paperSize: [''], 
      serverDiskTypeId: [null], 
      diskRotations: [null],  
      networkDisk: [false],  
      networkEquipmentTypeId: [null],
      networkEquipmentIP: [null],
      networkEquipmentFloor: [''],
      routerPassword: [''],
      routerUsername: [''],
      purchaseDate: [''],
      supplier: [''],
      comments: [''],
      remoteDesktopApp: [null],
      remoteDesktopApps: this.fb.array([]),
      refurbished: [false],
    });
<<<<<<< HEAD
=======

    this.editForm.get('comments')?.setValue('');

    router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.previousPath = event.url;
      });
>>>>>>> 39ba3696e5be5a68965b90ff459682334efc0bf1
  }

  ngOnInit(): void {

    this.dropdownService.getPrinterTypes().subscribe(types => {
      this.printerTypes = types.data;
    });

    this.dropdownService.getRemoteDesktopAppTypes().subscribe(types => {
      this.remoteDesktopAppTypes = types.data;
    });

    this.dropdownService.getOperatingSystems().subscribe(types => {
      this.operatingSystems = types.data;
    });

    this.dropdownService.getNetEquipments().subscribe(types => {
      this.netTypes = types.data;
    });

    this.dropdownService.getPhoneTypes().subscribe(types => {
      this.phoneTypes = types.data;
    });

    this.dropdownService.getIPTypes().subscribe(types => {
      this.ipTypes = types.data;
    });

    this.dropdownService.getServerDiskTypes().subscribe(types => {
      this.diskTypes = types.data;
    });

    this.deviceId = this.deviceStateService.getSelectedDeviceId();
    this.deviceType = this.deviceStateService.getSelectedDeviceType();
    
    if (this.deviceId && this.deviceType) {
      this.loadDeviceData(this.deviceId, this.deviceType);
    }
  }

  get remoteDesktopApps(): FormArray {
    return this.editForm.get('remoteDesktopApps') as FormArray;
  }

<<<<<<< HEAD
  get disks(): FormArray {
    return this.editForm.get('disks') as FormArray;
  }

  loadDeviceData(deviceId: number, deviceType: DeviceType): void {
    this.deviceService.getDeviceById(deviceId, deviceType).subscribe({
      next: (response) => {
        if (response.success) {
          this.editForm.patchValue(response.data);

          this.newId = response.data.workStation?.id ?? 0;
          if(this.deviceType === DeviceType.PHONE){
            if(response.data.phoneType){
              this.editForm.get('phoneTypeId')?.setValue(response.data.phoneType.id);
            }
          }

          if(this.deviceType === DeviceType.PRINTER){
            if(response.data.printerType){
              this.editForm.get('printerTypeId')?.setValue(response.data.printerType.id);
            }
          }

          if(this.deviceType === DeviceType.SERVER){
            if(response.data.serverDiskType){
              this.editForm.get('serverDiskTypeId')?.setValue(response.data.serverDiskType.id);
            }

          }

          if(this.deviceType === DeviceType.NETWORK_EQUIPMENT){
            if(response.data.networkEquipmentType){
              this.editForm.get('networkEquipmentTypeId')?.setValue(response.data.networkEquipmentType.id);
            }
            if(response.data.networkEquipmentIP){
              this.editForm.get('networkEquipmentIP')?.setValue(response.data.networkEquipmentIP.id);
            }

          }
          

          if (this.deviceType === DeviceType.COMPUTER) {
            if (response.data.disks) {
              this.disks.clear();
              response.data.disks.forEach((disk: any) => {
                this.disks.push(this.fb.group({
                  capacity: [disk.capacity, Validators.required],
                  ssd: [disk.ssd],
                }));
              });
            }

            if(response.data.operatingSystem){
              this.editForm.get('operatingSystemId')?.setValue(response.data.operatingSystem.id);
            }

            if(response.data.remoteDesktopApps){
              this.editForm.get('remoteDesktopApp')?.setValue(response.data.remoteDesktopApps[0].typeId);
            }
            

            if (response.data.remoteDesktopApps && response.data.remoteDesktopApps.length > 0) {
              this.remoteDesktopApps.clear();
              response.data.remoteDesktopApps.forEach((app: any) => {
=======
  loadDeviceData(deviceId: number | null, deviceType: DeviceType): void {
    if (deviceId !== null && deviceType !== null) {
      this.deviceService.getDeviceById(deviceId, deviceType).subscribe({
        next: (response) => {
          if (response.success) {
            this.editForm.patchValue(response.data);
            this.editForm.get('comments')?.setValue('');
            if (response.data.remoteDesktopApps && response.data.remoteDesktopApps.length) {
              response.data.remoteDesktopApps.forEach(app => {
>>>>>>> 39ba3696e5be5a68965b90ff459682334efc0bf1
                this.remoteDesktopApps.push(this.fb.group({
                  typeId: [app.typeId],
                  userId: [app.userId],
                  password: [app.password],
                }));
              });
            }
<<<<<<< HEAD
=======

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
>>>>>>> 39ba3696e5be5a68965b90ff459682334efc0bf1
          }

          if (this.deviceType === DeviceType.SERVER && response.data.networkDiskInfo) {
            this.editForm.get('networkDiskInfo')?.patchValue(response.data.networkDiskInfo);
          }

          if (response.data.purchaseDate) {
            const formattedDate = new Date(response.data.purchaseDate).toISOString().substring(0, 10);
            this.editForm.get('purchaseDate')?.setValue(formattedDate);
          }

        } else {
          this.toastr.error(response.message);
        }
      },
      error: (error) => {
        this.toastr.error('Error loading device data');
      },
    });
  }

  submitEdit(): void {

    if (this.editForm.valid && this.deviceId && this.deviceType) {
        const editRequest: EditDeviceRequest = {
            id: this.deviceId,
            ...this.editForm.value,
        };

        switch (this.deviceType) {
            case DeviceType.COMPUTER:
                this.removeNonComputerFields(editRequest);
                break;
            case DeviceType.PHONE:
                this.removeNonPhoneFields(editRequest);
                break;
            case DeviceType.PRINTER:
                this.removeNonPrinterFields(editRequest);
                break;
            case DeviceType.SERVER:
                this.removeNonServerFields(editRequest);
                break;
            case DeviceType.NETWORK_EQUIPMENT:
                this.removeNonNetworkEquipmentFields(editRequest);
                break;
        }

        this.deviceService.editDevice(editRequest, this.deviceType).subscribe({
            next: (response) => {
                if (response.success) {
                    this.toastr.success(this.translate.instant('successMessages.device.updated.successfully'));
                    let workstationId = this.workstationStateService.getWorkstationId();
                    if (!workstationId) {
                      workstationId = this.newId;
                      this.workstationStateService.setWorkstationId(workstationId);
                  }
                    this.router.navigate(['/workstation']);
                } else {
                    this.toastr.error(response.message);
                }
            },
            error: () => {
                this.toastr.error(this.translate.instant('errorMessages.error.editing.device'));
            },
        });
    } else {
        console.error('Form is invalid:', this.editForm.errors);
        console.error('Invalid controls:', this.findInvalidControls());
        this.toastr.error('Form is invalid');
    }
}

findInvalidControls(): string[] {
    const invalid = [];
    const controls = this.editForm.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
            invalid.push(name);
        }
    }
    return invalid;
}

  private removeNonComputerFields(editRequest: EditDeviceRequest) {
    delete editRequest.phoneNumber;
    delete editRequest.phoneSocket;
    delete editRequest.phoneTypeId;
    delete editRequest.printerTypeId;
    delete editRequest.paperSize;
    delete editRequest.serverDiskTypeId;
    delete editRequest.diskRotations;
    delete editRequest.networkDisk;
}

private removeNonPhoneFields(editRequest: EditDeviceRequest) {
    delete editRequest.ram;
    delete editRequest.ip;
    delete editRequest.macAddress;
    delete editRequest.machineType;
    delete editRequest.monitorType;
    delete editRequest.outlet;
    delete editRequest.antivirus;
    delete editRequest.workGroupDomain;
    delete editRequest.operatingSystemId;
    delete editRequest.disks;
    delete editRequest.printerTypeId;
    delete editRequest.paperSize;
    delete editRequest.serverDiskTypeId;
    delete editRequest.diskRotations;
    delete editRequest.networkDisk;
    delete editRequest.remoteDesktopApp;
    delete editRequest.remoteDesktopApps;
}

private removeNonPrinterFields(editRequest: EditDeviceRequest) {
    delete editRequest.ram;
    delete editRequest.ip;
    delete editRequest.macAddress;
    delete editRequest.machineType;
    delete editRequest.monitorType;
    delete editRequest.outlet;
    delete editRequest.antivirus;
    delete editRequest.workGroupDomain;
    delete editRequest.operatingSystemId;
    delete editRequest.disks;
    delete editRequest.phoneNumber;
    delete editRequest.phoneSocket;
    delete editRequest.phoneTypeId;
    delete editRequest.serverDiskTypeId;
    delete editRequest.diskRotations;
    delete editRequest.networkDisk;
    delete editRequest.remoteDesktopApp;
    delete editRequest.remoteDesktopApps;
}

private removeNonServerFields(editRequest: EditDeviceRequest) {
    delete editRequest.ram;
    delete editRequest.ip;
    delete editRequest.macAddress;
    delete editRequest.machineType;
    delete editRequest.monitorType;
    delete editRequest.outlet;
    delete editRequest.antivirus;
    delete editRequest.workGroupDomain;
    delete editRequest.phoneNumber;
    delete editRequest.phoneSocket;
    delete editRequest.phoneTypeId;
    delete editRequest.printerTypeId;
    delete editRequest.paperSize;
    delete editRequest.remoteDesktopApp;
    delete editRequest.remoteDesktopApps;
}

private removeNonNetworkEquipmentFields(editRequest: EditDeviceRequest) {
  delete editRequest.ram;
  delete editRequest.ip;
  delete editRequest.macAddress;
  delete editRequest.machineType;
  delete editRequest.monitorType;
  delete editRequest.outlet;
  delete editRequest.antivirus;
  delete editRequest.workGroupDomain;
  delete editRequest.operatingSystemId;
  delete editRequest.disks;
  delete editRequest.phoneNumber;
  delete editRequest.phoneSocket;
  delete editRequest.phoneTypeId;
  delete editRequest.printerTypeId;
  delete editRequest.paperSize;
  delete editRequest.serverDiskTypeId;
  delete editRequest.diskRotations;
  delete editRequest.networkEquipmentFloor;
  delete editRequest.switchAddress;
  delete editRequest.networkDisk;
  delete editRequest.remoteDesktopApp;
  delete editRequest.remoteDesktopApps;
  delete editRequest.refurbished;
}


  onRemoteDesktopAppChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const typeId = Number(target.value);

    this.remoteDesktopApps.clear();
    const appGroup = this.fb.group({
      typeId: [typeId, Validators.required],
      userId: [''],
      password: [''],
    });

    this.remoteDesktopApps.push(appGroup);
  }
}
