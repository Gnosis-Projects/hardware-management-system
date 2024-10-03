import { Component, Input, ViewEncapsulation } from '@angular/core';
import { DeviceType } from '../../enums/device-type';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-item-info',
  templateUrl: './item-info.component.html',
  styleUrls: ['./item-info.component.scss'],
  imports: [CommonModule, MatCardModule,MatIconModule, MatButtonModule, TranslateModule],
  standalone: true,
  encapsulation: ViewEncapsulation.None
})
export class ItemInfoComponent {
  @Input() device: any;
  @Input() deviceType: DeviceType | null = null;
  @Input() showGeneralInfo: boolean = false;
  @Input() showTechnicalInfo: boolean = false;
  @Input() showWorkstationInfo: boolean = false;
}
