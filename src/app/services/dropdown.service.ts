import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/enrivonment';

@Injectable({
  providedIn: 'root',
})
export class DropdownService {
  private apiUrl = `${environment.backendUrl}`;

  constructor(private http: HttpClient) {}

  getIPTypes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/IPType/GetAll`);
  }

  getNetEquipments(): Observable<any> {
    return this.http.get(`${this.apiUrl}/NetworkEquipmentType/GetAll`);
  }

  getOperatingSystems(): Observable<any> {
    return this.http.get(`${this.apiUrl}/OperatingSystem/GetAll`);
  }

  getPhoneTypes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/PhoneType/GetAll`);
  }

  getPrinterTypes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/PrinterType/GetAll`);
  }

  getRemoteDesktopAppTypes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/RemoteDesktopAppType/GetAll`);
  }

  getServerDiskTypes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/ServerDiskType/GetAll`);
  }

  addOperatingSystem(data: { name: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/OperatingSystem/Add`, data);
  }

  addDiskType(data: { name: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/ServerDiskType/Add`, data);
  }

  addPhoneType(data: { name: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/PhoneType/Add`, data);
  }

  addIPType(data: { name: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/IPType/Add`, data);
  }

  addRemoteDesktopAppType(data: { name: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/RemoteDesktopAppType/Add`, data);
  }

  addServerDiskType(data: { name: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/ServerDiskType/Add`, data);
  }
}
