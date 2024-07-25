import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { AuthStateService } from '../../../services/state-management/auth-state.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-change-password',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule,MatFormFieldModule, MatInputModule, MatButtonModule, TranslateModule, MatDialogModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent {
  changePasswordForm: FormGroup;

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private authStateService: AuthStateService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ChangePasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.changePasswordForm = this.fb.group({
      currentPassword: [data.currentPassword || '', Validators.required],
      newPassword: [data.newPassword || '', Validators.required],
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.changePasswordForm.valid) {
      const { currentPassword, newPassword } = this.changePasswordForm.value;
      this.authService.changePassword({ userId: 'b7fa2bc1-1224-4e9f-b0e9-189b74897d50', currentPassword, newPassword }).subscribe({
        next: (response) => {
          if (response.success) {
            this.dialogRef.close();
            this.toastr.success(this.translate.instant('successMessages.password.changed.successfully'));
            this.authStateService.clearUserData();
          }
          else if(response.success === false){
            this.toastr.error(this.translate.instant('errorMessages.failed.change.password'));
          }
        }
      });
    }
  }
}
