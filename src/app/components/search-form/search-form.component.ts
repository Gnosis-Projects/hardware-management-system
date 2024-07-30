import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonResponse } from '../../interfaces/responses/common-response';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Sorting } from '../../enums/sorting';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DeviceType, RemoteDesktopAppType, NetEquipmentType, PrinterType } from '../../enums/device-type';
import { HttpClient } from '@angular/common/http';
import { operationSystems } from '../../shared/os';
import { updateFormControls } from '../../shared/form-control';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, MatIconModule, MatButtonModule, CommonModule, TranslateModule]
})
export class SearchFormComponent implements OnInit, OnChanges {
  @Input() aUnits: CommonResponse[] = [];
  @Input() searchType: DeviceType = DeviceType.COMPUTER;
  @Output() search = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();
  operationSystems = operationSystems;
  searchForm: FormGroup;
  sorting = Sorting;
  printerType = PrinterType;
  netEquipmentType = NetEquipmentType;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.searchForm = this.fb.group({
      aUnitId: [0, Validators.required],
      filterDto: this.fb.group({
        deviceName: [''],
        model: [''],
        serialNumber: [''],
        ram: [0],
        ip: [''],
        macAddress: [''],
        operatingSystem: [''],
        ssd: [false],
        remoteDesktopAppId: [0],
        printerTypeId: [0],
        phoneNumber: [''],
        networkEquipmentTypeId: [null],
        floor: ['']
      }),
      workstationFilterDto: this.fb.group({
        employeeLastName: [''],
        employeeFirstName: [''],
        department: ['']
      }),
      sorting: this.fb.group({
        sortBy: [''],
        sortOrder: ['']
      })
    });
  }

  ngOnInit() {
    this.updateFormControls();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchType']) {
      this.updateFormControls();
    }
  }

  updateFormControls(): void {
    updateFormControls(this.searchForm, this.searchType);
  }

  onSubmit(): void {
    if (this.searchForm.valid) {
      let searchParams: any = {
        aUnitId: null,
        sorting: this.searchForm.value.sorting
      };

      const aUnitId = Number(this.searchForm.value.aUnitId);

      if (aUnitId !== null) {
        searchParams.aUnitId = Number(aUnitId);
      }

      if (this.searchType === DeviceType.COMPUTER) {
        searchParams.computerFilterDto = this.searchForm.value.filterDto;
        if (searchParams.computerFilterDto && searchParams.computerFilterDto.ram === null) {
          searchParams.computerFilterDto.ram = 0;
        }
      } else if (this.searchType === DeviceType.PHONE) {
        searchParams.phoneFilterDto = this.searchForm.value.filterDto;
      } else if (this.searchType === DeviceType.PRINTER) {
        searchParams.printerFilterDto = this.searchForm.value.filterDto;
        if (searchParams.printerFilterDto.printerTypeId !== null) {
          searchParams.printerFilterDto.printerTypeId = Number(searchParams.printerFilterDto.printerTypeId);
        }
      } else if (this.searchType === DeviceType.WORKSTATION) {
        searchParams.workstationFilterDto = this.searchForm.value.workstationFilterDto;
      } else {
        searchParams.netEquipmentFilterDto = this.searchForm.value.filterDto;
        if (searchParams.netEquipmentFilterDto && searchParams.netEquipmentFilterDto.networkEquipmentTypeId !== null) {
          searchParams.netEquipmentFilterDto.networkEquipmentTypeId = Number(searchParams.netEquipmentFilterDto.networkEquipmentTypeId);
        }
      }

      this.search.emit(searchParams);
    }
  }
}
