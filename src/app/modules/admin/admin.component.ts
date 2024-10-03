import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { Device, DeviceListResponse } from '../../interfaces/responses/device-response';
import { WorkStation, WorkStationResponse } from '../../interfaces/responses/workstation-response';
import { ToastrService } from 'ngx-toastr';
import { ItemDetailsComponent } from '../../components/mobile-screen/item-details/item-details.component';
import { WorkStationItemDetailsComponent } from '../../components/mobile-screen/workstation-item-details/workstation-item-details.component';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { FilterComponent } from '../../components/admin-components/filter/filter.component';
import { FilterType } from '../../enums/filter-type.enum';
import { CarrierService } from '../../services/carrier.service';
import { CommonResponse } from '../../interfaces/responses/common-response';
import { ExportDataButtonComponent } from '../../components/export-data-button/export-data-button.component';
import { ExcelColumnNames } from '../../enums/excel-column-names';
import { DeviceType } from '../../enums/device-type';
import { AlertService } from '../../services/alert.service';
import { MatMenuModule } from '@angular/material/menu';
import { ItemTableComponent } from '../../components/tables/item-table/item-table.component';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CarrierTableComponent } from '../../components/tables/carrier-table/carrier-table.component';
import { MatDividerModule } from '@angular/material/divider';
import { CreateUserComponent } from '../../components/admin-components/create-user/create-user.component';
import { MatDialog } from '@angular/material/dialog';
import { UsersTableComponent } from '../../components/admin-components/users-table/users-table.component';
import { AddWorkStationDialogComponent } from '../../components/add-workstation-dialog/add-workstation-dialog.component';
import { AuthStateService } from '../../services/state-management/auth-state.service';
import { AUnitService } from '../../services/aunit.service';
import { Helper } from '../../shared/helpers';
import { AddCarrierDialogComponent } from '../../components/admin-components/add-carrier-dialog/add-carrier-dialog.component';
import { AddAunitDialogComponent } from '../../components/admin-components/add-aunit-dialog/add-aunit-dialog.component';
import { DropdownOptionDialogComponent } from '../../components/dropdowns/dropdown-option-dialog/dropdown-option-dialog.component';
import Swal from 'sweetalert2';
import { DropdownService } from '../../services/dropdown.service';
import { PageEvent } from '@angular/material/paginator';
import { AddMunOfficeDialogComponent } from '../../components/admin-components/add-munoffice-dialog/add-mun-office-dialog/add-munoffice-dialog.component';
import { MunicipalOfficesService } from '../../services/municipalOffices.service';
import { MunicipalOfficesTableComponent } from '../../components/admin-components/mun-offices-table/mun-offices-table.component';
import { DepartmentsService } from '../../services/departments.service';
import { AddDepartmentDialog } from '../../components/admin-components/add-department-dialog/add-department-dialog.component';
import { DepartmentsTableComponent } from "../../components/admin-components/departments-table/departments-table.component";
import { ExtraStateService } from '../../services/state-management/extra-state.service';

