import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { WorkstationRequest } from '../interfaces/requests/workstation/add-workstation-request';
import { CommonResponse } from '../interfaces/responses/common-response';
import { EditWorkStationRequest } from '../interfaces/requests/workstation/edit-workstation-request';
import { DeviceType } from '../enums/device-type';
import { Helper } from '../shared/helpers';
import { hash } from 'bcryptjs';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AlertService {

  constructor(private translate: TranslateService, private http: HttpClient) { }


  showAddOrEditCarrierAlert(carrierName: string = ''): Promise<any> {
    return Swal.fire({
      title: carrierName ? this.translate.instant('edit.carrier') : this.translate.instant('create.carrier'),
      html: `<input type="text" id="carrierName" class="swal2-input" placeholder="Όνομα Φορέα" value="${carrierName}">`,
      confirmButtonText: this.translate.instant('save'),
      cancelButtonText: this.translate.instant('cancel'),
      showCloseButton: true,
      showCancelButton: true,
      preConfirm: () => {
        const carrierName = (document.getElementById('carrierName') as HTMLInputElement).value;
        if (!carrierName) {
          Swal.showValidationMessage('Παρακαλώ εισάγετε όνομα φορέα');
          return false;
        }
        return { carrierName };
      }
    });
  }



  showAddOrEditUnitAlert(unitName: string = ''): Promise<any> {
    return Swal.fire({
      title: unitName ? this.translate.instant('edit.aUnit') : this.translate.instant('add.aUnit'),
      html: `<input type="text" id="unitName" class="swal2-input" placeholder="Όνομα Μονάδας" value="${unitName}">`,
      confirmButtonText: this.translate.instant('save'),
      cancelButtonText: this.translate.instant('cancel'),
      showCloseButton: true,
      showCancelButton: true,
      preConfirm: () => {
        const unitName = (document.getElementById('unitName') as HTMLInputElement).value;
        if (!unitName) {
          Swal.showValidationMessage('Παρακαλώ εισάγετε όνομα μονάδας');
          return false;
        }
        return { unitName };
      }
    });
  }

  showExportAlert(): Promise<any> {
    return Swal.fire({
      title: this.translate.instant('data.export'),
      text: this.translate.instant('are.you.sure.export'),
      icon: 'question',
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonText: this.translate.instant('confirm'),
      cancelButtonText: this.translate.instant('cancel')
    });
  }

  

  showEditWorkStationAlert(workstation: EditWorkStationRequest): Promise<any> {
    const htmlContent = `
      <input type="text" id="employeeLastName" class="swal2-input" placeholder="${this.translate.instant('employeeLastName')}" value="${workstation.employeeLastName || ''}">
      <input type="text" id="employeeFirstName" class="swal2-input" placeholder="${this.translate.instant('employeeFirstName')}" value="${workstation.employeeFirstName || ''}">
      <input type="email" id="email" class="swal2-input" placeholder="${this.translate.instant('email')}" value="${workstation.email || ''}">
      <input type="text" id="personalPhone" class="swal2-input" placeholder="${this.translate.instant('phone')}" value="${workstation.personalPhone || ''}">
      <input type="text" id="department" class="swal2-input" placeholder="${this.translate.instant('department')}" value="${workstation.department || ''}">
      <input type="text" id="city" class="swal2-input" placeholder="${this.translate.instant('city')}" value="${workstation.city || ''}">
    `;

    return Swal.fire({
      title: this.translate.instant('editWorkStation'),
      html: htmlContent,
      confirmButtonText: this.translate.instant('save'),
      cancelButtonText: this.translate.instant('cancel'),
      showCloseButton: true,
      showCancelButton: true,
      preConfirm: () => {
        const employeeLastName = (document.getElementById('employeeLastName') as HTMLInputElement).value;
        const employeeFirstName = (document.getElementById('employeeFirstName') as HTMLInputElement).value;
        const email = (document.getElementById('email') as HTMLInputElement).value;
        const personalPhone = (document.getElementById('personalPhone') as HTMLInputElement).value;
        const department = (document.getElementById('department') as HTMLInputElement).value;
        const city = (document.getElementById('city') as HTMLInputElement).value;

        if (!employeeLastName || !employeeFirstName || !email || !personalPhone || !department || !city) {
          Swal.showValidationMessage(this.translate.instant('all.fields.required'));
          return false;
        }

        return { employeeLastName, employeeFirstName, email, personalPhone, department, city };
      }
    });
  }




  showAUnits(units: { name: string }[]): void {
    let unitsList = units.map(unit => `<li>${unit.name}</li>`).join('');
    if (!unitsList) unitsList = this.translate.instant('no.aUnits.found');
    Swal.fire({
      title: this.translate.instant('labels.aUnits'),
      html: `<ul>${unitsList}</ul>`,
      showCloseButton: true,
      focusConfirm: false,
      confirmButtonText: 'Κλείσιμο'
    });
  }

  showDeleteItemAlert(itemName: string): Promise<any> {
    return Swal.fire({
      title: `Διαγραφή ${itemName}`,
      text: this.translate.instant('are.you.sure.delete'),
      icon: 'question',
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonText: this.translate.instant('confirm'),
      cancelButtonText: this.translate.instant('cancel')
    });
  }

  showLoginAlert(): Promise<any> {
    return Swal.fire({
      title: this.translate.instant('login'),
      html: `
        <div class="login-alert">
          <input type="text" id="username" class="swal2-input" placeholder="${this.translate.instant('username')}">
          <input type="password" id="password" class="swal2-input" placeholder="${this.translate.instant('password')}">
        </div>
      `,
      confirmButtonText: this.translate.instant('login'),
      cancelButtonText: this.translate.instant('cancel'),
      showCloseButton: true,
      showCancelButton: true,
      customClass: {
        popup: 'dark-login-alert',
        title: 'dark-login-title',
        htmlContainer: 'dark-login-container',
        confirmButton: 'dark-login-confirm-button',
        cancelButton: 'dark-login-cancel-button',
      },
      preConfirm: () => {
        const username = (document.getElementById('username') as HTMLInputElement).value;
        const password = (document.getElementById('password') as HTMLInputElement).value;
        if (!username || !password) {
          Swal.showValidationMessage(this.translate.instant('all.fields.required'));
          return false;
        }
        return { username, password };
      }
    });
  }

  createUser(carriers: CommonResponse[]): Promise<any> {
    const carrierOptions = carriers.map(carrier => `<option value="${carrier.id}">${carrier.name}</option>`).join('');

    return Swal.fire({
      title: this.translate.instant('create.user'),
      html: `
      <label>Διαχειριστής φορέα:</label>
       <select id="carrier" class="swal2-input">
          ${carrierOptions}
        </select>
        <br>
        <input type="text" id="email" class="swal2-input" placeholder="${this.translate.instant('email')}">
        <input type="text" id="username" class="swal2-input" placeholder="${this.translate.instant('username')}">
        <input type="password" id="password" class="swal2-input" placeholder="${this.translate.instant('password')}">
        <input type="password" id="confirmPassword" class="swal2-input" placeholder="${this.translate.instant('confirm.password')}">
      `,
      confirmButtonText: this.translate.instant('create'),
      cancelButtonText: this.translate.instant('cancel'),
      showCloseButton: true,
      showCancelButton: true,

      preConfirm: () => {
        const username = (document.getElementById('username') as HTMLInputElement).value;
        const email = (document.getElementById('email') as HTMLInputElement).value;
        const password = (document.getElementById('password') as HTMLInputElement).value;
        const confirmPassword = (document.getElementById('confirmPassword') as HTMLInputElement).value;
        const carrierId = (document.getElementById('carrier') as HTMLSelectElement).value;
        console.log(carrierId)
        if (!username || !password || !confirmPassword || !carrierId) {
          Swal.showValidationMessage(this.translate.instant('all.fields.required'));
          return false;
        }
        if (password !== confirmPassword) {
          Swal.showValidationMessage(this.translate.instant('passwords.not.match'));
          return false;
        }
        return { username, email, password, carrierId };
      }
    });
  }


}