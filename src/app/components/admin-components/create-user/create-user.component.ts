
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonResponse } from '../../../interfaces/responses/common-response';
import { TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslateModule } from '@ngx-translate/core';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../services/auth.service';
import { RegisterRequest } from '../../../interfaces/requests/auth/auth-request';
import { GetAllUsersResponse } from '../../../interfaces/responses/auth-response';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
  standalone: true,
  imports: [CommonModule, MatSelectModule, ReactiveFormsModule, TranslateModule, MatInputModule, MatButtonModule, MatFormFieldModule, MatStepperModule, MatDialogModule]

})
export class CreateUserComponent {
  carrierForm: FormGroup;
  userForm: FormGroup;
  passwordForm: FormGroup;

  carriers: CommonResponse[];
  roles: string[] = ['SuperAdmin', 'Admin'];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreateUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { carriers: CommonResponse[] },
    private translate: TranslateService,
    private authService: AuthService,
    private toastr: ToastrService,
  ) {
    this.carriers = data.carriers;
    this.carrierForm = this.fb.group({
      carrier: ['', Validators.required],
      role: ['', Validators.required]
    });

    this.carrierForm.get('role')?.valueChanges.subscribe((role) => {
      if (role === 'SuperAdmin') {
        this.carrierForm.get('carrier')?.disable();
        this.carrierForm.get('carrier')?.setValidators(null);
        this.carrierForm.get('carrier')?.updateValueAndValidity();
        const allCarrierIds = this.carriers.map(carrier => carrier.id);
        this.carrierForm.get('carrier')?.setValue(allCarrierIds);
      } else {
        this.carrierForm.get('carrier')?.enable();
        this.carrierForm.get('carrier')?.setValue('');
      }
    });


    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      active: [true, Validators.required]
    });


    this.passwordForm = this.fb.group({
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  nextStep(stepper: any) {
    if (this.passwordForm.value.password !== this.passwordForm.value.confirmPassword) {
      this.passwordForm.get('confirmPassword')?.setErrors({ notMatch: true });
    } else {
      stepper.next();
    }
  }

  getCarrierName(): string {
    const role = this.carrierForm.get('role')?.value;
    if (role === 'SuperAdmin') {
      return this.carriers.map(c => c.name).join(', ');
    } else {
      const carrier = this.carriers.find(c => c.id === this.carrierForm.value.carrier);
      return carrier ? carrier.name : '';
    }
  }

  submit() {
    if (this.carrierForm.valid && this.userForm.valid && this.passwordForm.valid) {
      let carrierIds = this.carrierForm.value.carrier;
      const role = this.carrierForm.value.role;
      const { email, username,active } = this.userForm.value;
      const { password } = this.passwordForm.value;

      carrierIds = Array.isArray(carrierIds) ? carrierIds : [carrierIds];

      const registerRequest: RegisterRequest = {
        carrierIds: role === 'SuperAdmin' ? this.carriers.map(carrier => carrier.id) : carrierIds,
        roles: [role],
        email,
        active,
        username,
        password
      };

      this.authService.register(registerRequest).subscribe({
        next: (response: GetAllUsersResponse) => {
          if (response.success) {
            this.dialogRef.close({ success: true });
            this.toastr.success(this.translate.instant('successMessages.user.created.successfully'));
          } else {
            alert(response.message)
          }
        },
        error: (error) => {
          alert(error)
        }
      });
    } else {
      this.carrierForm.markAllAsTouched();
      this.userForm.markAllAsTouched();
      this.passwordForm.markAllAsTouched();
    }
  }

}