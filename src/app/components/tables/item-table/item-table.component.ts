import { Component, Input, OnInit, OnChanges, SimpleChanges, ViewChild, AfterViewInit } from '@angular/core';
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
import { ItemColumnNames } from '../../../enums/table-headers.enum';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { PaginatorEnum } from '../../../enums/paginatorEnum';
import { Helper } from '../../../shared/helpers';

@Component({
  selector: 'app-item-table',
  templateUrl: './item-table.component.html',
  styleUrls: ['./item-table.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatSortModule, MatPaginatorModule, MatMenuModule, TranslateModule, MatTableModule, MatButtonModule],
})
export class ItemTableComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  Helper = Helper;
  paginatorEnum = PaginatorEnum;

  @Input() unitName?: string | null = null;
  @Input() carrierName?: string | null = null;
  @Input() items: (Device | WorkStation | SingleWorkStationResponse)[] = [];
  @Input() deviceType: DeviceType = DeviceType.COMPUTER;

  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<Device | WorkStation | SingleWorkStationResponse>(this.items);
  ItemColumnNames = ItemColumnNames;

  constructor(
    private deviceStateService: DeviceStateService,
    private deviceService: DeviceService,
    private router: Router,
    private workstationStateService: WorkStationStateService,
    private workStationService: WorkStationService,
    private translate: TranslateService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.setDisplayedColumns();
    this.dataSource.data = this.items;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items']) {

      this.dataSource.data = this.items;
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  setDisplayedColumns(): void {
    if (this.deviceType === DeviceType.COMPUTER) {
      this.displayedColumns = [
        ItemColumnNames.carrierName,
        ItemColumnNames.aUnitName,
        ItemColumnNames.deviceName,
        ItemColumnNames.model,
        ItemColumnNames.serialNumber,
        ItemColumnNames.ram,
        ItemColumnNames.actions
      ];
    }  
    if (this.deviceType !== DeviceType.COMPUTER && this.deviceType !== DeviceType.WORKSTATION) {
      this.displayedColumns = [
        ItemColumnNames.carrierName,
        ItemColumnNames.aUnitName,
        ItemColumnNames.deviceName,
        ItemColumnNames.model,
        ItemColumnNames.serialNumber,
        ItemColumnNames.actions
      ];
    } 
     if (this.deviceType === DeviceType.WORKSTATION) {
      this.displayedColumns = [
        ItemColumnNames.carrierName,
        ItemColumnNames.aUnitName,
        ItemColumnNames.employeeLastName,
        ItemColumnNames.employeeFirstName,
        ItemColumnNames.email,
        ItemColumnNames.personalPhone,
        ItemColumnNames.department,
        ItemColumnNames.city,
        ItemColumnNames.actions
      ];
    }

    if (this.deviceType === DeviceType.NETWORK_EQUIPMENT) {
      this.displayedColumns = [
        ItemColumnNames.carrierName,
        ItemColumnNames.aUnitName,
        ItemColumnNames.deviceName,
        ItemColumnNames.model,
        ItemColumnNames.serialNumber,
        'networkEquipmentType', 
        ItemColumnNames.actions
      ];
    }
    
  }

  

  deleteItem(id: number): void {
    if (this.deviceType === DeviceType.WORKSTATION) {
      this.workStationService.deleteWorkStation(id).subscribe({
        next: (response) => {
          if (response.success) {
            this.items = this.items.filter((item) => (item as WorkStation).id !== id) as WorkStation[];
            this.dataSource.data = this.items;
            this.toastr.success(this.translate.instant('successMessages.workstation.deleted.successfully'));
          } else {
            this.toastr.error(this.translate.instant('errorMessages.workstation.not.deleted'));
          }
        },
        error: (err) => {
          this.toastr.error(this.translate.instant('errorMessages.unexpected.error'));
        },
      });
    } else {
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
        error: (err) => {
          this.toastr.error(this.translate.instant('errorMessages.unexpected.error'));
        },
      });
    }
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
