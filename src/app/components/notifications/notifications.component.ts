import { Component, effect, OnInit, ViewEncapsulation } from '@angular/core';
import { NotificationsService } from '../../services/notifications.service';
import { Notification } from '../../interfaces/responses/notifications';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { formatDistanceToNow } from 'date-fns';
import { el } from 'date-fns/locale';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  standalone: true,
  imports: [TranslateModule, CommonModule, MatButtonModule, MatIconModule, MatTooltipModule, MatMenuModule, MatButtonModule]
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];

  constructor(private notificationsService: NotificationsService) {
    effect(() => {
      this.notifications = this.notificationsService.getNotifications();
    });
  }

  ngOnInit(): void {
    this.notifications = this.notificationsService.getNotifications();
  }

  deleteNotification(index: number): void {
    this.notificationsService.deleteNotification(index);
    this.notifications = this.notificationsService.getNotifications();
  }

  clearNotifications(): void {
    this.notificationsService.clearNotifications();
    this.notifications = [];
  }

  getRelativeTime(time: Date): string {
    return formatDistanceToNow(new Date(time), { addSuffix: true, locale: el });
  }
}