@Component({
  standalone: true,
  imports: [
    WorkStationItemDetailsComponent,
    UsersTableComponent,
    CreateUserComponent,
    MatDividerModule,
    CarrierTableComponent,
    MatToolbarModule,
    MatSidenavModule,
    AddCarrierDialogComponent,
    ItemTableComponent,
    MatMenuModule,
    ExportDataButtonComponent,
    FilterComponent,
    MatButtonModule,
    TranslateModule,
    MatTooltipModule,
    CommonModule,
    ItemDetailsComponent,
    MatIconModule,
    CarrierTableComponent,
    MunicipalOfficesTableComponent,
    DepartmentsTableComponent
],
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  @ViewChild('drawer') drawer!: MatSidenav;

  currentPage: number = 1;
  pageSize: number = 30;
  totalPages: number = 1;
  currentFilterParams: any = {};

  devices: Device[] = [];
  carriers: CommonResponse[] = [];
  aUnits: CommonResponse[] = [];
  munOffices: CommonResponse[]=[];
  departments:CommonResponse[] = []
  workstations: WorkStation[] = [];
  municipalOfficesForFilter: CommonResponse[] = [];
  searchType: DeviceType = DeviceType.COMPUTER;
  filterType: FilterType = FilterType.Computer;
  columnNames = ExcelColumnNames;
  isSuperAdmin: boolean = true;
  filteredWorkstations: WorkStation[] = [];
  DeviceType = DeviceType;
  showOptions: boolean = false;
  isDrawerOpen: boolean = false;
  showCarriers: boolean = false;
  showUsersTable: boolean = false;
  showOfficesTable:boolean = false;
  showDepartmentsTable:boolean = false;
  showFilter: boolean = false;
  selectedCarrierId: number = 0;
  selectedOfficeId: number = 0;
  hide: boolean = false;

  constructor(
    private adminService: AdminService,
    private alertService: AlertService,
    public extraStateService: ExtraStateService,
    private dropdownService: DropdownService,
    private departmentsService: DepartmentsService,
    private municipalOfficesService: MunicipalOfficesService,
    private translate: TranslateService,
    private toastr: ToastrService,
    private carrierService: CarrierService,
    private aUnitService: AUnitService,
    private authStateService: AuthStateService,
    private dialog: MatDialog
  ) {
    this.fetchAllDevices(localStorage.getItem('searchType') as DeviceType);
  }

  ngOnInit(): void {
    this.showFilter = false;
    this.isSuperAdmin = this.authStateService.isSuperAdmin();
    this.searchType = DeviceType.COMPUTER;
    this.fetchCarriersAndUnits();
    this.fetchMunicipalOffices();
    this.fetchDepartments();
    this.loadPersistedData();
    this.extraStateService.fetchAndStoreMunicipalOffices().then((offices) => {
    this.municipalOfficesForFilter = offices;
  }).catch((error) => {
    console.error('Error fetching municipal offices:', error);
  });
  }

  toggleOptions() {
    this.showOptions = !this.showOptions;
  }

  toggleOfficesTable(): void {
    const carrierOptions = this.carriers.map(carrier => {
      return {
        text: carrier.name,
        value: carrier.id
      };
    });
  
    const inputOptions: { [key: string]: string } = carrierOptions.reduce((options, carrier) => {
      options[carrier.value] = carrier.text;
      return options;
    }, {} as { [key: string]: string });
  
    Swal.fire({
      title: 'Επιλέξτε εναν φορέα',
      input: 'select',
      inputOptions: inputOptions,
      inputPlaceholder: 'Φορείς...',
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'Παρακαλώ επιλέξτε εναν φορέα!';
        }
        return null;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const selectedCarrierId = result.value;
        this.selectedCarrierId = selectedCarrierId;
    
        this.fetchMunicipalOffices();
    
        this.showOfficesTable = true;
        this.devices = []
        this.workstations = []
        this.showDepartmentsTable = false;
      }
    });
  }    
  
  
  toggleDepartmentsTable(): void {
    const municipalOfficeOptions = this.munOffices.map(office => {
      return {
        text: office.name,
        value: office.id
      };
    });
  
    const inputOptions: { [key: string]: string } = municipalOfficeOptions.reduce((options, office) => {
      options[office.value] = office.text;
      return options;
    }, {} as { [key: string]: string });
  
    Swal.fire({
      title: 'Επιλέξτε μια διεύθυνση',
      input: 'select',
      inputOptions: inputOptions,
      inputPlaceholder: 'Διευθύνσεις...',
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'Επιλέξτε μια διεύθυνση!';
        }
        return null;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const selectedMunicipalOfficeId = result.value;
        this.selectedOfficeId = selectedMunicipalOfficeId;
        this.fetchDepartments();
        this.showDepartmentsTable = !this.showDepartmentsTable;
        this.showOfficesTable = false;
      }
    });
  }
  

  toggleDrawer() {
    this.isDrawerOpen = !this.isDrawerOpen;
    this.drawer.toggle();
  }

  resetProperties() {
    this.devices = [];
    this.workstations = [];
    this.filteredWorkstations = []
    this.showOptions = false;
  }

  showAllCarriers() {
    this.showCarriers = !this.showCarriers;
    this.showUsersTable = false;
    this.showOfficesTable = false;
    this.showDepartmentsTable = false;
    this.showFilter = false;
    this.resetProperties();
  }

  toggleUsersList() {
    this.showUsersTable = !this.showUsersTable;
    this.showOfficesTable = false;
    this.showCarriers = false;
    this.showFilter = false;
    this.showDepartmentsTable = false;
    this.showOfficesTable = false;
    this.resetProperties();
  }

  
  addCarrier(): void {
    const dialogRef = this.dialog.open(AddCarrierDialogComponent, {
      width: '500px',
      data: { carrierName: '' }
    });
  }

  addAunit(): void {
    const dialogRef = this.dialog.open(AddAunitDialogComponent, {
      width: '400px',
      data: { carrierName: '' }
    });
  }

  addMunicipalOffice(): void{
    const dialogRef = this.dialog.open(AddMunOfficeDialogComponent, {
      width: '400px',
      data: { carrierName: '' }
    });
  }

  
  addDepartment(): void{
    const dialogRef = this.dialog.open(AddDepartmentDialog, {
      width: '400px',
    });
  }

  addDropDownOptions(): void {
    const dialogRef = this.dialog.open(DropdownOptionDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.toastr.success(this.translate.instant('successMessages.option.added.successfully'));
      }
    });
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.fetchAllDevices(this.searchType, this.currentFilterParams);
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchAllDevices(this.searchType, this.currentFilterParams);
    }
  }

  firstPage(): void{
    if(this.currentPage > 1) this.currentPage = 1
    this.fetchAllDevices(this.searchType, this.currentFilterParams);
  }

  lastPage(): void{
    if(this.currentPage < this.totalPages) this.currentPage = this.totalPages
    this.fetchAllDevices(this.searchType, this.currentFilterParams);
  }

  addWorkstation(): void {
    const dialogRef = this.dialog.open(AddWorkStationDialogComponent, {
      width: '100%',
      maxWidth: '1000px',
      data: { carriers: this.carriers, aUnits: this.isSuperAdmin ? [] : this.aUnits, isSuperAdmin: this.isSuperAdmin },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.toastr.success(this.translate.instant('successMessages.workstation.added.successfully'));
      }
    });
  }

  fetchCarriersAndUnits(): void {
    this.carrierService.getAllCarriers().subscribe((response) => {
      if (response.success) {
        this.carriers = response.data;
        if (!this.isSuperAdmin && this.carriers.length > 0) {
          this.aUnitService.getAUnitsByCarrierId(this.carriers[0].id).subscribe((res) => {
            if (res.success) {
              this.aUnits = res.data;
            } else {
              this.toastr.error(res.message);
            }
          });
        }
      } else {
        this.toastr.error(response.message);
      }
    });
  }

  fetchMunicipalOffices(){
    this.municipalOfficesService.getAllByCarrier(this.selectedCarrierId).subscribe((response)=>{
      if(response.success){
        this.munOffices = response.data
        this.extraStateService.setAllMunicipalOffices(response.data);
      }
      else {
        this.toastr.error(response.message);
      }
    })
  }

  fetchDepartments(){
    this.departmentsService.getAllByMunicipalOffice(this.selectedOfficeId).subscribe((response)=>{
      if(response.success){
        this.departments = response.data
        this.extraStateService.setAllDepartments(response.data);
      }
      else {
        this.toastr.error(response.message);
      }
    })
  }

  addUser(): void {
    const dialogRef = this.dialog.open(CreateUserComponent, {
      width: '100%',
      maxWidth: '1000px',
      data: { carriers: this.carriers },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Handle response
      }
    });
  }

  fetchAllDevices(type: DeviceType, filterParams: any = {}): void {

    this.searchType = type;
    this.showFilter = true;
    this.filterType = this.getFilterType(type);
    this.showCarriers = false;
    this.showUsersTable = false;
    this.showDepartmentsTable = false;
    this.showOfficesTable = false;
    const searchParams = {
      ...filterParams,
      sorting: {
        sortBy: 'deviceName',
        sortOrder: 'asc',
      },
    };
    
    this.adminService.setPaginationParams(this.currentPage, this.pageSize);

    const handleResponse = (response: any, isWorkstation: boolean = false) => {
      if (response.success) {
        if (isWorkstation) {
          this.filteredWorkstations = response.data || [];
          this.showOfficesTable=false
          this.showDepartmentsTable = false;
          this.devices = [];
        } else {
          this.devices = response.data || [];
          this.filteredWorkstations = [];
          this.showOfficesTable=false
          this.showDepartmentsTable = false;
        }
        this.totalPages = response.totalPages;
        this.persistData();
      } else {
        this.toastr.error(response.message);
      }
    };

    switch (type) {
      case DeviceType.COMPUTER:
        this.adminService.getAllComputers(searchParams).subscribe((response) => handleResponse(response));
        break;
      case DeviceType.PHONE:
        this.adminService.getAllPhones(searchParams).subscribe((response) => handleResponse(response));
        break;
      case DeviceType.PRINTER:
        this.adminService.getAllPrinters(searchParams).subscribe((response) => handleResponse(response));
        break;
      case DeviceType.NETWORK_EQUIPMENT:
        this.adminService.getAllNetworkEquipments(searchParams).subscribe((response) => handleResponse(response));
        break;
      case DeviceType.SERVER:
        this.adminService.getAllServers(searchParams).subscribe((response) => handleResponse(response));
        break;
      case DeviceType.WORKSTATION:
        this.adminService.getAllWorkStations(searchParams).subscribe((response) => handleResponse(response, true));
        break;
    }
  }

  getFilterType(type: DeviceType): FilterType {
    switch (type) {
      case DeviceType.PHONE:
        return FilterType.Phone;
      case DeviceType.COMPUTER:
        return FilterType.Computer;
      case DeviceType.PRINTER:
        return FilterType.Printer;
      case DeviceType.NETWORK_EQUIPMENT:
        return FilterType.NetEquipment;
      case DeviceType.WORKSTATION:
        return FilterType.Workstation;
      case DeviceType.SERVER:
        return FilterType.Server;
      default:
        return FilterType.Computer;
    }
  }

  applyFilter(filterParams: any): void {
    this.currentFilterParams = filterParams; 
    const { carrierId, aUnitId,municipalOfficeId,departmentId, ...specificFilterDto } = filterParams;
    const filterKey = Object.keys(specificFilterDto)[0];
    const searchParams = {
      carrierId: parseInt(carrierId),
      aUnitId: parseInt(aUnitId),
      municipalOfficeId: parseInt(municipalOfficeId),
      departmentId: parseInt(departmentId),
      [filterKey]: specificFilterDto[filterKey],
      sorting: {
        sortBy: 'name',
        sortOrder: 'asc',
      },
    };
    this.currentPage = 1;
    this.fetchAllDevices(this.searchType, searchParams);
  }


  onPageSizeChange(newPageSize: number): void {
    this.pageSize = newPageSize; // Update the pageSize
    this.currentPage = 1; // Reset to the first page when page size changes
    this.fetchAllDevices(this.searchType, this.currentFilterParams); // Fetch the devices with the new page size
  }
  

  showOperatingSystems(): void {
    this.dropdownService.getOperatingSystems().subscribe(
      (response) => {
        if (response.success) {
          const operatingSystems = response.data;
          const operatingSystemsList = operatingSystems
            .map((os: { name: any; }) => `<li>${os.name}</li>`)
            .join('');
          Swal.fire({
            title: 'Λειτουργικά Συστήματα',
            html: `<ul>${operatingSystemsList}</ul>`,
            confirmButtonText: 'OK'
          });
        } else {
          this.toastr.error('Failed to fetch operating systems.');
        }
      },
      (error) => {
        this.toastr.error('An error occurred while fetching operating systems.');
      }
    );
  }

  persistData(): void {
    localStorage.setItem('searchDevices', Helper.encode(JSON.stringify(this.devices)));
    localStorage.setItem('searchWorkstations', Helper.encode(JSON.stringify(this.workstations)));
    localStorage.setItem('searchType', this.searchType);
  }

  loadPersistedData(): void {
    const storedDevices = localStorage.getItem('searchDevices');
    const storedWorkstations = localStorage.getItem('searchWorkstations');
    const storedSearchType = localStorage.getItem('searchType');

    if (storedDevices) {
      this.devices = JSON.parse(Helper.decode(storedDevices));

    }

    if (storedWorkstations) {
      this.workstations = JSON.parse(Helper.decode(storedWorkstations));
    }

    this.showCarriers = false;

    if (storedSearchType) {
      this.searchType = storedSearchType as DeviceType;
      this.filterType = this.getFilterType(this.searchType);
      this.showFilter = true;
    }
  }
}
