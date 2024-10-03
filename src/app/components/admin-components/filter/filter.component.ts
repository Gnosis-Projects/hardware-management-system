import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
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
import { DeviceType } from '../../../enums/device-type';
import { DepartmentsService } from '../../../services/departments.service';
import { MunicipalOfficesService } from '../../../services/municipalOffices.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [ReactiveFormsModule, MatTooltipModule, MatSidenavModule, MatButtonModule, MatIconModule, CommonModule, TranslateModule, KeyValuePipe]
})
export class FilterComponent implements OnInit, OnChanges {
  @Input() filterType: FilterType = FilterType.Computer;
  @Input() carriers: CommonResponse[] = [];
  @Input() offices?: CommonResponse[] = [];
  @Input() departments?: CommonResponse[] = [];
  @Output() filter = new EventEmitter<any>();
  @Output() pageSizeChange = new EventEmitter<number>();

  showFilter: boolean = false;
  filterForm: FormGroup;
  operatingSystems: OperatingSystem[] = [];
  aUnits: CommonResponse[] = [];
  deps: CommonResponse[] = [];
  printerTypes: PrinterType[] = [];
  phoneTypes: PhoneType[] = [];
  serverDiskTypes: ServerDiskType[] = [];
  netTypes: NetworkEquipmentType[] = [];
  ipTypes: IpType[] = [];
  remoteDesktopAppTypes: RemoteDesktopApp[] = [];


  resultsPerPageOptions: number[] = [10, 20, 30, 50, 60];

  FilterType = FilterType;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private aUnitService: AUnitService,
    private departmentsService: DepartmentsService,
    private munOfficesService: MunicipalOfficesService,
    private dropdownService: DropdownService
  ) {
    this.filterForm = this.fb.group({});
  }

  onPageSizeChange(event: any): void {
    const selectedPageSize = event.target.value;
    this.pageSizeChange.emit(parseInt(selectedPageSize, 10));
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
      deviceName: [''],
      model: ['' ],
      serialNumber: ['' ],
      carrierId: [null],
      aUnitId: [{ value: null, disabled: true }],
      departmentId:  [{ value: null, disabled: true }],
      municipalOfficeId: [{ value: null, disabled: true }]
    };

    switch (this.filterType) {
      case FilterType.Phone:
        controls = {
          ...controls,
          phoneNumber: [''],
          phoneSocket: [''],
          phoneTypeId: [0]
        };
        break;
      case FilterType.Printer:
        controls = {
          ...controls,
          printerTypeId: [null],
          printerIp: [''],
          refurbished: [false],
          paperSize: ['']
        };
        break;
      case FilterType.NetEquipment:
        controls = {
          ...controls,
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
          ram: [''],
          ip: [''],
          macAddress: [''],
          operatingSystemId: [null]
        };
        break;
      case FilterType.Server:
        controls = {
          ...controls,
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
          address: [''],
          department: [''],
          hideWarehouses: [false] 
        };
        break;
    }

    this.filterForm = this.fb.group(controls);

    this.filterForm.get('carrierId')?.valueChanges.subscribe(carrierId => {
      this.onCarrierChange(carrierId);
    });

    this.filterForm.get('municipalOfficeId')?.valueChanges.subscribe(municipalOfficeId => {
      this.onOfficeChange(municipalOfficeId);
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
    
    if (carrierId && carrierId.toString() !== 'null') {
      this.aUnitService.getAUnitsByCarrierId(carrierId).subscribe(aUnits => {
        this.aUnits = aUnits.data;
        this.filterForm.get('aUnitId')?.enable();
        this.filterForm.patchValue({ aUnitId: null });
        this.filterForm.get('municipalOfficeId')?.enable();
        this.filterForm.patchValue({ municipalOfficeId: null });
      });
      this.munOfficesService.getAllByCarrier(carrierId).subscribe(offices => {
        this.offices = offices.data;
      });
    } else {
      this.offices = [];
      this.filterForm.get('aUnitId')?.disable();
      this.filterForm.get('municipalOfficeId')?.disable();
    }
  }
  

  onOfficeChange(municipalOfficeId: number): void {
    if (municipalOfficeId) {
      this.departmentsService.getAllByMunicipalOffice(municipalOfficeId).subscribe(deps => {
        this.departments = deps.data;
        this.filterForm.get('departmentId')?.enable();
        this.filterForm.patchValue({ departmentId: null });
      });
    } else {
      this.departments = [];
      this.filterForm.get('departmentId')?.disable();
    }
  }

  onFilter(): void {
    if (this.filterForm.valid) {
      const { carrierId, aUnitId, departmentId, municipalOfficeId,hideWarehouses, ...filterDto } = this.filterForm.getRawValue();

      Object.keys(filterDto).forEach((key) => {
        if (key !== 'macAddress' && key !== 'ram' && (filterDto[key] === null || filterDto[key] === '')) {
          delete filterDto[key];
        }
      });

      const filterKey = this.getSpecificFilterKey(this.filterType);
      console.log(filterKey)

      this.filter.emit({ carrierId, aUnitId,departmentId,municipalOfficeId, [filterKey]: filterDto });
    }
  }

  getSpecificFilterKey(filterType: FilterType): string {
    switch (filterType) {
      case FilterType.Phone:
        return 'phoneFilterDto';
      case FilterType.Printer:
        return 'printerFilterDto';
      case FilterType.NetEquipment:
        return 'netEquipmentFilterDto';
      case FilterType.Computer:
        return 'computerFilterDto';
      case FilterType.Server:
        return 'serverFilterDto';
      case FilterType.Workstation:
        return 'workstationFilterDto';
      default:
        return 'filterDto';
    }
  }

  onReset(): void {
    this.filterForm.reset({
      carrierId: null,
      aUnitId: null,
      departmentId: null,
      municipalOfficeId: null,
      deviceName: '',
      model: '',
      paperSize: '',
      networkEquipmentTypeId: null,
      serialNumber: '',
      ram: '',
      ip: '',
      address: '',
      macAddress: '',
      hideWarehouses: false,
      operatingSystemId: null,
      employeeLastName: '',
      employeeFirstName: '',
      department: ''
    });
    this.aUnits = [];
    this.filterForm.get('aUnitId')?.disable();
    this.filterForm.get('departmentId')?.disable();
    this.filterForm.get('municipalOfficeId')?.disable();
    this.onFilter();
  }
}
