import { Component, Input, OnInit, OnChanges, SimpleChanges, ViewChild, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Device } from '../../../interfaces/responses/device-response';
import { SingleWorkStationResponse, WorkStation } from '../../../interfaces/responses/workstation-response';
import { DeviceType } from '../../../enums/device-type';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { DeviceStateService } from '../../../services/state-management/device-state.service';
import { Router } from '@angular/router';
import { WorkStationStateService } from '../../../services/state-management/workstation-state.service';
import { WorkStationService } from '../../../services/workstation.service';
import { ToastrService } from 'ngx-toastr';
import { DeviceService } from '../../../services/device.service';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { ItemColumnNames } from '../../../enums/table-headers.enum';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { PaginatorEnum } from '../../../enums/paginatorEnum';
import { Helper } from '../../../shared/helpers';
import Swal from 'sweetalert2';
import { QuickSearchComponent } from '../../quick-search/quick-search.component';
import { AdminService } from '../../../services/admin.service';
import { CarrierStateService } from '../../../services/state-management/carrier-state.service';

@Component({
  selector: 'app-item-table',
  templateUrl: './item-table.component.html',
  styleUrls: ['./item-table.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatSort,
    MatPaginator,
    TranslateModule,
    MatSortModule,
    MatIconModule,
    MatTableModule,
    MatMenuModule,
    MatChipsModule,
    MatButtonModule,
    QuickSearchComponent
  ],
})
export class ItemTableComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @Input() unitName?: string | null = null;
  @Input() carrierName?: string | null = null;
  @Input() items: (Device| WorkStation | SingleWorkStationResponse)[] = [];
  @Input() deviceType: DeviceType = DeviceType.COMPUTER;
  @Input() isSuperAdmin: boolean = false;
  @Input() currentPage: number = 1
  @Input() totalPages: number = 1
  
  @Output() nextPage = new EventEmitter<void>();
  @Output() previousPage = new EventEmitter<void>();
  @Output() firstPage = new EventEmitter<void>();
  @Output() lastPage = new EventEmitter<void>();
  
  Helper = Helper;
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<Device | WorkStation | SingleWorkStationResponse>(this.items);
  ItemColumnNames = ItemColumnNames;

  constructor(
    private deviceStateService: DeviceStateService,
    private deviceService: DeviceService,
    private adminService: AdminService,
    private carrierState: CarrierStateService,
    private router: Router,
    private workstationStateService: WorkStationStateService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private workstationService: WorkStationService
  ) {}

  ngOnInit(): void {
    this.setDisplayedColumns();
  }

  

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items']) {
      this.dataSource.data = this.items;
    }
    if (changes['deviceType']) {
      this.setDisplayedColumns();
    }
  }

  onNextPage(): void {
    this.nextPage.emit();
  }

  onPreviousPage(): void {
    this.previousPage.emit();
  }

  onFirstPage(): void {
    this.firstPage.emit();
  }

  onLastPage(): void {
    this.lastPage.emit();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  
  onSearch(term: string): void {
    if (this.deviceType === DeviceType.WORKSTATION) {
      this.dataSource.data = term ? Helper.filterWorkStations(term, this.items as WorkStation[]) : this.items as WorkStation[];
    } else {
      this.dataSource.data = term ? Helper.filterDevices(term, this.items as Device[]) : this.items as Device[];
    }
  }
  

  setDisplayedColumns(): void {
    switch (this.deviceType) {
      case DeviceType.COMPUTER:
        this.displayedColumns = [
          ItemColumnNames.carrierName,
          ItemColumnNames.aUnitName,
          ItemColumnNames.municipalOffice,
          ItemColumnNames.department,
          ItemColumnNames.deviceName,
          ItemColumnNames.model,
          ItemColumnNames.serialNumber,
          ItemColumnNames.ram,
          ItemColumnNames.ssd,
          ItemColumnNames.operatingSystem,
          ItemColumnNames.toBeDestroyed,
          ItemColumnNames.actions
        ];
        break;
      case DeviceType.NETWORK_EQUIPMENT:
        this.displayedColumns = [
          ItemColumnNames.carrierName,
          ItemColumnNames.aUnitName,
          ItemColumnNames.municipalOffice,
          ItemColumnNames.department,
          ItemColumnNames.deviceName,
          ItemColumnNames.model,
          ItemColumnNames.serialNumber,
          ItemColumnNames.networkEquipmentType,
          ItemColumnNames.networkEquipmentIP,
          ItemColumnNames.toBeDestroyed,
          ItemColumnNames.actions
        ];
        break;
      case DeviceType.WORKSTATION:
        this.displayedColumns = [
          ItemColumnNames.carrierName,
          ItemColumnNames.aUnitName,
          ItemColumnNames.municipalOffice,
          ItemColumnNames.department,
          ItemColumnNames.employeeLastName,
          ItemColumnNames.employeeFirstName,
          ItemColumnNames.email,
          ItemColumnNames.personalPhone,
          ItemColumnNames.city,
          ItemColumnNames.address,
          ItemColumnNames.actions
        ];
        break;
      case DeviceType.PHONE:
        this.displayedColumns = [
          ItemColumnNames.carrierName,
          ItemColumnNames.aUnitName,
          ItemColumnNames.municipalOffice,
          ItemColumnNames.department,
          ItemColumnNames.deviceName,
          ItemColumnNames.model,
          ItemColumnNames.serialNumber,
          ItemColumnNames.phoneType,
          ItemColumnNames.toBeDestroyed,
          ItemColumnNames.actions
        ];
        break;
      case DeviceType.PRINTER:
        this.displayedColumns = [
          ItemColumnNames.carrierName,
          ItemColumnNames.aUnitName,
          ItemColumnNames.municipalOffice,
          ItemColumnNames.department,
          ItemColumnNames.deviceName,
          ItemColumnNames.model,
          ItemColumnNames.serialNumber,
          ItemColumnNames.printerType,
          ItemColumnNames.printerIp,
          ItemColumnNames.paperSize,
          ItemColumnNames.toBeDestroyed,
          ItemColumnNames.actions
        ];
        break;
      case DeviceType.SERVER:
        this.displayedColumns = [
          ItemColumnNames.carrierName,
          ItemColumnNames.aUnitName,
          ItemColumnNames.municipalOffice,
          ItemColumnNames.department,
          ItemColumnNames.deviceName,
          ItemColumnNames.model,
          ItemColumnNames.serialNumber,
          ItemColumnNames.serverDiskType,
          ItemColumnNames.networkDisk,
          ItemColumnNames.diskRotations,
          ItemColumnNames.toBeDestroyed,
          ItemColumnNames.actions
        ];
        break;
    }
  }

  deleteItem(id: number): void {
    this.showDeleteItemAlert().then((result) => {
      if (result.isConfirmed) {
        if (this.deviceType === DeviceType.WORKSTATION) {
          this.deleteWorkStation(id);
        } else {
          this.deleteDevice(id);
        }
      }
    });
  }

  showDeleteItemAlert(): Promise<any> {
    return Swal.fire({
      title: `Διαγραφή στοιχείου;`,
      text: this.translate.instant('are.you.sure.delete'),
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('confirm'),
      cancelButtonText: this.translate.instant('cancel')
    });
  }

  deleteWorkStation(id: number): void {
    this.workstationService.deleteWorkStation(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.items = this.items.filter((item) => (item as WorkStation).id !== id) as WorkStation[];
          this.dataSource.data = this.items;
          this.toastr.success(this.translate.instant('successMessages.workstation.deleted.successfully'));
        } else {
          this.toastr.error(this.translate.instant('errorMessages.unexpected.error'));
        }
      },
      error: () => {
        this.toastr.error(this.translate.instant('errorMessages.unexpected.error'));
      },
    });
  }

  deleteDevice(id: number): void {
    this.deviceService.deleteDevice(id, this.deviceType).subscribe({
      next: (response) => {
        if (response.success) {
          this.items = this.items.filter((item) => (item as Device).id !== id) as Device[];
          this.dataSource.data = this.items;
          this.toastr.success(this.translate.instant('successMessages.device.deleted.successfully'));
        } else {
          this.toastr.error(this.translate.instant('errorMessages.device.not.deleted'));
        }
      },
      error: () => {
        this.toastr.error(this.translate.instant('errorMessages.unexpected.error'));
      },
    });
  }

  viewItemDetail(id: number | undefined): void {
    if (id) {
      if (this.deviceType === DeviceType.WORKSTATION) {
        this.workstationStateService.setWorkstationId(id);
        this.router.navigate(['/workstation']);
      } else {
        this.deviceStateService.setSelectedDeviceId(id, this.deviceType);
        this.router.navigate(['/selectedDevice']);
      }
    }
  }

  editItem(id: number | undefined): void {
    if (id) {
      if (this.deviceType === DeviceType.WORKSTATION) {
        this.workstationStateService.setWorkstationId(id);
        this.router.navigate(['/workstation/edit']);
      } else {
        this.deviceStateService.setSelectedDeviceId(id, this.deviceType);
        this.router.navigate(['/selectedDevice/edit']);
      }
    }
  }

  viewItemHistory(id: number | undefined): void {
    if (id) {
      this.deviceStateService.setSelectedDeviceId(id, this.deviceType);
      this.router.navigate(['/view-history']);
    }
  }
}