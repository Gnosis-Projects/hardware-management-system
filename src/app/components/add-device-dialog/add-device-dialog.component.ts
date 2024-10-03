import { Component, inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TextFieldModule } from '@angular/cdk/text-field';
import { DeviceType, NetEquipmentType } from '../../enums/device-type';
import { IpType, PhoneType, RemoteDesktopAppType, ServerDiskType } from '../../interfaces/requests/device-request';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { OperatingSystem } from '../../interfaces/requests/device-request';
import { DropdownService } from '../../services/dropdown.service';
import { PrinterType } from '../../interfaces/requests/device-request';
import { WorkStationStateService } from '../../services/state-management/workstation-state.service';
import { DeviceService } from '../../services/device.service';
import { NetworkEquipmentType } from '../../interfaces/responses/device-response';

@Component({
  selector: 'app-add-device-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatButtonModule,
    TextFieldModule,
    MatCheckboxModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    TranslateModule,
  ],
  templateUrl: './add-device-dialog.component.html',
  styleUrls: ['./add-device-dialog.component.scss']
})
export class AddDeviceDialogComponent implements OnInit {
  deviceType: DeviceType | undefined;
  fb = inject(FormBuilder);
  http = inject(HttpClient);
  workstationState = inject(WorkStationStateService);
  deviceService = inject(DeviceService);
  dialogRef = inject(MatDialogRef<AddDeviceDialogComponent>);
  data = inject(MAT_DIALOG_DATA);
  dropdownService = inject(DropdownService);
  diskTypes: ServerDiskType[] = [];
  deviceForm: FormGroup;
  operatingSystems: OperatingSystem[] = [];
  printerTypes: PrinterType[] = [];
  remoteDesktopAppTypes: RemoteDesktopAppType[] = [];
  phoneTypes: PhoneType[] = [];
  ipTypes: IpType[] = [];
  netTypes: NetworkEquipmentType[] = []

  constructor() {
    this.deviceType = this.data.deviceType;

    this.deviceForm = this.fb.group({
      deviceName: ['', Validators.required],
      model: [''],
      serialNumber: ['', Validators.required],
      comments: [''],
      purchaseDate: [''],
      supplier: [''],
      phoneNumber: [''],
      phoneSocket: [''],
      phoneTypeId: [null],
      printerIp: [''],
      ram: [''],
      ip: [''],
      disks: this.fb.array([]),
      workGroupDomain: [''],
      paperSize: [''],
      printerTypeId: [null],
      networkDisk: [false],
      macAddress: [''],
      machineType: [''],
      monitorType: [''],
      serverDisks: this.fb.array([]),
      diskRotations: [''],
      outlet: [''],
      antivirus: [''],
      operatingSystemId: [null],
      computerPrinters: this.fb.array([]),
      networkEquipmentIp: this.fb.group({
        ipTypeId: [1, Validators.required],
        ip: ['']
      }),
      remoteDesktopApps: this.fb.array([]),
      refurbished: [false],
      networkEquipmentTypeId: [null, Validators.required],
      floor: [''],
      networkEquipmentFloor: [''],
      routerUsername: [''],
      routerPassword: [''],
      switchAddress: [''],
    });

    this.setValidatorsBasedOnDeviceType();
  }

  ngOnInit() {

    
    this.dropdownService.getPrinterTypes().subscribe(types => {
      this.printerTypes = types.data;
    });

    this.dropdownService.getRemoteDesktopAppTypes().subscribe(types => {
      this.remoteDesktopAppTypes = types.data;
    });

    this.dropdownService.getOperatingSystems().subscribe(types => {
      this.operatingSystems = types.data;
    });

    this.netTypes = [{
      "id": 1,
      "name": "Router"
    },
    {
      "id": 2,
      "name": "Switch"
    }]

    this.dropdownService.getPhoneTypes().subscribe(types => {
      this.phoneTypes = types.data;
    });

    this.dropdownService.getIPTypes().subscribe(types => {
      this.ipTypes = types.data;
    });

    this.dropdownService.getServerDiskTypes().subscribe(types => {
      this.diskTypes = types.data;
    });

    this.deviceForm.get('networkEquipmentTypeId')?.valueChanges.subscribe(type => {
      this.setValidatorsBasedOnNetworkType(type);
    });

    if (this.data) {
      this.deviceForm.patchValue(this.data);
    }

    const networkType = this.deviceForm.get('networkEquipmentTypeId')?.value;
    this.setValidatorsBasedOnNetworkType(networkType);
  }

