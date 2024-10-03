import { CommonModule } from '@angular/common';
import { Component, effect, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { AUnitService } from '../../../services/aunit.service';
import { SearchFormComponent } from '../../../components/search-form/search-form.component';
import { DeviceService } from '../../../services/device.service';
import { ItemDetailsComponent } from '../../../components/mobile-screen/item-details/item-details.component';
import { AlertService } from '../../../services/alert.service';
import { ViewEncapsulation } from '@angular/core';
import { Device, DeviceListResponse } from '../../../interfaces/responses/device-response';
import { CommonResponse } from '../../../interfaces/responses/common-response';
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { ExportDataButtonComponent } from '../../../components/export-data-button/export-data-button.component';
import { CarrierStateService } from '../../../services/state-management/carrier-state.service';
import { WorkStation, WorkStationResponse } from '../../../interfaces/responses/workstation-response';
import { ToastrService } from 'ngx-toastr';
import { WorkStationService } from '../../../services/workstation.service';
import { ExcelColumnNames } from '../../../enums/excel-column-names';
import { MatMenuModule } from '@angular/material/menu';
import { AunitTableComponent } from '../../../components/tables/aunit-table/aunit-table.component';
import { DeviceType } from '../../../enums/device-type';
import { WorkStationItemDetailsComponent } from '../../../components/mobile-screen/workstation-item-details/workstation-item-details.component';
import { NotificationsService } from '../../../services/notifications.service';
import { UtilityService } from '../../../services/utility/utility.service';
import { AUnitStateService } from '../../../services/state-management/aunit-state.service';
import { QuickSearchComponent } from "../../../components/quick-search/quick-search.component";
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ItemTableComponent } from '../../../components/tables/item-table/item-table.component';
import { WorkstationDetailComponent } from "../../workstations/workstation-detail/workstation-detail.component";
import { Helper } from '../../../shared/helpers';
import { LoadingSpinnerComponent } from "../../../components/loading-spinner/loading-spinner.component";
import { AddWorkStationDialogComponent } from '../../../components/add-workstation-dialog/add-workstation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { WorkStationStateService } from '../../../services/state-management/workstation-state.service';
import { WorkstationRequest } from '../../../interfaces/requests/workstation/add-workstation-request';
import { AddAunitDialogComponent } from '../../../components/admin-components/add-aunit-dialog/add-aunit-dialog.component';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Utils } from '../../../shared/utils';
import { AuthStateService } from '../../../services/state-management/auth-state.service';
import { EditAunitDialogComponent } from '../../../components/admin-components/edit-aunit-dialog/edit-aunit-dialog.component';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-carrier-detail',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSnackBarModule,
    ItemDetailsComponent,
    MatIconModule,
    MatPaginatorModule,
    AunitTableComponent,
    ItemTableComponent,
    MatButtonModule,
    SearchFormComponent,
    MatMenuModule,
    ExportDataButtonComponent,
    WorkStationItemDetailsComponent,
    TranslateModule,
    QuickSearchComponent,
    WorkstationDetailComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './carrier-detail.component.html',
  styleUrls: ['./carrier-detail.component.scss']
})
export class CarrierDetailComponent implements OnInit {
  carrier: CommonResponse | null = null;
  aUnits: CommonResponse[] = [];
  devices: Device[] = [];
  workstations: WorkStation[] = [];
  showSearchOptions = false;
  searchPerformed = false;
  showForm = false;
  showAUnits = false;
  filteredResults: any[] = [];
  searchType: DeviceType = DeviceType.WORKSTATION;
  searchForm: FormGroup;
  columnNames = ExcelColumnNames;
  DeviceType = DeviceType;
  isMobileScreen = false;
  isLoading = false;
  isSuperAdmin = this.authStateService.isSuperAdmin();
  hasMultipleCarriers = this.authStateService.hasMultipleCarriers();
  dataSource = new MatTableDataSource<Device>(this.filteredResults);
  workstationDataSource = new MatTableDataSource<WorkStation>(this.workstations);
  menuItems: MenuItem[] = [];
  currentFilterParams: any = {};

  currentPage: number = 1;
  pageSize: number = 30;
  totalPages: number = 1;

  constructor(
    private router: Router,
    private carrierStateService: CarrierStateService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private snackBar: MatSnackBar,
    private utilityService: UtilityService,
    private notificationsService: NotificationsService,
    private workStationStateService: WorkStationStateService,
    private workStationService: WorkStationService,
    private authStateService: AuthStateService,
    private aUnitService: AUnitService,
    private deviceService: DeviceService,
    private alertService: AlertService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private utils: Utils
  ) {
    this.searchForm = this.fb.group({
      ram: ['']
    });
    this.isSuperAdmin = this.authStateService.isSuperAdmin();
    if (!this.isSuperAdmin && !this.hasMultipleCarriers) {
      this.carrier = this.carrierStateService.selectedCarrier();
    }

  }

  ngOnInit(): void {
    
    const carrier = this.carrierStateService.selectedCarrier();
    if (carrier) {
      this.carrier = carrier;

      this.fetchAUnits(carrier.id);

    }
    this.checkSearchFormState();
  }

