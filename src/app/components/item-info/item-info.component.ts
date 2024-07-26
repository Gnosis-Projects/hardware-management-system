import { Component, Input } from '@angular/core';
import { DeviceType } from '../../enums/device-type';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-item-info',
  templateUrl: './item-info.component.html',
  styleUrls: ['./item-info.component.scss'],
  imports: [CommonModule, MatButtonModule, TranslateModule],
  standalone: true,
})
export class ItemInfoComponent {
  @Input() device: any;
  @Input() deviceType: DeviceType | null = null;
  @Input() showGeneralInfo: boolean = false;
  @Input() showTechnicalInfo: boolean = false;
  @Input() showWorkstationInfo: boolean = false;
}