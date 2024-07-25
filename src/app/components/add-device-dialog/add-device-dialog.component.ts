import { Component, inject, Input, OnInit } from '@angular/core';
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
import { DeviceType, NetEquipmentType, PrinterType } from '../../enums/device-type';
import { RemoteDesktopAppType } from '../../enums/device-type';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { operationSystems } from '../../shared/os';

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
  dialogRef = inject(MatDialogRef<AddDeviceDialogComponent>);
  data = inject(MAT_DIALOG_DATA);
  deviceForm: FormGroup;
  RemoteDesktopAppType = RemoteDesktopAppType;
  operationSystems = operationSystems;
  printerType = PrinterType;
  netEquipmentType = NetEquipmentType;

  constructor() {
    this.deviceType = this.data.deviceType;
    this.RemoteDesktopAppType = RemoteDesktopAppType;

    this.deviceForm = this.fb.group({
      deviceName: ['', Validators.required],
      model: ['', Validators.required],
      serialNumber: ['', Validators.required],
      ram: [null],
      ip: [''],
      disks: this.fb.array([]),
      printerTypeId: [null],
      workGroupDomain: [''],
      macAddress: [''],
      machineType: [''],
      operatingSystem: [''],
      phoneNumber: [''],
      monitorType: [''],
      comments: [''],
      outlet: [''],
      antivirus: [''],
      remoteDesktopApps: this.fb.array([]),
      purchaseDate: [''],
      floor: [''],
      networkEquipmentTypeId: [null]
    });

    this.setValidatorsBasedOnDeviceType();
  }

  ngOnInit() {
    if (this.data) {
      this.deviceForm.patchValue(this.data);
    }
  }

  setValidatorsBasedOnDeviceType() {
    const clearValidators = (fields: string[]) => {
      fields.forEach(field => this.deviceForm.get(field)?.clearValidators());
    };
  
    const setValidators = (field: string, validators: any[]) => {
      this.deviceForm.get(field)?.setValidators(validators);
    };
  
    clearValidators(['ram', 'ip', 'printerTypeId', 'phoneNumber','floor', 'networkEquipmentTypeId']);
  
    switch (this.deviceType) {
      case DeviceType.COMPUTER:
        setValidators('ram', [Validators.required]);
        setValidators('ip', [Validators.required]);
        this.addDisk();
        break;
      case DeviceType.PRINTER:
        setValidators('printerTypeId', [Validators.required]);
        break;
      case DeviceType.PHONE:
        setValidators('phoneNumber', [Validators.required]);
        break;
      case DeviceType.NETWORK_EQUIPMENT:
        setValidators('networkEquipmentTypeId', [Validators.required]);
        setValidators('floor', [Validators.required]);
        break;
    }
  
    this.deviceForm.updateValueAndValidity();
  }

  get remoteDesktopApps(): FormArray {
    return this.deviceForm.get('remoteDesktopApps') as FormArray;
  }

  get disks(): FormArray {
    return this.deviceForm.get('disks') as FormArray;
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
      typeId: [typeId],
      userId: [''],
      password: [''],
    });
    this.remoteDesktopApps.push(appGroup);
  }

  onSave() {
    if (this.deviceForm.valid) {
      const deviceData = this.deviceForm.value;
      if (this.deviceType !== DeviceType.COMPUTER) {
        const computerFields = [
          'ram', 'ssd', 'ip', 'disks', 'operatingSystem', 'antivirus',
          'macAddress', 'outlet', 'remoteDesktopApps', 'machineType',
          'workGroupDomain', 'monitorType'
        ];
        computerFields.forEach(field => delete deviceData[field]);
      }
      if (this.deviceType !== DeviceType.PRINTER) {
        delete deviceData.printerTypeId;
      }

      if (this.deviceType !== DeviceType.PHONE) {
        delete deviceData.phoneNumber;
      }

      if (this.deviceType !== DeviceType.NETWORK_EQUIPMENT) {
        delete deviceData.networkEquipmentTypeId;
        delete deviceData.floor;
      }

      this.dialogRef.close(deviceData);
    } else {
      this.deviceForm.markAllAsTouched();
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
