import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatIconModule, BreadcrumbModule],
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {
  breadcrumbs: Array<{ label: string, url: string }> = [];

  constructor(
    private router: Router,
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map(route => {
        while (route.firstChild) route = route.firstChild;
        return route;
      }),
      map(route => route.snapshot),
      map(snapshot => {
        let path = '';
        let label = snapshot.data['breadcrumb'];
        let url = '';

        if (snapshot.url.length > 0) {
          path = snapshot.url.map(segment => segment.path).join('/');
          url = `/${path}`;
        }

        return { label, url };
      })
    ).subscribe(breadcrumb => {
      if (breadcrumb.label) {
        breadcrumb.label = this.translate.instant(`breacrumbs.${breadcrumb.label}`)
        this.breadcrumbs = [...this.breadcrumbs, breadcrumb];
      }
    });
  }
}
