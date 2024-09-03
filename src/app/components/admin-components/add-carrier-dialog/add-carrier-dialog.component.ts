<<<<<<< HEAD
import { Component, Inject, OnInit } from '@angular/core';
=======
import { Component, Inject } from '@angular/core';
>>>>>>> 39ba3696e5be5a68965b90ff459682334efc0bf1
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
<<<<<<< HEAD
import { TranslateModule, TranslateService } from '@ngx-translate/core';
=======
import { TranslateModule } from '@ngx-translate/core';
>>>>>>> 39ba3696e5be5a68965b90ff459682334efc0bf1
import { MatDialogModule } from '@angular/material/dialog';
import { CarrierService } from '../../../services/carrier.service';
import { CommonResponse } from '../../../interfaces/responses/common-response';
import { ApiResponse } from '../../../interfaces/responses/api-response';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-carrier-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    TranslateModule,
    MatDialogModule
  ],
  templateUrl: './add-carrier-dialog.component.html',
  styleUrls: ['./add-carrier-dialog.component.scss']
})
<<<<<<< HEAD
export class AddCarrierDialogComponent implements OnInit {
  carrierForm!: FormGroup;
  isEdit!: boolean;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddCarrierDialogComponent>,
    private carrierService: CarrierService,
    private toastr: ToastrService,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.isEdit = this.data && this.data.type === 'edit';
    this.carrierForm = this.fb.group({
      carrierName: [this.data.carrierName || '', Validators.required]
=======
export class AddCarrierDialogComponent {
  carrierForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private carrierService: CarrierService,
    private dialogRef: MatDialogRef<AddCarrierDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.carrierForm = this.fb.group({
      carrierName: [data.carrierName || '', Validators.required]
>>>>>>> 39ba3696e5be5a68965b90ff459682334efc0bf1
    });
  }

  onSave(): void {
<<<<<<< HEAD
    if (!this.carrierForm.valid) {
      return;
    }
    const carrierName = this.carrierForm.value.carrierName;
    if (this.isEdit) {
      this.updateCarrier(carrierName);
    } else {
      this.createCarrier(carrierName);
    }
  }

  private createCarrier(carrierName: string): void {
    this.carrierService.createCarrier(carrierName).subscribe({
      next: (response) => {
        this.dialogRef.close({ isConfirmed: true, value: response.data });
        this.toastr.success(this.translate.instant('successMessages.carrier.created.successfully'));
      },
      error: () => {
        this.toastr.error(this.translate.instant('errorMessages.carrier.not.created'));
      }
    });
  }

  private updateCarrier(carrierName: string): void {
    this.carrierService.updateCarrier(this.data.carrierId, carrierName).subscribe({
      next: (response) => {
        this.dialogRef.close({ isConfirmed: true, value: response.data });
        this.toastr.success(this.translate.instant('successMessages.carrier.updated.successfully'));
      },
      error: () => {
        this.toastr.error(this.translate.instant('errorMessages.carrier.not.updated'));
      }
    });
=======
    if (this.carrierForm.valid) {
      const carrierName = this.carrierForm.value.carrierName; 
      this.carrierService.createCarrier(carrierName).subscribe({
        next: (response: ApiResponse<CommonResponse>) => {
          if (response.success) {
            this.dialogRef.close({ isConfirmed: true, value: response.data });
            this.toastr.success('successMessages.carrier.created.successfully')
          } else {
            this.toastr.error('errorMessages.carrier.not.created')
          }
        },
      });
    }
>>>>>>> 39ba3696e5be5a68965b90ff459682334efc0bf1
  }

  onCancel(): void {
    this.dialogRef.close({ isConfirmed: false });
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> 39ba3696e5be5a68965b90ff459682334efc0bf1
