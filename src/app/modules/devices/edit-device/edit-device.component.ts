import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DeviceService } from '../../../services/device.service';
import { DeviceStateService } from '../../../services/state-management/device-state.service';
import { EditDeviceRequest, IpType, OperatingSystem, PhoneType, ServerDiskType } from '../../../interfaces/requests/device-request';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { DeviceType } from '../../../enums/device-type';
import { DropdownService } from '../../../services/dropdown.service';
import { PrinterType, RemoteDesktopAppType } from '../../../interfaces/requests/device-request';
import { NetworkEquipmentType } from '../../../interfaces/responses/device-response';
import { WorkStationStateService } from '../../../services/state-management/workstation-state.service';
import { WorkStationService } from '../../../services/workstation.service';
import { CarrierStateService } from '../../../services/state-management/carrier-state.service';
import { WorkStation } from '../../../interfaces/responses/workstation-response';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-edit-device',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, MatAutocompleteModule,MatInputModule,MatFormFieldModule,MatSelectModule,MatCheckboxModule, ReactiveFormsModule, MatGridListModule,MatIconModule,MatButtonModule, RouterModule, TranslateModule],
  templateUrl: './edit-device.component.html',
  styleUrls: ['./edit-device.component.scss'],
})
export class EditDeviceComponent implements OnInit {

  editForm: FormGroup;
  deviceId: number | null = null;
  deviceType: DeviceType | null = null;
  DeviceType = DeviceType;
  newId: number = 0;
  operatingSystems: OperatingSystem[] = [];
  diskTypes: ServerDiskType[] = [];
  printerTypes: PrinterType[] = [];
  ipTypes: IpType[] = []
  remoteDesktopAppTypes: RemoteDesktopAppType[] = [];
  phoneTypes: PhoneType[] = [];
  netTypes: NetworkEquipmentType[] = [];
  carrierId: number = 0;
  carrier: string = '';
  availableWorkstations: WorkStation[] = [];
  preFilledIpType: string = ''
  isItemInWarehouse:boolean = false

