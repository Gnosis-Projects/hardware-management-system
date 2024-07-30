import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
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
    });
  }

  onSave(): void {
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
  }

  onCancel(): void {
    this.dialogRef.close({ isConfirmed: false });
  }
}
