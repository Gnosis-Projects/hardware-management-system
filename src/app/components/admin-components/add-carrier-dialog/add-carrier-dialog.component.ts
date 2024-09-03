import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
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
    });
  }

  onSave(): void {
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
  }

  onCancel(): void {
    this.dialogRef.close({ isConfirmed: false });
  }
}
