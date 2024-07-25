import { Component } from '@angular/core';
import { BreadcrumbComponent } from '../components/breadcrumb/breadcrumb.component';
import { HeaderComponent } from './header/header.component';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from "./footer/footer.component";
import { LoadingSpinnerComponent } from '../components/loading-spinner/loading-spinner.component';
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [BreadcrumbComponent,LoadingSpinnerComponent, HeaderComponent, RouterOutlet, FooterComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

}
