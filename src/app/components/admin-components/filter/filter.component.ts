import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FilterType } from '../../../enums/filter-type.enum';
import { CommonModule, KeyValuePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CommonResponse } from '../../../interfaces/responses/common-response';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';
import { operationSystems } from '../../../shared/os';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, MatTooltipModule, MatSidenavModule, MatButtonModule, MatIconModule, CommonModule, TranslateModule, KeyValuePipe]
})
export class FilterComponent implements OnChanges {
  @Input() filterType: FilterType = FilterType.Computer;
  @Input() carriers: CommonResponse[] = [];
  @Output() filter = new EventEmitter<any>();
  showFilter: boolean = false;
  filterForm: FormGroup;
  osOptions: string[] = [];
  FilterType = FilterType;
  operationSystems = operationSystems;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.filterForm = this.fb.group({});
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['filterType'] || changes['carriers']) {
      this.initializeForm();
    }
  }

  toggleFilter(): void {
    this.showFilter = !this.showFilter;
  }

  initializeForm() {
    let controls: any = {
      carrierId: [null],
    };

    switch (this.filterType) {
      case FilterType.Phone:
      case FilterType.Printer:
      case FilterType.NetEquipment:
        controls = {
          ...controls,
          deviceName: [''],
          model: [''],
          serialNumber: ['']
        };
        break;
      case FilterType.Computer:
        controls = {
          ...controls,
          deviceName: [''],
          model: [''],
          serialNumber: [''],
          ram: [0],
          ip: [''],
          macAddress: [''],
          operatingSystem: [''],
        };
        break;
      case FilterType.Workstation:
        controls = {
          ...controls,
          employeeLastName: [''],
          employeeFirstName: [''],
          department: ['']
        };
        break;
      default:
        controls = {
          ...controls,
          ram: [0]
        };
        break;
    }

    this.filterForm = this.fb.group(controls);
  }


  onFilter(): void {
    const { carrierId, ...filterDto } = this.filterForm.value;
    if (this.filterForm.valid) {
      this.filter.emit({ carrierId, filterDto });
    }
  }

  onReset(): void {
    this.filterForm.reset({
      carrierId: null,
      deviceName: '',
      model: '',
      serialNumber: '',
      ram: 0,
      ip: '',
      macAddress: '',
      operatingSystem: '',
      employeeLastName: '',
      employeeFirstName: '',
      department: ''
    });
  }
}
