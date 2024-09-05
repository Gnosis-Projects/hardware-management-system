import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AUnitService } from '../../../services/aunit.service';
import { CommonResponse } from '../../../interfaces/responses/common-response';
import { CommonModule } from '@angular/common';
import { AUnitStateService } from '../../../services/state-management/aunit-state.service';
import { WorkStationService } from '../../../services/workstation.service';
import { take } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-aunit-detail',
  standalone: true,
  templateUrl: './aunit-detail.component.html',
  styleUrls: ['./aunit-detail.component.scss'],
  imports: [CommonModule, RouterModule]
})
export class AUnitDetailComponent implements OnInit {
  aUnit: CommonResponse | null = null;

  constructor(
    private router: Router,
    private aUnitService: AUnitService,
    private aUnitStateService: AUnitStateService,
    private workStationService: WorkStationService
  ) {}

  ngOnInit(): void {
    const aUnitId = this.aUnitStateService.getAUnitId();
    if (aUnitId !== null) {
      this.fetchAUnit(aUnitId);
    } else {
      this.router.navigate(['/carriers']);
    }
  }

  fetchAUnit(id: number): void {
    this.aUnitService.getAUnitById(id)
      .pipe(take(1))
      .subscribe(response => {
        if (response.success) {
          this.aUnit = response.data;
        } 
      });
  }

  handleAddWorkStation(formGroup: FormGroup): void {
    if (this.aUnit) {
      this.workStationService.addWorkStation(this.aUnit.id, formGroup.value)
        .pipe(take(1))
        .subscribe({
          next: response => {
            formGroup.reset();
          },
        });
    }
  }
}
