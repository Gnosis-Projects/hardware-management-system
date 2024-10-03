import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DeviceHistory } from '../../interfaces/responses/device-response';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { DeviceType } from '../../enums/device-type';

@Component({
  selector: 'app-item-history',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule, 
    TranslateModule, 
    MatTableModule, 
    DatePipe, 
    MatTooltipModule
  ],
  templateUrl: './item-history.component.html',
  styleUrls: ['./item-history.component.scss']
})
export class ItemHistoryComponent implements OnInit {
  @Input() deviceHistory: any;
  @Input() deviceType: DeviceType | undefined;

  displayedColumns: string[] = [
    'actionType', 'username', 'checkDateTime', 'deviceName','employeeName'
  ];
  dataSource: MatTableDataSource<DeviceHistory> = new MatTableDataSource();

  ngOnInit(): void {
    this.addDeviceSpecificColumns();
    this.dataSource.data = this.deviceHistory?.data || [];
  }

  

  addDeviceSpecificColumns(): void {
    switch (this.deviceType) {
      case DeviceType.COMPUTER:
        this.displayedColumns.push('ram', 'ip','disk' ,'ssd','machineType', 'operatingSystem', 'macAddress','outlet', 'antivirus', 'monitorType','remoteDesktopApps'  );
        break;
      case DeviceType.PHONE:
        this.displayedColumns.push('phoneNumber', 'phoneSocket', 'phoneType');
        break;
      case DeviceType.PRINTER:
        this.displayedColumns.push('printerType', 'paperSize', 'printerIp');
        break;
      case DeviceType.SERVER:
        this.displayedColumns.push('operatingSystem','serverDiskType', 'diskRotations', 'networkDisk');
        break;
      case DeviceType.NETWORK_EQUIPMENT:
        this.displayedColumns.push('networkEquipmentType', 'routerUsername', 'routerPassword', 'switchAddress', 'networkEquipmentIp');
        break;
    }
    this.displayedColumns.push('comments');
  }

  
}


