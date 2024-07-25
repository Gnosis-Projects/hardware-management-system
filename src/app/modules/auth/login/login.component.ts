import { CommonModule } from '@angular/common';
import { Component, effect, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../../services/auth.service';
import { AuthStateService } from '../../../services/state-management/auth-state.service';
import { GetUserResponse } from '../../../interfaces/responses/auth-response';
import { CarrierStateService } from '../../../services/state-management/carrier-state.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-login',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterModule, FormsModule, ReactiveFormsModule, MatIconModule]
})
export class LoginComponent implements OnInit {
  
  isLoggedIn = false;  
  loginForm: FormGroup;
  backgroundImage = '../../../../assets/login-background.png';
  hasMultipleCarriers: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService,
    private authStateService: AuthStateService,
    private carrierStateService: CarrierStateService 
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
    
  }

  ngOnInit(): void {
    this.isLoggedIn = this.authStateService.isLoggedIn();
    this.hasMultipleCarriers = this.authStateService.hasMultipleCarriers()
    if (this.isLoggedIn && this.authStateService.isSuperAdmin()) {
      this.router.navigate(['/admin']);
    }
    
    if (this.isLoggedIn && !this.authStateService.isSuperAdmin()) {
      this.router.navigate(['/admin']);
    }
  
  }
  onSubmit(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.authService.login({ username, password }).pipe(take(1)).subscribe({
        next: (response: GetUserResponse) => {
          if (response.success) {
            const userData = response.data;
            this.hasMultipleCarriers = userData.carriers.length > 1;
            this.authStateService.setIsLoggedIn(true);
            this.authStateService.setUserData(userData.token, userData);
            if (userData.roles[0] === 'SuperAdmin') {
              this.router.navigate(['/admin']);
            } else if (userData.roles[0] === 'Admin' && this.hasMultipleCarriers) {
              this.carrierStateService.setAllCarriers(userData.carriers);
              this.router.navigate(['/carriers']);
            } else {
              this.carrierStateService.setSelectedCarrier(userData.carriers[0]);
              this.router.navigate(['/selectedCarrier']);
            }
          } 
        },
      });
    }
  }
  
}
