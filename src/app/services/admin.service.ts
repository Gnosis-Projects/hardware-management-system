import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/enrivonment";
import { Observable } from "rxjs";
import { DeviceListResponse, Device } from "../interfaces/responses/device-response";
import { WorkStationResponse, WorkStation } from "../interfaces/responses/workstation-response";
import { DeviceType } from "../enums/device-type";


@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.backendUrl}`;
  private currentPage: number = 1;
  private pageSize: number = 40;

  constructor(private http: HttpClient) {}

  setPaginationParams(pageNumber: number, pageSize: number): void {
    this.currentPage = pageNumber;
    this.pageSize = pageSize;
  }

  getAllDevices(deviceType: DeviceType, searchParams: any): Observable<DeviceListResponse | WorkStationResponse> {
    switch (deviceType) {
        case DeviceType.COMPUTER:
            return this.getAllComputers(searchParams);
        case DeviceType.PHONE:
            return this.getAllPhones(searchParams);
        case DeviceType.NETWORK_EQUIPMENT:
            return this.getAllNetworkEquipments(searchParams);
        case DeviceType.SERVER:
            return this.getAllServers(searchParams);
        case DeviceType.PRINTER:
            return this.getAllPrinters(searchParams);
        case DeviceType.WORKSTATION:
            return this.getAllWorkStations(searchParams);
        default:
            throw new Error('Unsupported device type');
    }
}



  getAllComputers(searchParams: any): Observable<DeviceListResponse> {
    return this.http.post<DeviceListResponse>(`${this.apiUrl}/Computer/GetAll`, searchParams, {
      params: { PageNumber: this.currentPage.toString(), PageSize: this.pageSize.toString() }
    });
  }

  getAllPhones(searchParams: any): Observable<DeviceListResponse> {
    return this.http.post<DeviceListResponse>(`${this.apiUrl}/Phone/GetAll`, searchParams, {
      params: { PageNumber: this.currentPage.toString(), PageSize: this.pageSize.toString() }
    });
  }

  getAllNetworkEquipments(searchParams: any): Observable<DeviceListResponse> {
    return this.http.post<DeviceListResponse>(`${this.apiUrl}/NetworkEquipment/GetAll`, searchParams, {
      params: { PageNumber: this.currentPage.toString(), PageSize: this.pageSize.toString() }
    });
  }

  getAllServers(searchParams: any): Observable<DeviceListResponse> {
    return this.http.post<DeviceListResponse>(`${this.apiUrl}/Server/GetAll`, searchParams, {
      params: { PageNumber: this.currentPage.toString(), PageSize: this.pageSize.toString() }
    });
  }

  getAllPrinters(searchParams: any): Observable<DeviceListResponse> {
    return this.http.post<DeviceListResponse>(`${this.apiUrl}/Printer/GetAll`, searchParams, {
      params: { PageNumber: this.currentPage.toString(), PageSize: this.pageSize.toString() }
    });
  }

  getAllWorkStations(searchParams: any): Observable<WorkStationResponse> {
    return this.http.post<WorkStationResponse>(`${this.apiUrl}/WorkStation/GetAll`, searchParams, {
      params: { PageNumber: this.currentPage.toString(), PageSize: this.pageSize.toString() }
    });
  }
}
