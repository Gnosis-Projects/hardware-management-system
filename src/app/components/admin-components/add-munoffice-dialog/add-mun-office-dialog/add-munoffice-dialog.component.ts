import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MunicipalOfficesService } from '../../../../services/municipalOffices.service';
import { CarrierStateService } from '../../../../services/state-management/carrier-state.service';
import { CommonResponse } from '../../../../interfaces/responses/common-response';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CarrierService } from '../../../../services/carrier.service';
import { ExtraStateService } from '../../../../services/state-management/extra-state.service';

@Component({
  selector: 'app-add-munoffice-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    TranslateModule,
    MatDialogModule,
    MatSelectModule
  ],
  templateUrl: './add-munoffice-dialog.component.html',
  styleUrls: ['./add-munoffice-dialog.component.scss']
})
export class AddMunOfficeDialogComponent implements OnInit {
  unitForm: FormGroup;
  carriers: CommonResponse[] = [];
  isEditMode: boolean = false;
  offices: CommonResponse[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dialogRef: MatDialogRef<AddMunOfficeDialogComponent>,
    private munOfficeService: MunicipalOfficesService,
    private carrierService: CarrierService,
    private translate: TranslateService,
    private munOfficeState: ExtraStateService,
    private toastr: ToastrService,
    private carrierStateService: CarrierStateService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEditMode = !!data?.munOffice;
    this.unitForm = this.fb.group({
      carrier: [''],
      munOfficeName: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadCarriers();

    if (this.data && this.data.munOffice) {
      this.isEditMode = true;
      this.unitForm.patchValue({
        carrier: this.data.munOffice.carrierId,
        munOfficeName: this.data.munOffice.name
      });
    }
  }

  private loadCarriers(): void {
    const carriersFromState = this.carrierStateService.getAllCarriers();
    if (carriersFromState) {
      this.carriers = carriersFromState;
    } else {
      this.carrierService.getAllCarriers()
        .subscribe(response => {
          if (response.success) {
            this.carrierStateService.setAllCarriers(response.data);
            this.carriers = response.data;
          } else {
            console.error(response.message);
          }
        });
    }
  }

  onSave(): void {
    if (this.isEditMode) {
      this.unitForm.get('carrier')?.clearValidators();
      this.unitForm.get('carrier')?.updateValueAndValidity();
    } else {
      this.unitForm.get('carrier')?.setValidators(Validators.required);
      this.unitForm.get('carrier')?.updateValueAndValidity();
    }

    if (this.unitForm.valid) {
      const carrierId = this.unitForm.value.carrier;
      const munOfficeName = this.unitForm.value.munOfficeName;

      if (this.isEditMode) {
        this.munOfficeService.updateMunicipalOffice(this.data.munOffice.id, munOfficeName).subscribe({
          next: (response) => {
            this.dialogRef.close({ isConfirmed: true, value: response.data });
            this.toastr.success(this.translate.instant('successMessages.municipalOffice.updated.successfully'));
          },
          error: () => {
            this.toastr.error(this.translate.instant('errorMessages.municipalOffice.not.updated'));
          }
        });
      } else {
        this.munOfficeService.createMunicipalOffice(carrierId, munOfficeName).subscribe({
          next: (response) => {
            this.dialogRef.close({ isConfirmed: true, value: response.data });
            this.toastr.success(this.translate.instant('successMessages.municipalOffice.created.successfully'));
          },
          error: () => {
            this.toastr.error(this.translate.instant('errorMessages.municipalOffice.not.created'));
          }
        });
      }
    } else {
      console.warn("Form is invalid. Please correct the errors.");
    }
  }



  onCancel(): void {
    this.dialogRef.close({ isConfirmed: false });
  }
}