  get serverDisks(): FormArray {
    return this.deviceForm.get('serverDisks') as FormArray;
  }


  addServerDisk() {
    const serverDiskGroup = this.fb.group({
      capacity: [''],
      diskRotations: [''],
      serverDiskTypeId: [null],
      networkDisk: [false],
      networkDiskInfo: this.fb.group({
        name: [''],
        diskArray: [''],
        ip: [''],
        brand: [''],
        supplier: [''],
        purchaseDate: [null]
      })
    });

    serverDiskGroup.get('networkDiskInfo')?.disable();

    serverDiskGroup.get('networkDisk')?.valueChanges.subscribe((checked) => {
      const networkDiskInfoGroup = serverDiskGroup.get('networkDiskInfo') as FormGroup;
      if (checked) {
        networkDiskInfoGroup.enable();
      } else {
        networkDiskInfoGroup.disable();
      }
    });

    this.serverDisks.push(serverDiskGroup);
  }

  removeServerDisk(index: number) {
    this.serverDisks.removeAt(index);
  }


  setValidatorsBasedOnDeviceType() {
    const clearValidators = (fields: string[]) => {
      fields.forEach(field => this.deviceForm.get(field)?.clearValidators());
    };

    const setValidators = (field: string, validators: any[]) => {
      this.deviceForm.get(field)?.setValidators(validators);
    };

    clearValidators([
      'ram', 'ip', 'printerTypeId', 'phoneNumber', 'phoneSocket', 'phoneTypeId', 'floor',
      'networkEquipmentTypeId', 'refurbished', 'routerUsername', 'routerPassword', 'switchAddress', 'networkEquipmentIp.ipTypeId', 'networkEquipmentIp.ip'
    ]);

    switch (this.deviceType) {
      case DeviceType.COMPUTER:
        this.addDisk();
        setValidators('operatingSystemId', [Validators.required]);
        break;
      case DeviceType.PRINTER:
        setValidators('printerTypeId', [Validators.required]);
        break;
      case DeviceType.PHONE:
        setValidators('phoneTypeId', [Validators.required]);
        break;
      case DeviceType.NETWORK_EQUIPMENT:
        setValidators('networkEquipmentTypeId', [Validators.required]);
        break;
      case DeviceType.SERVER:
        setValidators('serverDiskTypeId', [Validators.required]);
        setValidators('operatingSystemId', [Validators.required]);
        break;
    }

    this.deviceForm.updateValueAndValidity();
  }

  setValidatorsBasedOnNetworkType(type: NetEquipmentType) {
    const switchAddressControl = this.deviceForm.get('switchAddress');

    if (type === NetEquipmentType.ROUTER) {
      switchAddressControl?.disable();
      switchAddressControl?.setValue('Φλέμινγκ')
      switchAddressControl?.clearValidators();
    } else if (type === NetEquipmentType.SWITCH) {
      this.deviceForm.get('routerUsername')?.clearValidators();
      this.deviceForm.get('routerPassword')?.clearValidators();
      switchAddressControl?.enable();
      switchAddressControl?.setValidators([Validators.required]);
    }

    this.deviceForm.updateValueAndValidity();
  }

  get remoteDesktopApps(): FormArray {
    return this.deviceForm.get('remoteDesktopApps') as FormArray;
  }

  get computerPrinters(): FormArray {
    return this.deviceForm.get('computerPrinters') as FormArray;
  }

  get disks(): FormArray {
    return this.deviceForm.get('disks') as FormArray;
  }

