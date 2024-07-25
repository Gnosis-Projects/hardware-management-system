import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from '../notifications.service';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  constructor(
    private toastr: ToastrService,
    private translate: TranslateService,
    private notificationsService: NotificationsService
  ) {}

  handleResponse(
    success: boolean,
    successMessageKey: string,
    errorMessageKey: string,
    notificationMessageKey: string,
    notificationParams: any
  ): void {
    if (success) {
      const notificationMessage = this.translate.instant(notificationMessageKey, notificationParams);
      this.notificationsService.addNotification(notificationMessage);
      this.toastr.success(this.translate.instant(successMessageKey));
    } else {
      this.toastr.error(this.translate.instant(errorMessageKey));
    }
  }
}
