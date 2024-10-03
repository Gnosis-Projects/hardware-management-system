import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonResponse } from '../../../interfaces/responses/common-response';
import { MunicipalOfficesService } from '../../../services/municipalOffices.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DepartmentsService } from '../../../services/departments.service';

@Component({
  selector: 'app-add-department-dialog',
  standalone:true,
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
  templateUrl: './add-department-dialog.component.html',
  styleUrls: ['./add-department-dialog.component.scss']
})
export class AddDepartmentDialog implements OnInit {
  unitForm: FormGroup;
  departments: CommonResponse[] = [];
  isEditMode: boolean = false;
  offices: CommonResponse[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddDepartmentDialog>,
    private departmentService: DepartmentsService,
    private municipalOfficeService: MunicipalOfficesService,
    private translate: TranslateService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEditMode = !!data?.department;
    this.unitForm = this.fb.group({
      office: [''],
      departmentName: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadMunicipalOffices();

    if (this.data && this.data.department) {
      this.isEditMode = true;
      this.unitForm.patchValue({
        carrier: this.data.department.officeId,
        departmentName: this.data.department.name
      });
    }
  }

  private loadMunicipalOffices(): void {
    this.municipalOfficeService.getAllMunicipalOffices()
      .subscribe(response => {
        if (response.success) {
          this.offices = response.data;
        } else {
          this.toastr.error(this.translate.instant('errorMessages.unexpected.error'));
        }
      });
  }

  onSave(): void {
    if (this.isEditMode) {
        this.unitForm.get('office')?.clearValidators();
        this.unitForm.get('office')?.updateValueAndValidity();
    } else {
        this.unitForm.get('office')?.setValidators(Validators.required);
        this.unitForm.get('office')?.updateValueAndValidity();
    }

    if (this.unitForm.valid) {
        const officeId = this.unitForm.value.office;
        const departmentName = this.unitForm.value.departmentName;

        if (this.isEditMode) {
            this.departmentService.updateDepartment(this.data.department.id, departmentName).subscribe({
                next: (response) => {
                    this.dialogRef.close({ isConfirmed: true, value: response.data });
                    this.toastr.success(this.translate.instant('successMessages.department.updated.successfully'));
                },
                error: () => {
                    this.toastr.error(this.translate.instant('errorMessages.department.not.updated'));
                }
            });
        } else {
            this.departmentService.createDepartment(officeId, departmentName).subscribe({
                next: (response) => {
                    this.dialogRef.close({ isConfirmed: true, value: response.data });
                    this.toastr.success(this.translate.instant('successMessages.department.created.successfully'));
                },
                error: () => {
                    this.toastr.error(this.translate.instant('errorMessages.department.not.created'));
                }
            });
        }
    } else {
        console.warn("Form is invalid. Please correct the errors.");
    }
}

  // Cancel dialog
  onCancel(): void {
    this.dialogRef.close({ isConfirmed: false });
  }
}
