import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DeviceHistory } from '../../interfaces/responses/device-response';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-item-history',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule,TranslateModule,MatTableModule,DatePipe,MatTooltipModule],
  templateUrl: './item-history.component.html',
  styleUrls: ['./item-history.component.scss']
})

export class ItemHistoryComponent implements OnInit {
  @Input() deviceHistory: any;
  @Input() isTypeComputer: boolean = false;

  displayedColumns: string[] = [
    'actionType', 'username', 'checkDateTime', 'deviceName', 'model',
    'serialNumber', 'employeeName', 'email'
  ];
  dataSource: MatTableDataSource<DeviceHistory> = new MatTableDataSource();

  ngOnInit(): void {
    if (this.isTypeComputer) {
      this.displayedColumns.splice(3, 0, 'ram'); 
      this.displayedColumns.push('ip', 'macAddress', 'operatingSystem');
      this.displayedColumns.push('comments');
    }
    this.dataSource.data = this.deviceHistory.data;
  }
}
