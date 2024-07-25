import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialogModule } from '@angular/material/dialog';
@Component({
  selector: 'app-add-aunit-dialog',
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
  templateUrl: './add-aunit-dialog.component.html',
  styleUrls: ['./add-aunit-dialog.component.scss']
})
export class AddAunitDialogComponent {
  unitForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddAunitDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.unitForm = this.fb.group({
      unitName: [data.unitName || '', Validators.required]
    });
  }

  onSave(): void {
    if (this.unitForm.valid) {
      this.dialogRef.close({ isConfirmed: true, value: this.unitForm.value });
    }
  }

  onCancel(): void {
    this.dialogRef.close({ isConfirmed: false });
  }
}
