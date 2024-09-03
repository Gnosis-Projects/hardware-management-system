import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonResponse } from '../../interfaces/responses/common-response';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Sorting } from '../../enums/sorting';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DeviceType, NetEquipmentType } from '../../enums/device-type';
import { HttpClient } from '@angular/common/http';
import { operationSystems } from '../../shared/os';
import { updateFormControls } from '../../shared/form-control';
import { OperatingSystem, PhoneType, PrinterType, ServerDiskType } from '../../interfaces/requests/device-request';
import { DropdownService } from '../../services/dropdown.service';

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
  netEquipmentType = NetEquipmentType;

  printerTypes: PrinterType[] = [];
  serverDiskTypes: ServerDiskType[] = [];
  operatingSystems: OperatingSystem[] = [];
  phoneTypes: PhoneType[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient, private dropdownService: DropdownService) {
    this.searchForm = this.fb.group({
      aUnitId: [0, Validators.required],
      filterDto: this.fb.group({
        deviceName: [''],
        model: [''],
        serialNumber: [''],
        ram: [0],
        ip: [''],
        macAddress: [''],
        ssd: [false],
        operatingSystemId: [0],
        remoteDesktopAppId: [0],
        printerTypeId: [0],
        phoneNumber: [''],
        phoneSocket: [''],
        phoneTypeId: [0],
        floor: [''],
        serverDiskTypeId: [0],
        diskRotations: [0],
        networkDisk: [false],
        ipTypeId: [0],
        routerUsername: [''],
        routerPassword: [''],
        switchAddress: ['']
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
    this.loadDropdownData();
  }

  loadDropdownData(): void {
    this.dropdownService.getPrinterTypes().subscribe(types => {
      this.printerTypes = types.data;
    });

    this.dropdownService.getServerDiskTypes().subscribe(types => {
      this.serverDiskTypes = types.data;
    });

    this.dropdownService.getOperatingSystems().subscribe(types => {
      this.operatingSystems = types.data;
    });

    this.dropdownService.getPhoneTypes().subscribe(types => {
      this.phoneTypes = types.data;
    });
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
        searchParams.aUnitId = aUnitId;
      }

      const filterDtoValue = this.searchForm.value.filterDto;

      switch (this.searchType) {
        case DeviceType.COMPUTER:
          searchParams.computerFilterDto = filterDtoValue;
          if (searchParams.computerFilterDto && searchParams.computerFilterDto.ram === null) {
            searchParams.computerFilterDto.ram = 0;
          }
          break;
        case DeviceType.PHONE:
          searchParams.phoneFilterDto = filterDtoValue;
          break;
        case DeviceType.PRINTER:
          searchParams.printerFilterDto = filterDtoValue;
          if (searchParams.printerFilterDto.printerTypeId !== null) {
            searchParams.printerFilterDto.printerTypeId = Number(searchParams.printerFilterDto.printerTypeId);
          }
          break;
        case DeviceType.WORKSTATION:
          searchParams.workstationFilterDto = this.searchForm.value.workstationFilterDto;
          break;
        case DeviceType.SERVER:
          searchParams.serverFilterDto = filterDtoValue;
          break;
        case DeviceType.NETWORK_EQUIPMENT:
          if (filterDtoValue.networkEquipmentTypeId === this.netEquipmentType.ROUTER) {
            searchParams.routerFilterDto = filterDtoValue;
          } else if (filterDtoValue.networkEquipmentTypeId === this.netEquipmentType.SWITCH) {
            searchParams.switchFilterDto = filterDtoValue;
          }
          break;
      }

      this.search.emit(searchParams);
    }
  }
}
