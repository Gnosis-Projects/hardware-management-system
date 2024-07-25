import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslateService } from '@ngx-translate/core';
import { LayoutComponent } from './layout/layout.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    LayoutComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('el');
    this.translate.use('el');
  }
}
