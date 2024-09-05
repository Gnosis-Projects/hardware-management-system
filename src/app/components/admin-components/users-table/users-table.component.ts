import { Component, effect, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { QuickSearchComponent } from '../../quick-search/quick-search.component';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { GetAllUsersResponse, UserData } from '../../../interfaces/responses/auth-response';
import { ExcelColumnNames } from '../../../enums/excel-column-names';
import { UserTableHeaders } from '../../../enums/table-headers.enum';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { ExportDataButtonComponent } from '../../export-data-button/export-data-button.component';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../services/auth.service';
import { Helper } from '../../../shared/helpers';
import { Router } from '@angular/router';
import { AuthStateService } from '../../../services/state-management/auth-state.service';
import { MatChipsModule } from '@angular/material/chips';
import { AlertService } from '../../../services/alert.service';
@Component({
  selector: 'app-users-table',
  standalone: true,
  imports: [CommonModule, MatTooltipModule, MatChipsModule, ExportDataButtonComponent,MatButtonModule,MatIconModule,MatMenuModule,MatTableModule,TranslateModule,QuickSearchComponent,],
  templateUrl: './users-table.component.html',
  styleUrl: './users-table.component.scss'
})
export class UsersTableComponent implements OnInit {

  users: UserData[] = [];
  dataSource = new MatTableDataSource<UserData>(this.users);
  allChecked: boolean = false;
  checkedIds: number[] = [];
  displayedColumns = Object.keys(UserTableHeaders);
  columnNames = ExcelColumnNames;
  showTable: boolean = true;
  
  constructor(
    private authService: AuthService,
    private alertService: AlertService,
    private toastr: ToastrService,
    private authStateService: AuthStateService,
    private router: Router,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.fetchAllUsers();
  }


fetchAllUsers(): void {
  this.authService.getAllUsers().subscribe({
    next: (response: GetAllUsersResponse) => {
      if (response && response.data) {
        this.users = response.data;
        this.dataSource.data = this.users;
      }
    },
    error: () => {
      this.toastr.error('Failed to fetch users');
    }
  });
}

viewUserDetails(user: UserData): void {
  this.authStateService.setViewUser(user);
  this.router.navigate(['/user-details']);
}

deleteUser(id:number){
  this.alertService.showDeleteUserAlert().then(result => {
  if(result.isConfirmed){
    this.authService.deleteUser(id).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.toastr.success(this.translate.instant('successMessages.user.disabled.successfully'));
          this.fetchAllUsers();
        } else {
          this.toastr.error('successMessages.failed.to.disable.user');
        }
      },
    });
  }
});
}


  onSearch(term: string): void {
    this.dataSource.data = term ? Helper.filterUsers(term, this.users) : this.users;
  }
}