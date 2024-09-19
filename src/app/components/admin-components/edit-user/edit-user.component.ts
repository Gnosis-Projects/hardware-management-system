import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
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
import { CarrierStateService } from '../../../services/state-management/carrier-state.service';
import { CarrierService } from '../../../services/carrier.service';
@Component({
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
  imports: [CommonModule, MatFormFieldModule, MatCardModule,MatButtonModule, MatSelectModule, MatInputModule, ReactiveFormsModule, TranslateModule]
})
export class EditUserComponent implements OnInit {
  editUserForm: FormGroup;
  carriers: CommonResponse[] | null;
  userCarriers: CommonResponse[];
  roles: string[] = ['SuperAdmin', 'Admin'];
  user: UserData;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: UserData },
    private translate: TranslateService,
    private carrierStateService: CarrierStateService,
    private carrierService: CarrierService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    this.user = data.user;
    this.userCarriers = this.user.carriers;
    this.carriers = this.carrierStateService.getAllCarriers();

    this.editUserForm = this.fb.group({
      username: [this.user.username, Validators.required],
      email: [this.user.email, [Validators.required, Validators.email]],
      active: [this.user.active , Validators.required],
      roles: [this.user.roles[0], Validators.required],
      carriers: [this.userCarriers.map(carrier => carrier.id), Validators.required] 
    });
  }

  ngOnInit(): void {
      this.getAllCarriers();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  private getAllCarriers(): void {
    this.carrierService.getAllCarriers().subscribe({
      next: (response) => {
        if (response.success) {
          this.carriers = response.data;
        } else {
          this.toastr.error(this.translate.instant('errorMessages.unexpected.error'));
        }
      },
      error: () => {
        this.toastr.error(this.translate.instant('errorMessages.unexpected.error'));
      }
    });
  }


  onSubmit(): void {
    if (this.editUserForm.valid) {
      const { username, email, active, roles, carriers } = this.editUserForm.value;
      const updateRequest: EditUserRequest = {
        userId: this.user.userId!,
        username,
        active,
        email,
        roles: [roles],
        carrierIds: carriers,
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
