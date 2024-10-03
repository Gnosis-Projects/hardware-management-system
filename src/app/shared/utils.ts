import { Injectable } from '@angular/core';
import { AlertService } from '../services/alert.service';
import { CarrierService } from '../services/carrier.service';
import { UtilityService } from '../services/utility/utility.service';
import { TranslateService } from '@ngx-translate/core';
import { AUnitService } from '../services/aunit.service';
import { ToastrService } from 'ngx-toastr';
import { CommonResponse } from '../interfaces/responses/common-response';
import { WorkStationService } from '../services/workstation.service';
import { WorkstationRequest } from '../interfaces/requests/workstation/add-workstation-request';
import { DeviceService } from '../services/device.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DeviceType } from '../enums/device-type';
import { AddDeviceDialogComponent } from '../components/add-device-dialog/add-device-dialog.component';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Utils {

  constructor(
    private alertService: AlertService,
    private carrierService: CarrierService,
    private utilityService: UtilityService,
    private translate: TranslateService,
    private aUnitService: AUnitService,
    private toastr: ToastrService,
    private workStationService: WorkStationService,
    private router: Router,
    private dialog: MatDialog,
    private deviceService: DeviceService,
  ) {}

  handleCarrierEdit(
    currentName: string,
    id: number,
    fetchDataCallback: () => void
  ): void {
    this.alertService.showAddOrEditUnitAlert(currentName).then(result => {
      if (result.isConfirmed) {
        const carrierName = result.value?.unitName;
        if (carrierName) {
          this.carrierService.updateCarrier(id, carrierName).subscribe(response => {
            this.utilityService.handleResponse(
              response.success,
              'successMessages.carrier.updated.successfully',
              'errorMessages.unexpected.error',
              'notificationMessages.carrier.updated',
              { carrierName }
            );
            if (response.success) {
              fetchDataCallback();
            }
          });
        }
      }
    });
  }

  addAUnit(carrierId: number, unitName: string, callback: (success: boolean) => void): void {
    this.aUnitService.addAUnit(carrierId, unitName).subscribe(response => {
      if (response.message) {
        this.toastr.error(this.translate.instant(response.message));
        callback(false);
        return;
      }
      this.utilityService.handleResponse(
        response.success,
        'successMessages.aunit.added.successfully',
        'errorMessages.unexpected.error',
        'notificationMessages.aunit.added',
        { unitName }
      );
      callback(response.success);
    });
  }

  updateAUnit(unitId: number, unitName: string, aUnits: CommonResponse[], callback: (success: boolean, updatedUnits: CommonResponse[]) => void): void {
    this.aUnitService.updateAunit(unitId,  unitName ).subscribe(response => {
      if (response.success) {
        this.utilityService.handleResponse(
          response.success,
          'successMessages.aunit.updated.successfully',
          'errorMessages.unexpected.error',
          'notificationMessages.aunit.updated',
          { unitName }
        );
        const updatedUnits = aUnits.map(aunit => aunit.id === unitId ? { ...aunit, name: unitName } : aunit);
        callback(true, updatedUnits);
      } else {
        this.toastr.error(this.translate.instant('errorMessages.unexpected.error'));
        callback(false, aUnits);
      }
    });
  }

  addWorkStation(aUnitId: number,departmentId:number, request: WorkstationRequest, callback: (success: boolean, id?: number) => void): void {
    if (this.router.url !== '/selectedCarrier') {
      this.workStationService.addWorkStation(aUnitId, departmentId, request).subscribe(response => {
        if (response.success) {
          this.utilityService.handleResponse(
            response.success,
            'successMessages.workstation.added.successfully',
            'errorMessages.unexpected.error',
            'notificationMessages.workstation.added',
            {}
          );
          callback(true, response.data[response.data.length-1].id);
        } else {
          this.toastr.error(this.translate.instant('errorMessages.unexpected.error'));
          callback(false);
        }
      });
    } 
  }
  
  fetchWorkstation(id: number, callback: (response: any) => void): void {
    this.workStationService.getByIdWithEquipment(id)
      .pipe(take(1))
      .subscribe(response => {
        callback(response);
      });
  }

  deleteWorkStation(id: number, onSuccess: () => void): void {
    this.alertService.showDeleteItemAlert('θέσης εργασίας').then(result => {
      if (result.isConfirmed) {
        this.workStationService.deleteWorkStation(id).pipe(take(1)).subscribe(response => {
          if (response.success) {
            this.toastr.success(this.translate.instant('successMessages.workstation.deleted.successfully'));
            onSuccess();
          } else {
            this.toastr.error(this.translate.instant('errorMessages.unexpected.error'));
          }
        });
      }
    });
  }

  editWorkStation(workstation: any): void {
    this.alertService.showEditWorkStationAlert({
      id: workstation.data.id, 
      employeeLastName: workstation.data.employeeLastName,
      employeeFirstName: workstation.data.employeeFirstName,
      email: workstation.data.email,
      personalPhone: workstation.data.personalPhone,
      socketNumber: workstation.data.socketNumber,
      workstationNumber: workstation.data.workstationNumber,
      department: workstation.data.department,
      city: workstation.data.city
    }).then(result => {
      if (result.isConfirmed) {
        const workstationData = {
          ...result.value,
          id: workstation.data.id 
        };
        this.workStationService.updateWorkStation(workstationData).subscribe(response => {
          if (response.success) {
            this.toastr.success(this.translate.instant('successMessages.workstation.updated.successfully'));
          } else {
            this.toastr.error(this.translate.instant('errorMessages.unexpected.error'));
          }
        });
      }
    });
  }

  toggleForm(deviceType: DeviceType, workstationId: number, callback: (response: any) => void): void {
    const dialogRef = this.dialog.open(AddDeviceDialogComponent, {
      width: '900px',
      data: { deviceType }
    });
  
    dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
      if (result) {
        const deviceData = result;
        if (deviceData) {
          this.deviceService.addDevice(deviceData, workstationId, deviceType).pipe(take(1)).subscribe(response => {
            callback(response);
          });
        }
      }
    });
  }
}
