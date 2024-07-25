import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonResponse } from '../../../interfaces/responses/common-response';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { AuthStateService } from '../../../services/state-management/auth-state.service';

@Component({
  selector: 'app-aunit-table',
  standalone: true,
  templateUrl: './aunit-table.component.html',
  styleUrls: ['./aunit-table.component.scss'],
  imports: [CommonModule, MatIconModule, MatButtonModule, MatMenuModule, TranslateModule, MatTableModule]
})
export class AunitTableComponent {

  @Input() aunits: CommonResponse[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() edit = new EventEmitter<{ id: number, name: string }>();
  @Output() delete = new EventEmitter<{ id: number, name: string }>();
  isLoading: boolean = false;

  isSuperAdmin: boolean = this.authStateService.isSuperAdmin();
  displayedColumns: string[] = ['id', 'name', 'actions'];
  dataSource: MatTableDataSource<CommonResponse>;

  constructor(private authStateService: AuthStateService) {
    this.dataSource = new MatTableDataSource<CommonResponse>(this.aunits);
  }

  ngOnChanges(): void {
    this.dataSource.data = this.aunits;
  }

  editUnit(unit: CommonResponse): void {
    this.edit.emit({ id: unit.id, name: unit.name });
  }

  deleteUnit(unit: CommonResponse): void {
    this.delete.emit({ id: unit.id, name: unit.name });
  }
}
