import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthStateService } from '../../../services/state-management/auth-state.service';
import { UserData } from '../../../interfaces/responses/auth-response';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordComponent } from '../../../components/admin-components/change-password/change-password.component';
import { MatButtonModule } from '@angular/material/button';
import {MatChipsModule} from '@angular/material/chips';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [CommonModule,TranslateModule,MatChipsModule,MatIconModule,MatButtonModule, MatCardModule, RouterModule],
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})

export class MyProfileComponent implements OnInit {
  user: UserData | null = null;

  constructor(private authStateService: AuthStateService, private authService:AuthService, private router: Router,  private dialog: MatDialog) {}

  ngOnInit(): void {

    this.user = this.authStateService.user();


    if (!this.user) {
      console.error('User not found');
      this.router.navigate(['/login']);
    }
  }

  changePassword(): void {
   this.dialog.open(ChangePasswordComponent, {
      width: '100%',
      maxWidth: '1000px',
      data: { },
    });
  }
}