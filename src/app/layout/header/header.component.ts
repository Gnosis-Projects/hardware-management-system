import { CommonModule } from '@angular/common';
import { Component, effect } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { AlertService } from '../../services/alert.service';
import { NotificationsService } from '../../services/notifications.service';
import { MenuOptions } from '../../enums/menu-options';
import { NotificationsComponent } from "../../components/notifications/notifications.component";
import { Location } from '@angular/common';
import { AuthStateService } from '../../services/state-management/auth-state.service';
import { UserData } from '../../interfaces/responses/auth-response';
import {  ToastrService } from 'ngx-toastr';
import { ReportProblemComponent } from '../../components/report-problem/report-problem.component';
import { MatDialog } from '@angular/material/dialog';
import { MatLabel } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatDividerModule,
    MatLabel,
    MatButtonModule,
    MatTooltipModule,
    MatMenuModule,
    TranslateModule,
    NotificationsComponent,
    ReportProblemComponent
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  MenuOptions = MenuOptions;
  notifications = this.notificationsService.getNotifications();
  isSuperAdmin = this.authStateService.isSuperAdmin();
  isLoggedIn = this.authStateService.getIsLoggedIn();
  user = this.authStateService.user();

  constructor(
    private router: Router,
    private notificationsService: NotificationsService,
    public location: Location,
    private authStateService: AuthStateService,
    private dialog: MatDialog
  ) {
    effect(() => {
      this.isSuperAdmin = this.authStateService.isSuperAdmin();
      this.isLoggedIn = this.authStateService.isLoggedIn();
      this.user = this.authStateService.user();

      if(!this.isLoggedIn) {
        this.router.navigate(['/login']);
      }
    });
  }

  navigateToAdmin() {
    this.router.navigate(['/admin']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
  navigateToCarrier(){
    if(!this.isSuperAdmin){
      this.router.navigate(['/selectedCarrier']);
    }
  }

  navigateToCarriers(){
    if(!this.isSuperAdmin){
      this.router.navigate(['/carriers']);
    }
  }

  
  navigateToProfile() {
    if (this.isSuperAdmin) {
    localStorage.removeItem('viewUser')
    }
    this.router.navigate(['/my-profile']);
  }

  reportProblem(): void {
    this.dialog.open(ReportProblemComponent, {
      width: '600px',
      data: {}
    });
  }

  logout(): void {
    this.authStateService.clearUserData();
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }

  goBack(): void {
    this.location.back();
  }

}