  checkSearchFormState(): void {
    const savedState = localStorage.getItem('searchFormState');
    if (savedState) {
      this.showForm = true;
      this.showSearchOptions = true;
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    this.isMobileScreen = window.innerWidth < 768;
  }

  openSnackBar(message: string, action: string, id: number): void {
    const snackBarRef = this.snackBar.open(message, action);
    snackBarRef.onAction().subscribe(() => {
      this.viewItemDetail(id);
    });
  }

  viewItemDetail(id: number): void {
    this.workStationStateService.setWorkstationId(id);
    this.router.navigate(['/workstation']);
  }

  onSearch(term: string): void {
    this.filteredResults = this.searchType !== DeviceType.WORKSTATION 
      ? (term ? Helper.filterDevices(term, this.devices) : this.devices)
      : (term ? Helper.filterWorkStations(term, this.workstations) : this.workstations);
  }

  onDeleteUnit(unit: CommonResponse): void {
    this.alertService.showDeleteItemAlert(unit.name).then(result => {
      if (result.isConfirmed) {
        this.aUnitService.deleteAunit(unit.id).subscribe(response => {
          if (response.success) {
            this.aUnits = this.aUnits.filter(aunit => aunit.id !== unit.id);
            this.utilityService.handleResponse(
              response.success,
              'successMessages.aunit.deleted.successfully',
              'errorMessages.unexpected.error',
              'notificationMessages.aunit.deleted',
              { unitName: unit.name }
            );
          }
        });
      }
    });
  }


  openAddUnitDialog(): void {
    const dialogRef = this.dialog.open(AddAunitDialogComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.isConfirmed) {
        this.fetchAUnits(this.carrier!.id);
      }
    });
  }

  openEditUnitDialog(unit: CommonResponse): void {
    const dialogRef = this.dialog.open(EditAunitDialogComponent, {
      width: '500px',
      data: { unitName: unit.name, unitId: unit.id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.isConfirmed) {
        this.fetchAUnits(this.carrier!.id);
      }
    });
  }

  addWorkStation(): void {
    const dialogRef = this.dialog.open(AddWorkStationDialogComponent, {
      width: '700px',
      data: { aUnits: this.aUnits }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.utils.addWorkStation(result.aUnitId, result.departmentId, result as WorkstationRequest, (success, id) => {
          if (success && id) {
            this.openSnackBar(this.translate.instant('successMessages.workstation.added.successfully'), 'Προβολή', id);
          }
        });
      }
    });
  }

  toggleAUnits(): void {
    this.showAUnits = !this.showAUnits;
    this.showForm = false;
    this.showSearchOptions = false;
  }

  toggleSearchOptions(): void {
    this.showSearchOptions = !this.showSearchOptions;
    this.showForm = !this.showForm;
    this.showAUnits = false;
  }

  fetchAUnits(carrierId: number): void {
    this.aUnitService.getAUnitsByCarrierId(carrierId).subscribe({
      next: (response) => {
        if (response.success) {
          this.aUnits = response.data;
        }
      },
      error: () => {
        this.toastr.error(this.translate.instant('errorMessages.unexpected.error'));
      }
    });
  }

  onItemDeleted(deletedId: number): void {
    this.workstations = this.workstations.filter(workstation => workstation.id !== deletedId);
  }

  onClose(): void {
    this.showForm = false;
    this.showAUnits = false;
    this.showSearchOptions = false;
  }

  setSearchType(searchType: DeviceType): void {
    this.filteredResults = [];
    this.searchType = searchType;
    this.showForm = true;
    this.showAUnits = false;
    this.devices = [];
    this.workstations = [];
    if (searchType !== DeviceType.COMPUTER) {
      this.searchForm.get('ram')?.disable();
    } else {
      this.searchForm.get('ram')?.enable();
    }
  }

  searchDevices(searchParams: any): void {
    this.searchPerformed = true;
    if (!this.carrier) {
      return;
    }

    this.currentFilterParams = searchParams;

    switch (this.searchType) {
      case DeviceType.COMPUTER:
      case DeviceType.PHONE:
      case DeviceType.PRINTER:
      case DeviceType.NETWORK_EQUIPMENT:
      case DeviceType.SERVER:
        this.searchForDevices(searchParams);
        break;
      case DeviceType.WORKSTATION:
        this.searchForWorkstations(searchParams);
        break;
      default:
        this.toastr.error(this.translate.instant('errorMessages.unexpected.error'));
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.searchDevices(this.currentFilterParams);
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.searchDevices(this.currentFilterParams);
    }
  }

  firstPage(): void {
    if (this.currentPage !== 1) {
      this.currentPage = 1;
      this.searchDevices(this.currentFilterParams);
    }
  }

  lastPage(): void {
    if (this.currentPage !== this.totalPages) {
      this.currentPage = this.totalPages;
      this.searchDevices(this.currentFilterParams);
    }
  }

  private searchForDevices(searchParams: any): void {
    this.deviceService.getDevicesByCarrierId(
      this.carrierStateService.selectedCarrier()!.id,
      this.currentPage,
      this.pageSize,
      this.searchType,
      searchParams
    ).subscribe(response => {
      if (response.success) {
        this.devices = response.data || [];
        this.filteredResults = this.devices;
        this.totalPages = response.totalPages;
      }
    });
  }
  private searchForWorkstations(searchParams: any): void {
    this.workStationService.getWorkStationsByCarrierId(
      this.carrierStateService.selectedCarrier()!.id,
      this.currentPage,
      this.pageSize,
      searchParams
    ).subscribe((response: WorkStationResponse) => {
      if (response.success) {
        this.workstations = response.data || [];
        this.filteredResults = this.workstations;
        this.totalPages = response.totalPages;
      }
    });
  }
}
