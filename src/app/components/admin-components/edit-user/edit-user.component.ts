import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonResponse } from '../../../interfaces/responses/common-response';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { UserData } from '../../../interfaces/responses/auth-response';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { EditUserRequest } from '../../../interfaces/requests/auth/auth-request';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
@Component({
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
  imports: [CommonModule, MatFormFieldModule, MatCardModule,MatButtonModule, MatSelectModule, MatInputModule, ReactiveFormsModule, TranslateModule]
})
export class EditUserComponent {
  editUserForm: FormGroup;
  carriers: CommonResponse[];
  roles: string[] = ['SuperAdmin', 'Admin'];
  user: UserData;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: UserData },
    private translate: TranslateService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    this.user = data.user;
    this.carriers = this.user.carriers;

    this.editUserForm = this.fb.group({
      username: [this.user.username, Validators.required],
      email: [this.user.email, [Validators.required, Validators.email]],
      active: [this.user.active , Validators.required],
      roles: [this.user.roles[0], Validators.required],
      carrier: [this.user.carriers[0].id, Validators.required]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.editUserForm.valid) {
      const { username, email, active, roles, carrier } = this.editUserForm.value;
      const updateRequest: EditUserRequest = {
        userId: this.user.userId!,
        username,
        active,
        email,
        roles: [roles],
        carrierIds: [carrier],
      };
  
      if (this.user) {
        this.authService.editUser(this.user.userId!, updateRequest).subscribe({
          next: (response) => {
            if (response.success) {
              this.dialogRef.close({ success: true, updatedUser: response.data });
              this.toastr.success(this.translate.instant('successMessages.user.updated.successfully'));
            } else {
              this.toastr.error(response.message);
            }
          },
          error: (error) => {
            this.toastr.error(error);
          }
        });
      }
    }
  }
}
