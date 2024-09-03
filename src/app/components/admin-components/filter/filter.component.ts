import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FilterType } from '../../../enums/filter-type.enum';
import { CommonModule, KeyValuePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CommonResponse } from '../../../interfaces/responses/common-response';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HttpClient } from '@angular/common/http';
import { AUnitService } from '../../../services/aunit.service';
import { DropdownService } from '../../../services/dropdown.service';
import { IpType, OperatingSystem, PhoneType, PrinterType, RemoteDesktopApp, ServerDiskType } from '../../../interfaces/requests/device-request';
import { NetworkEquipmentType } from '../../../interfaces/responses/device-response';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, MatTooltipModule, MatSidenavModule, MatButtonModule, MatIconModule, CommonModule, TranslateModule, KeyValuePipe]
})
export class FilterComponent implements OnInit, OnChanges {
  @Input() filterType: FilterType = FilterType.Computer;
  @Input() carriers: CommonResponse[] = [];
  @Output() filter = new EventEmitter<any>();

  showFilter: boolean = false;
  filterForm: FormGroup;
  operatingSystems: OperatingSystem[] = [];
  aUnits: CommonResponse[] = [];
  printerTypes: PrinterType[] = [];
  phoneTypes: PhoneType[] = [];
  serverDiskTypes: ServerDiskType[] = [];
  netTypes: NetworkEquipmentType[] = [];
  ipTypes: IpType[] = [];
  remoteDesktopAppTypes: RemoteDesktopApp[] = [];

  FilterType = FilterType;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private aUnitService: AUnitService,
    private dropdownService: DropdownService
  ) {
    this.filterForm = this.fb.group({});
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['filterType'] || changes['carriers']) {
      this.initializeForm();

    }
  }

  ngOnInit(): void {
    this.loadDropdownData();
  }

  toggleFilter(): void {
    this.showFilter = !this.showFilter;
  }

  initializeForm() {
    let controls: any = {
      carrierId: [null],
      aUnitId: [{ value: null, disabled: true }]
    };

    switch (this.filterType) {
      case FilterType.Phone:
        controls = {
          ...controls,
          deviceName: [''],
          model: [''],
          serialNumber: [''],
          phoneNumber: [''],
          phoneSocket: [''],
          phoneTypeId: [0]
        };
        break;
      case FilterType.Printer:
        controls = {
          ...controls,
          deviceName: [''],
          model: [''],
          serialNumber: [''],
          printerTypeId: [null],
          refurbished: [false],
          paperSize: ['']
        };
        break;
      case FilterType.NetEquipment:
        controls = {
          ...controls,
          deviceName: [''],
          model: [''],
          serialNumber: [''],
          floor: [''],
          networkEquipmentTypeId: [null],
          ipTypeId: [null],
          ipAddress: [''],
          routerUsername: [''],
          routerPassword: [''],
          switchAddress: ['']
        };
        break;
      case FilterType.Computer:
        controls = {
          ...controls,
          deviceName: [''],
          model: [''],
          serialNumber: [''],
          ram: [0],
          ip: [''],
          macAddress: [''],
          operatingSystemId: [null]
        };
        break;
      case FilterType.Server:
        controls = {
          ...controls,
          deviceName: [''],
          model: [''],
          serialNumber: [''],
          operatingSystemId: [null],
          serverDiskTypeId: [null],
          diskRotations: [null],
          networkDisk: [false]
        };
        break;
      case FilterType.Workstation:
        controls = {
          ...controls,
          employeeLastName: [''],
          employeeFirstName: [''],
          department: ['']
        };
        break;
    }

    this.filterForm = this.fb.group(controls);

    this.filterForm.get('carrierId')?.valueChanges.subscribe(carrierId => {
      this.onCarrierChange(carrierId);
    });
  }

  loadDropdownData(): void {
    this.dropdownService.getPrinterTypes().subscribe((response) => {
      this.printerTypes = response.data;
    });

    this.dropdownService.getPhoneTypes().subscribe((response) => {
      this.phoneTypes = response.data;
    });

    this.dropdownService.getServerDiskTypes().subscribe((response) => {
      this.serverDiskTypes = response.data;
    });

    this.dropdownService.getOperatingSystems().subscribe((response) => {
      this.operatingSystems = response.data;
    });

    this.dropdownService.getNetEquipments().subscribe((response) => {
      this.netTypes = response.data;
    });

    this.dropdownService.getIPTypes().subscribe((response) => {
      this.ipTypes = response.data;
    });

    this.dropdownService.getRemoteDesktopAppTypes().subscribe((response) => {
      this.remoteDesktopAppTypes = response.data;
    });
  }

  onCarrierChange(carrierId: number): void {
    if (carrierId) {
      this.aUnitService.getAUnitsByCarrierId(carrierId).subscribe(aUnits => {
        this.aUnits = aUnits.data;
        this.filterForm.get('aUnitId')?.enable();
        this.filterForm.patchValue({ aUnitId: null });
      });
    } else {
      this.aUnits = [];
      this.filterForm.get('aUnitId')?.disable();
      this.filterForm.patchValue({ aUnitId: null });
    }
  }

  onFilter(): void {
    if (this.filterForm.valid) {
      const { carrierId, aUnitId, ...filterDto } = this.filterForm.getRawValue();

      Object.keys(filterDto).forEach(key => {
        if (filterDto[key] === null || filterDto[key] === '') {
          delete filterDto[key];
        }
      });

      this.filter.emit({ carrierId, aUnitId, filterDto });
    }
  }
  onReset(): void {
    this.filterForm.reset({
      carrierId: null,
      aUnitId: null,
      deviceName: '',
      model: '',
      serialNumber: '',
      ram: 0,
      ip: '',
      macAddress: '',
      operatingSystemId: null,
      employeeLastName: '',
      employeeFirstName: '',
      department: ''
    });
    this.aUnits = [];
    this.filterForm.get('aUnitId')?.disable();
  }
}
