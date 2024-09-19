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
import { NetworkEquipmentType, OperatingSystem, PhoneType, PrinterType, RemoteDesktopApp, RemoteDesktopAppType, ServerDiskType } from '../../interfaces/requests/device-request';
import { DropdownService } from '../../services/dropdown.service';
import { Helper } from '../../shared/helpers';

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

  searchForm: FormGroup;
  sorting = Sorting;

  netEqs: NetworkEquipmentType[] = [];
  printerTypes: PrinterType[] = [];
  serverDiskTypes: ServerDiskType[] = [];
  operatingSystems: OperatingSystem[] = [];
  phoneTypes: PhoneType[] = [];
  remoteDesktopAppTypes: RemoteDesktopAppType[] = []

  constructor(private fb: FormBuilder, private http: HttpClient, private dropdownService: DropdownService) {
    this.searchForm = this.fb.group({
      aUnitId: [0, Validators.required],
      filterDto: this.fb.group({
        deviceName: [''],
        model: [''],
        serialNumber: [''],
        ram: [''],
        ip: [''],
        macAddress: [''],
        ssd: [false],
        operatingSystemId: [0],
        remoteDesktopAppId: [0],
        networkEquipmentTypeId: [0],
        printerTypeId: [0],
        phoneNumber: [''],
        phoneSocket: [''],
        phoneTypeId: [0],
        refurbished: [false],
        floor: [''],
        serverDiskTypeId: [0],
        diskRotations: [0],
        networkDisk: [false],
        ipTypeId: [0],
        routerUsername: [''],
        routerPassword: [''],
        address: [''],
        switchAddress: [''],
        ipAddress: [''],
        paperSize: ['']  
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
    this.loadFormState();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchType']) {
      this.updateFormControls();
    }
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

    this.dropdownService.getRemoteDesktopAppTypes().subscribe(types => {
      this.remoteDesktopAppTypes = types.data;
    });

    this.dropdownService.getNetEquipments().subscribe(types => {
      this.netEqs = types.data;
    });
  }

  updateFormControls(): void {
    updateFormControls(this.searchForm, this.searchType);
  }




  onSubmit(): void {
    if (this.searchForm.valid) {
      const searchParams: any = {
        aUnitId: this.searchForm.value.aUnitId !== null ? Number(this.searchForm.value.aUnitId) : null,
        sorting: this.searchForm.value.sorting
      };

      const filterDtoValue = this.searchForm.value.filterDto ? { ...this.searchForm.value.filterDto } : null;

      if (filterDtoValue) {
        Object.keys(filterDtoValue).forEach(key => {
          if (key !== 'macAddress' && key !=='ram' && (filterDtoValue[key] === null || filterDtoValue[key] === '' || filterDtoValue[key] === 0 || filterDtoValue[key] === false)) {
            delete filterDtoValue[key];
          }
        });
      }

      switch (this.searchType) {
        case DeviceType.COMPUTER:
          searchParams.computerFilterDto = filterDtoValue;
          break;
        case DeviceType.PHONE:
          searchParams.phoneFilterDto = filterDtoValue;
          break;
        case DeviceType.PRINTER:
          searchParams.printerFilterDto = filterDtoValue;
          break;
        case DeviceType.WORKSTATION:
          searchParams.workstationFilterDto = { ...this.searchForm.value.workstationFilterDto };
          break;
        case DeviceType.SERVER:
          searchParams.serverFilterDto = filterDtoValue;
          break;
        case DeviceType.NETWORK_EQUIPMENT:
          searchParams.networkEquipmentFilterDto = filterDtoValue;
          break;
      }

     
      this.search.emit(searchParams);
      this.saveFormState();
    }
  }
  saveFormState(): void {
    localStorage.setItem('searchFormState', Helper.encode(JSON.stringify(this.searchForm.value)));
  }

  loadFormState(): void {
    const savedState = localStorage.getItem('searchFormState');
    if (savedState) {
      this.searchForm.patchValue(JSON.parse(Helper.decode(savedState)));
    }
  }
}
