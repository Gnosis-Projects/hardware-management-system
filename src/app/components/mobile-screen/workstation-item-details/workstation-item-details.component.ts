import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Device } from '../../../interfaces/responses/device-response';
import { MatIconModule } from '@angular/material/icon';
import { DeviceStateService } from '../../../services/state-management/device-state.service';
import { TranslateModule } from '@ngx-translate/core';
import { WorkStation } from '../../../interfaces/responses/workstation-response';
import { WorkStationStateService } from '../../../services/state-management/workstation-state.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { WorkStationService } from '../../../services/workstation.service';
import { MatMenuModule } from '@angular/material/menu';
@Component({
  selector: 'app-workstation-item-details',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule,TranslateModule,MatMenuModule,MatTooltipModule],
  templateUrl: './workstation-item-details.component.html',
  styleUrls: ['./workstation-item-details.component.scss']
})
export class WorkStationItemDetailsComponent {


  @Input() workstation: WorkStation | null = null;
  @Output() itemDeleted = new EventEmitter<number>();
  
  constructor(private router: Router, private workstationStateService: WorkStationStateService, private workStationService:WorkStationService) {}

  viewItemDetail(id: number | undefined): void {
    if (id) {

        this.workstationStateService.setWorkstationId(id);

        this.router.navigate(['/workstation']);
      }
    }
    deleteItem(id: number | undefined): void {
      if (id) {

        this.workStationService.deleteWorkStation(id).subscribe({ 
          next: response => {

            if (response.success) {
              this.itemDeleted.emit(id)
            }
          },
          error: err => {
            console.error(err)
          }
        });
      }
    }
  }