  removePrinter(index: number) {
    this.computerPrinters.removeAt(index);
  }

  addPrinter() {
    const printerGroup = this.fb.group({
      typeId: [null, Validators.required],
      ipAddress: [''],
    });

    printerGroup.get('typeId')?.valueChanges.subscribe(value => {
      const ipControl = printerGroup.get('ipAddress');
      if (this.isNetworkPrinter(value)) {
        ipControl?.setValidators([Validators.required]);
      } else {
        ipControl?.clearValidators();
      }
      ipControl?.updateValueAndValidity();
    });

    this.computerPrinters.push(printerGroup);
  }

  addDisk() {
    this.disks.push(this.fb.group({
      capacity: [0, Validators.required],
      ssd: [false]
    }));
  }

  onRemoteDesktopAppChange(typeId: RemoteDesktopAppType) {
    this.remoteDesktopApps.clear();
    const appGroup = this.fb.group({
      name: [''],
      typeId: [typeId],
      userId: [''],
      password: [''],
    });
    this.remoteDesktopApps.push(appGroup);
  }

  onSave() {
    if (this.deviceForm.valid) {
      let deviceData = { ...this.deviceForm.value };
      const workStationId = Number(this.workstationState.getWorkstationId());

      if (this.deviceType === DeviceType.NETWORK_EQUIPMENT) {
        const networkEquipmentIp = this.deviceForm.get('networkEquipmentIp')?.value;
        const floorValue = this.deviceForm.get('floor')?.value;

        deviceData = {
          ...deviceData,
          networkEquipmentIp: {
            ipTypeId: networkEquipmentIp.ipTypeId,
            ip: networkEquipmentIp.ip,
          },
          networkEquipmentFloor: floorValue,
        };
      }


      if (this.deviceType !== DeviceType.COMPUTER) {
        const computerFields = [
          'ram', 'ssd', 'ip', 'disks', 'antivirus',
          'macAddress', 'outlet', 'remoteDesktopApps', 'machineType',
          'workGroupDomain', 'operatingSystemId','monitorType', 'computerPrinters',
        ];
        computerFields.forEach(field => delete deviceData[field]);
      }

      if (this.deviceType !== DeviceType.COMPUTER && this.deviceType !== DeviceType.PRINTER) {
        delete deviceData.refurbished;
      }
      if (this.deviceType !== DeviceType.PRINTER) {
        delete deviceData.printerTypeId;
        delete deviceData.paperSize;
        delete deviceData.printerIp;
      }
      if (this.deviceType !== DeviceType.PHONE) {
        delete deviceData.phoneNumber;
        delete deviceData.phoneSocket;
        delete deviceData.phoneTypeId;
      }
      if (this.deviceType !== DeviceType.NETWORK_EQUIPMENT) {
        delete deviceData.networkEquipmentTypeId;
        delete deviceData.floor;
        delete deviceData.routerUsername;
        delete deviceData.routerPassword;
        delete deviceData.switchAddress;
        delete deviceData.networkEquipmentIp;
        delete deviceData.networkEquipmentFloor
      }
      if (this.deviceType !== DeviceType.SERVER) {
        delete deviceData.diskRotations;
        delete deviceData.networkDisk;
        delete deviceData.serverDiskTypeId;
        delete deviceData.networkDiskInfo;
        delete deviceData.serverDisks;
      }

      if (this.deviceType !== DeviceType.COMPUTER && this.deviceType !== DeviceType.SERVER) {
        delete deviceData.operatingSystemId;
      }

      this.dialogRef.close(deviceData);
    } else {
      
      Object.keys(this.deviceForm.controls).forEach(field => {
        const control = this.deviceForm.get(field);
        if (control && control.invalid) {
          console.log(`Field '${field}' is invalid`, control.errors);
        }
      });
      this.deviceForm.markAllAsTouched();
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  isNetworkPrinter(typeId: number | null): boolean {
    return typeId === this.printerTypes.find(type => type.name === 'Δικτυακός')?.id;
  }
}
