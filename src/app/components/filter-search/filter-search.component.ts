import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-filter-search',
  templateUrl: './filter-search.component.html',
  styleUrls: ['./filter-search.component.scss'],
  standalone: true,
  imports: [FormsModule, TranslateModule]
})
export class FilterSearchComponent {
  searchTerm: string = '';

  @Output() search = new EventEmitter<string>();

  onSearchChange(): void {
    this.search.emit(this.searchTerm);
  }
}