  constructor(
    private fb: FormBuilder,
    private deviceService: DeviceService,
    private deviceStateService: DeviceStateService,
    private workstationStateService: WorkStationStateService,
    private workstationService: WorkStationService,
    public carrierStateService: CarrierStateService,
    private router: Router,
    private translate: TranslateService,
    private dropdownService: DropdownService,
    private toastr: ToastrService
  ) {
    this.editForm = this.fb.group({
      id: [null],
      model: [''],
      serialNumber: [''],
      deviceName: [''],
      ram: [''],
      ip: [''],
      macAddress: [''],
      machineType: [''],
      monitorType: [''],
      outlet: [''],
      antivirus: [''],
      printerIp:[''],
      workGroupDomain: [''],
      networkDiskInfo: this.fb.group({
        name: [''],
        diskArray: [''],
        ip: [''],
        brand: [''],
        supplier: [''],
        purchaseDate: [''],
      }),
      networkEquipmentIp: this.fb.group({
        ipTypeId: [null],
        ip: ['']
      }),
      newWorkstationId: [0],
      operatingSystemId: [null],
      disks: this.fb.array([]),
      phoneNumber: [''],
      phoneSocket: [''],
      phoneTypeId: [null],
      switchAddress: [''],
      computerPrinters: this.fb.array([]),
      printerTypeId: [null],
      paperSize: [''],
      serverDisks:this.fb.array([]),
      diskRotations: [null],
      toBeDestroyed: [false],
      networkDisk: [false],
      networkEquipmentTypeId: [null],
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
  }

    get serverDisks(): FormArray {
    return this.editForm.get('serverDisks') as FormArray;
  }
  ngOnInit(): void {
 
    if (this.deviceType === DeviceType.SERVER) {
      this.serverDisks.clear();
    }

    this.dropdownService.getPrinterTypes().subscribe(types => this.printerTypes = types.data);
    this.dropdownService.getRemoteDesktopAppTypes().subscribe(types => this.remoteDesktopAppTypes = types.data);
    this.dropdownService.getOperatingSystems().subscribe(types => this.operatingSystems = types.data);
    this.netTypes = [ {
      "id": 1,
      "name": "Router"
    },
    {
      "id": 2,
      "name": "Switch"
    }]
    this.dropdownService.getPhoneTypes().subscribe(types => this.phoneTypes = types.data);
    this.dropdownService.getServerDiskTypes().subscribe(types => this.diskTypes = types.data);
    this.dropdownService.getIPTypes().subscribe(types => this.ipTypes = types.data);
    this.deviceId = this.deviceStateService.getSelectedDeviceId();
    this.deviceType = this.deviceStateService.getSelectedDeviceType();

    if (this.deviceId && this.deviceType) {
      this.loadDeviceData(this.deviceId, this.deviceType);
    }
    this.editForm.get('networkDisk')?.valueChanges.subscribe(value => {
      this.toggleNetworkDiskInfo(value);
    });

    this.editForm.get('networkEquipmentTypeId')?.valueChanges.subscribe((value) => {
      this.onNetworkEquipmentTypeChange(value);
    });

  }
  
  toggleNetworkDiskInfo(show: boolean): void {
    const networkDiskInfo = this.editForm.get('networkDiskInfo');
    if (show) {
      networkDiskInfo?.enable();
    } else {
      networkDiskInfo?.disable();
    }
  }

  get remoteDesktopApps(): FormArray {
    return this.editForm.get('remoteDesktopApps') as FormArray;
  }

  
  get computerPrinters(): FormArray {
    return this.editForm.get('computerPrinters') as FormArray;
  }

  get disks(): FormArray {
    return this.editForm.get('disks') as FormArray;
  }

  loadDeviceData(deviceId: number, deviceType: DeviceType): void {
    this.deviceService.getDeviceById(deviceId, deviceType).subscribe({
      next: (response) => {
        if (response.success) {
          this.isItemInWarehouse = response.data.workStation?.employeeFirstName === 'Warehouse'
          this.editForm.patchValue(response.data);
          this.newId = response.data.workStation?.id ?? 0;
          this.carrierId = response.data.workStation?.carrier?.id ?? 0;
          this.carrier = response.data.workStation?.carrier?.name ?? '';

          if (this.carrierId) {
            this.workstationService.getWorkstationList(this.carrierId, {}).subscribe({
              next: (workstationResponse) => {
                this.availableWorkstations = workstationResponse.data
                  .filter(ws => ws.id !== this.newId)
                  .sort((a, b) => a.employeeLastName.localeCompare(b.employeeLastName));;
              },
            });
          }

          this.editForm.get('comments')?.setValue('')

          if (this.deviceType === DeviceType.PHONE && response.data.phoneType) {
            this.editForm.get('phoneTypeId')?.setValue(response.data.phoneType.id);
          }

          if (this.deviceType === DeviceType.PRINTER && response.data.printerType) {
            this.editForm.get('printerTypeId')?.setValue(response.data.printerType.id);
          }

          if (this.deviceType === DeviceType.SERVER) {
            if (response.data.serverDiskType) {
              this.editForm.get('serverDiskTypeId')?.setValue(response.data.serverDiskType.id);
            }
            if (response.data.operatingSystem) {
              this.editForm.get('operatingSystemId')?.setValue(response.data.operatingSystem.id);
            }

            if (response.data.networkDiskInfo) {
              this.editForm.get('networkDiskInfo')?.patchValue({
                name: response.data.networkDiskInfo.name,
                diskArray: response.data.networkDiskInfo.diskArray,
                ip: response.data.networkDiskInfo.ip,
                brand: response.data.networkDiskInfo.brand,
                supplier: response.data.networkDiskInfo.supplier,
               
              });
            }
          }

          if (this.deviceType === DeviceType.NETWORK_EQUIPMENT) {
            if (response.data.networkEquipmentType) {
              this.editForm.get('networkEquipmentTypeId')?.setValue(response.data.networkEquipmentType.id);
              this.onNetworkEquipmentTypeChange(response.data.networkEquipmentType.id);
            }
            if (response.data.networkEquipmentIP) {
              const networkIP = response.data.networkEquipmentIP;
              this.editForm.get('networkEquipmentIp')?.patchValue({
                ipTypeId: networkIP.id,
                ip: networkIP.ip
              });
              this.preFilledIpType = networkIP.name;
            }

            if (response.data.networkEquipmentType?.id === 1) {
              this.editForm.get('routerUsername')?.setValue(response.data.routerUsername);
              this.editForm.get('routerPassword')?.setValue(response.data.routerPassword);
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

            if (response.data.operatingSystem) {
              this.editForm.get('operatingSystemId')?.setValue(response.data.operatingSystem.id);
            }

            if (response.data.remoteDesktopApps) {
              this.editForm.get('remoteDesktopApp')?.setValue(response.data.remoteDesktopApps[0]?.typeId);
            }

            if (response.data.computerPrinters) {
              this.computerPrinters.clear();
              response.data.computerPrinters.forEach((printer: any) => {
                this.computerPrinters.push(this.fb.group({
                  id: [printer.id],
                  typeId: [printer.typeId, Validators.required],
                  ipAddress: [printer.ipAddress],
                }));
              });
            }

            if (response.data.remoteDesktopApps && response.data.remoteDesktopApps.length > 0) {
              this.remoteDesktopApps.clear();
              response.data.remoteDesktopApps.forEach((app: any) => {
                this.remoteDesktopApps.push(this.fb.group({
                  typeId: [app.typeId],
                  userId: [app.userId],
                  password: [app.password],
                }));
              });
            }
          }
          
          if (response.data.purchaseDate) {
            const formattedDate = response.data.purchaseDate === '1900-01-01T00:00:00'
              ? ''
              : new Date(response.data.purchaseDate).toISOString().substring(0, 10);
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

  removePrinter(index: number): void {
    this.computerPrinters.removeAt(index);
  }

  submitEdit(): void {
    if (this.editForm.valid && this.deviceId && this.deviceType) {
      
      const editRequest: EditDeviceRequest = {
        id: this.deviceId,
        ...this.editForm.value,
      };
  
      const newWorkstationId = this.editForm.get('newWorkstationId')?.value;
      this.editForm.removeControl('newWorkstationId');
  
      if (newWorkstationId && newWorkstationId !== 0) {
        editRequest.newWorkstationId = newWorkstationId;
      }
      const purchaseDate = this.editForm.get('purchaseDate')?.value;
      if (!purchaseDate || purchaseDate === '0000-12-31') {
          delete editRequest.purchaseDate; 
      }

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
  
      this.deviceService.editDevice(editRequest, this.deviceType, newWorkstationId).subscribe({
        next: (response) => {
          if (response.success) {
            this.toastr.success(this.translate.instant('successMessages.device.updated.successfully'));
            let workstationId = this.workstationStateService.getWorkstationId();
            if (workstationId !== this.newId) {
              workstationId = this.newId;
              this.workstationStateService.setWorkstationId(workstationId);
            }
            this.router.navigate(['/workstation']);
          } else {
            this.toastr.error(response.message);
          }
        },
        error: (error) => {
          this.toastr.error(this.translate.instant('errorMessages.error.editing.device'));
        },
      });

    } else {
      this.editForm.markAllAsTouched();
      const invalidControls = this.findInvalidControls();
      this.toastr.error(this.translate.instant('form.errors'));
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

  onNetworkEquipmentTypeChange(networkEquipmentTypeId: number): void {
    const switchAddressControl = this.editForm.get('switchAddress');
    if (networkEquipmentTypeId === 1) {
      switchAddressControl?.setValue('Φλέμινγκ');
      switchAddressControl?.disable();
      this.editForm.get('routerUsername')?.setValidators(Validators.required);
      this.editForm.get('routerPassword')?.setValidators(Validators.required);
    } else {
      switchAddressControl?.setValue('');
      switchAddressControl?.enable();
      this.editForm.get('routerUsername')?.clearValidators();
      this.editForm.get('routerPassword')?.clearValidators();
    }
    this.editForm.get('routerUsername')?.updateValueAndValidity();
    this.editForm.get('routerPassword')?.updateValueAndValidity();
  }

  private removeNonComputerFields(editRequest: EditDeviceRequest) {
    delete editRequest.phoneNumber;
    delete editRequest.networkEquipmentIp;
    delete editRequest.phoneSocket;
    delete editRequest.phoneTypeId;
    delete editRequest.networkDiskInfo;
    delete editRequest.printerTypeId;
    delete editRequest.computerPrinters;
    delete editRequest.paperSize;
    delete editRequest.serverDisks;
    delete editRequest.diskRotations;
    delete editRequest.networkDisk;
    delete editRequest.networkEquipmentTypeId;
    delete editRequest.routerPassword;
    delete editRequest.routerUsername;
    delete editRequest.networkEquipmentFloor;
    delete editRequest.switchAddress;
  }

  private removeNonPhoneFields(editRequest: EditDeviceRequest) {
    delete editRequest.ram;
    delete editRequest.ip;
    delete editRequest.macAddress;
    delete editRequest.machineType;
    delete editRequest.monitorType;
    delete editRequest.networkEquipmentIp;
    delete editRequest.outlet;
    delete editRequest.antivirus;
    delete editRequest.workGroupDomain;
    delete editRequest.networkDiskInfo;
    delete editRequest.operatingSystemId;
    delete editRequest.disks;
    delete editRequest.computerPrinters;
    delete editRequest.remoteDesktopApps;
    delete editRequest.remoteDesktopApp;
    delete editRequest.printerTypeId;
    delete editRequest.paperSize;
    delete editRequest.serverDisks;
    delete editRequest.diskRotations;
    delete editRequest.networkDisk;
    delete editRequest.networkEquipmentTypeId;
    delete editRequest.routerPassword;
    delete editRequest.routerUsername;
    delete editRequest.networkEquipmentFloor;
    delete editRequest.switchAddress;
  }


  private removeNonPrinterFields(editRequest: EditDeviceRequest) {
    delete editRequest.ram;
    delete editRequest.ip;
    delete editRequest.macAddress;
    delete editRequest.machineType;
    delete editRequest.monitorType;
    delete editRequest.networkDiskInfo;
    delete editRequest.outlet;
    delete editRequest.antivirus;
    delete editRequest.networkEquipmentIp;
    delete editRequest.workGroupDomain;
    delete editRequest.operatingSystemId;
    delete editRequest.disks;
    delete editRequest.computerPrinters;
    delete editRequest.remoteDesktopApps;
    delete editRequest.remoteDesktopApp;
    delete editRequest.phoneNumber;
    delete editRequest.phoneSocket;
    delete editRequest.phoneTypeId;
    delete editRequest.serverDisks;
    delete editRequest.diskRotations;
    delete editRequest.networkDisk;
    delete editRequest.networkEquipmentTypeId;
    delete editRequest.routerPassword;
    delete editRequest.routerUsername;
    delete editRequest.networkEquipmentFloor;
    delete editRequest.switchAddress;
  }

  private removeNonServerFields(editRequest: EditDeviceRequest) {
    delete editRequest.ram;
    delete editRequest.ip;
    delete editRequest.macAddress;
    delete editRequest.machineType;
    delete editRequest.monitorType;
    delete editRequest.outlet;
    delete editRequest.antivirus;
    delete editRequest.workGroupDomain
    delete editRequest.networkEquipmentIp;;
    delete editRequest.computerPrinters;
    delete editRequest.remoteDesktopApps;
    delete editRequest.remoteDesktopApp;
    delete editRequest.phoneNumber;
    delete editRequest.phoneSocket;
    delete editRequest.serverDisks;
    delete editRequest.phoneTypeId;
    delete editRequest.printerTypeId;
    delete editRequest.paperSize;
    delete editRequest.networkEquipmentTypeId;
    delete editRequest.routerPassword;
    delete editRequest.routerUsername;
    delete editRequest.networkEquipmentFloor;
    delete editRequest.switchAddress;
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
    delete editRequest.computerPrinters;
    delete editRequest.remoteDesktopApps;
    delete editRequest.remoteDesktopApp;
    delete editRequest.phoneNumber;
    delete editRequest.phoneSocket;
    delete editRequest.networkDiskInfo;
    delete editRequest.phoneTypeId;
    delete editRequest.printerTypeId;
    delete editRequest.paperSize;
    delete editRequest.serverDisks;
    delete editRequest.diskRotations;
    delete editRequest.networkDisk;
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
