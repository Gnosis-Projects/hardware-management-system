import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/enrivonment';
import { Observable } from 'rxjs';
import { DeviceListResponse, SingleDeviceResponse, DeviceHistoryResponse } from '../interfaces/responses/device-response';
import { EditDeviceRequest } from '../interfaces/requests/device-request';
import { AddDeviceRequest } from '../interfaces/requests/device-request';
import { DeviceType } from '../enums/device-type';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private apiUrl = `${environment.backendUrl}`;

  constructor(private http: HttpClient) { }

  getDeviceById(deviceId: number, deviceType: DeviceType): Observable<SingleDeviceResponse> {
    const endpoint = this.getEndpoint(deviceType, 'GetById');
    return this.http.get<SingleDeviceResponse>(`${this.apiUrl}/${endpoint}/${deviceId}`);
  }

  getDevicesByCarrierId(carrierId: number, deviceType: DeviceType, searchParams: any): Observable<DeviceListResponse> {
    const endpoint = this.getEndpoint(deviceType, 'GetAllByCarrierId');
    return this.http.post<DeviceListResponse>(`${this.apiUrl}/${endpoint}/${carrierId}`, searchParams);
  }

  getDeviceHistory(deviceId: number, deviceType: DeviceType): Observable<DeviceHistoryResponse> {
    const endpoint = this.getEndpoint(deviceType, 'GetHistory');
    return this.http.get<DeviceHistoryResponse>(`${this.apiUrl}/${endpoint}/${deviceId}`);
  }

  addDevice(addRequest: Partial<AddDeviceRequest>, workStationId: number, deviceType: DeviceType): Observable<SingleDeviceResponse> {
    const endpoint = this.getEndpoint(deviceType, 'Add');
    return this.http.post<SingleDeviceResponse>(`${this.apiUrl}/${endpoint}/${workStationId}`, addRequest);
  }

  editDevice(editRequest: EditDeviceRequest, deviceType: DeviceType): Observable<SingleDeviceResponse> {
    const endpoint = this.getEndpoint(deviceType, 'Update');
    return this.http.put<SingleDeviceResponse>(`${this.apiUrl}/${endpoint}`, editRequest);
  }

  deleteDevice(deviceId: number, deviceType: DeviceType): Observable<any> {
    const endpoint = this.getEndpoint(deviceType, 'Delete');
    return this.http.delete<any>(`${this.apiUrl}/${endpoint}/${deviceId}`);
  }

  private getEndpoint(deviceType: DeviceType, action: string): string {
    switch (deviceType) {
      case DeviceType.COMPUTER:
        return `Computer/${action}`;
      case DeviceType.PHONE:
        return `Phone/${action}`;
      case DeviceType.PRINTER:
        return `Printer/${action}`;
      case DeviceType.NETWORK_EQUIPMENT:
        return `NetworkEquipment/${action}`;
      default:
        throw new Error('Unsupported device type');
    }
  }
}