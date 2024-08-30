import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Device } from '../../../interfaces/responses/device-response';
import { MatIconModule } from '@angular/material/icon';
import { DeviceStateService } from '../../../services/state-management/device-state.service';
import { TranslateModule } from '@ngx-translate/core';
import { DeviceService } from '../../../services/device.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { ToastrService } from 'ngx-toastr'; 
import { TranslateService } from '@ngx-translate/core';
import { DeviceType } from '../../../enums/device-type';

@Component({
  selector: 'app-item-details',
  standalone: true,
  imports: [CommonModule, MatIconModule, TranslateModule, MatButtonModule, MatMenuModule],
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.scss']
})
export class ItemDetailsComponent {

  @Input() item: Device | null = null;
  @Input() deviceType: DeviceType = DeviceType.COMPUTER;
  @Output() itemDeleted = new EventEmitter<number>();

  constructor(
    private router: Router,
    private deviceStateService: DeviceStateService,
    private translate: TranslateService,
    private deviceService: DeviceService,
    private toastr: ToastrService 
  ) {}

  viewItemDetail(id: number | undefined): void {
    if (id) {
      this.deviceStateService.setSelectedDeviceId(id, this.deviceType);
    
      this.router.navigate(['/selectedDevice']);
    }
  }

  editItem(id: number | undefined): void {
    if (id) {
      this.deviceStateService.setSelectedDeviceId(id, this.deviceType);
     
      this.router.navigate(['/selectedDevice/edit']);
    }
  }

  viewItemHistory(id: number | undefined): void {
    if (id) {
      this.deviceStateService.setSelectedDeviceId(id, this.deviceType);
      this.router.navigate(['/view-history']);
    }
  }

  deleteItem(id: number | undefined): void {
    if (id) {

      this.deviceService.deleteDevice(id, this.deviceType).subscribe({
        next: response => {
          if (response.success) {
            this.toastr.success(this.translate.instant('successMessages.device.deleted.successfully'));
            this.itemDeleted.emit(id);
          } else {
            this.toastr.error('errorMessages.device.not.deleted');
          }
        },
        error: err => {
          this.toastr.error('errorMessages.unexpected.error');
        }
      });
    }
  }
}
