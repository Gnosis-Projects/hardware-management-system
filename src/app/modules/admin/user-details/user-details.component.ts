import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { GetUserResponse, UserData } from '../../../interfaces/responses/auth-response';
import { AuthStateService } from '../../../services/state-management/auth-state.service';
import { Router, RouterModule } from '@angular/router';
import {MatCardModule} from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';3
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { EditUserComponent } from '../../../components/admin-components/edit-user/edit-user.component';
import { MatChipsModule } from '@angular/material/chips';
@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule, MatButtonModule,MatChipsModule,TranslateModule,MatCardModule,RouterModule],
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  user: UserData | null = null;

  constructor(private authStateService: AuthStateService, private router: Router, private dialog: MatDialog) {}

  ngOnInit(): void {

    if(this.authStateService.user()?.email === this.authStateService.getViewUser()?.email) {
      this.router.navigate(['/my-profile']);
    }

    const currentRoute = this.router.url;
    if (currentRoute === '/my-profile') {
      this.user = this.authStateService.user();
    } else {
      this.user = this.authStateService.getViewUser();
    }

    if (!this.user) {
      console.error('Δεν βρέθηκε ο χρήστης');
    }
  }

  openEditUserDialog(): void {
    if (this.user) {
      const dialogRef = this.dialog.open(EditUserComponent, {
        data: { user: this.user }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.success && result.updatedUser) {
          this.user = result.updatedUser;
        }
      });
    }
  }
}