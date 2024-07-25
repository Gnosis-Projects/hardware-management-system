import { Component } from '@angular/core';
import { CarrierTableComponent } from '../../../components/tables/carrier-table/carrier-table.component';
@Component({
  selector: 'app-carrier-list',
  standalone: true,
  imports: [
    CarrierTableComponent,
  ],
  templateUrl: './carrier-list.component.html',
  styleUrls: ['./carrier-list.component.scss']
})
export class CarrierListComponent  {
 
}
