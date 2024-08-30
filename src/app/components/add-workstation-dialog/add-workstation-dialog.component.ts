import { Component, inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { CommonResponse } from '../../interfaces/responses/common-response';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { AuthStateService } from '../../services/state-management/auth-state.service';
import { AUnitService } from '../../services/aunit.service';
import { WorkStationService } from '../../services/workstation.service';
import { WorkstationRequest } from '../../interfaces/requests/workstation/add-workstation-request';
import { take } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-workstation-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatOptionModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    TranslateModule,
  ],
  templateUrl: './add-workstation-dialog.component.html',
  styleUrls: ['./add-workstation-dialog.component.scss']
})
export class AddWorkStationDialogComponent implements OnInit {

  fb = inject(FormBuilder);
  dialogRef = inject(MatDialogRef<AddWorkStationDialogComponent>);
  data = inject(MAT_DIALOG_DATA);
  @Input() aUnits: CommonResponse[] = [];
  @Input() carriers: CommonResponse[] = [];
  filteredAUnits: CommonResponse[] = [];
  isSuperAdmin: boolean = false;
  addWorkStationForm: FormGroup;
  disableCarrierInput: boolean = false;

  constructor(private authStateService: AuthStateService, private router: Router, private aUnitService: AUnitService, private workstationService:WorkStationService) {
    this.addWorkStationForm = this.fb.group({
      carrierId: [''],
      aUnitId: ['', Validators.required],
      employeeFirstName: ['', Validators.required],
      employeeLastName: ['', Validators.required],
      workstationNumber:[''],
      socketNumber: [''],
      email: ['', [Validators.required, Validators.email]],
      personalPhone: ['', Validators.required],
      department: ['', Validators.required],
      city: ['', Validators.required]
    });

    this.carriers = this.data.carriers;
    this.aUnits = this.data.aUnits;
    this.isSuperAdmin = this.data.isSuperAdmin;
    this.filteredAUnits = this.isSuperAdmin ? [] : this.aUnits;
  }

  ngOnInit(): void {
    this.isSuperAdmin = this.authStateService.isSuperAdmin();
    if (!this.isSuperAdmin) {
      this.addWorkStationForm.get('carrierId')?.clearValidators();
      this.filteredAUnits = this.aUnits;
    }
    if (this.data) {
      this.addWorkStationForm.patchValue(this.data);
    }
    if(this.router.url == '/selectedCarrier'){
      this.disableCarrierInput = true
    }

  }

  onCarrierChange(carrierId: number) {
    this.aUnitService.getAUnitsByCarrierId(carrierId).subscribe((response) => {
      if (response.success) {
        this.filteredAUnits = response.data;
        this.addWorkStationForm.get('aUnitId')?.reset();
      }
    });
  }

  onSave() {

    if (this.addWorkStationForm.valid) {
      const formData = this.addWorkStationForm.value;

      const workstationRequest: WorkstationRequest = {
        employeeLastName: formData.employeeLastName,
        employeeFirstName: formData.employeeFirstName,
        email: formData.email,
        socketNumber: formData.socketNumber,
        workstationNumber: formData.workstationNumber,
        personalPhone: formData.personalPhone,
        department: formData.department,
        city: formData.city
      };
      this.workstationService.addWorkStation(Number(formData.aUnitId), workstationRequest)
        .pipe(take(1))
        .subscribe((response) => {
          if (response.success) {
            this.dialogRef.close(response.data);
            this.disableCarrierInput = false;
          } else {
            console.error('error');
          }
        });
    }
  }

  
  onCancel() {
    this.dialogRef.close();
  }
}
