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
import { AUnitService } from '../../../services/aunit.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-aunit-dialog',
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
  templateUrl: './edit-aunit-dialog.component.html',
  styleUrls: ['./edit-aunit-dialog.component.scss']
})
export class EditAunitDialogComponent implements OnInit {
  unitForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditAunitDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private aUnitService: AUnitService,
    private translate: TranslateService,
    private toastr: ToastrService
  ) {
    this.unitForm = this.fb.group({
      unitName: [data.unitName || '', Validators.required]
    });
  }

  ngOnInit() {}

  onSave(): void {
    if (this.unitForm.valid) {
      const unitId = this.data.unitId;
      const unitName = this.unitForm.value.unitName;
      this.aUnitService.updateAunit(unitId, unitName).subscribe({
        next: (response) => {
          this.dialogRef.close({ isConfirmed: true, value: response.data });
          this.toastr.success(this.translate.instant('successMessages.aunit.updated.successfully'));
        },
        error: () => {
          this.toastr.error(this.translate.instant('errorMessages.aunit.not.updated'));
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close({ isConfirmed: false });
  }
}
