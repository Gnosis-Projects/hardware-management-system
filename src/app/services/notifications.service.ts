import { Injectable, signal } from '@angular/core';
import { Notification } from '../interfaces/responses/notifications';
import { Helper } from '../shared/helpers';

@Injectable({
  providedIn: 'root'
})

export class NotificationsService {
  private readonly storageKey = 'notifications';
  private notificationsList = signal<Notification[]>(this.loadNotifications());

  constructor() {}

  getNotifications(): Notification[] {
    return this.notificationsList();
  }

  addNotification(message: string): void {
    const newNotification: Notification = { message, time: new Date() };
    const updatedNotifications = [newNotification, ...this.notificationsList() ];
    this.notificationsList.set(updatedNotifications);
    this.saveNotifications(updatedNotifications);
  }

  clearNotifications(): void {
    this.notificationsList.set([]);
    this.saveNotifications([]);
  }

  deleteNotification(index: number): void {
    const updatedNotifications = this.notificationsList();
    updatedNotifications.splice(index, 1);
    this.notificationsList.set(updatedNotifications);
    this.saveNotifications(updatedNotifications);
  }

  private loadNotifications(): Notification[] {
    const storedNotifications = localStorage.getItem(this.storageKey);

    return storedNotifications ? JSON.parse(storedNotifications).map((n: any) => ({
      ...n,
      time: new Date(n.time)
    })) : [];
  }

  private saveNotifications(notifications: Notification[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(notifications));
  }
}
