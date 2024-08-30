import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/enrivonment";
import { Observable } from "rxjs";
import { DeviceListResponse, Device } from "../interfaces/responses/device-response";
import { WorkStationResponse, WorkStation } from "../interfaces/responses/workstation-response";
import { ApiResponse } from "../interfaces/responses/api-response";

@Injectable({
    providedIn: 'root'
})

export class AdminService {
    private apiUrl = `${environment.backendUrl}`;

    constructor(private http: HttpClient) { }

    getAllPhones(searchParams: any): Observable<DeviceListResponse> {
        return this.http.post<DeviceListResponse>(`${this.apiUrl}/Phone/GetAll`, searchParams);
    }

    getAllComputers(searchParams: any): Observable<DeviceListResponse> {
        return this.http.post<DeviceListResponse>(`${this.apiUrl}/Computer/GetAll`, searchParams);
    }

    getAllPrinters(searchParams: any): Observable<DeviceListResponse> {
        return this.http.post<DeviceListResponse>(`${this.apiUrl}/Printer/GetAll`, searchParams);
    }

    getAllNetworkEquipments(searchParams: any): Observable<DeviceListResponse> {
        return this.http.post<DeviceListResponse>(`${this.apiUrl}/NetworkEquipment/GetAll`, searchParams);
    }


    getAllServers(searchParams: any): Observable<DeviceListResponse> {
        return this.http.post<DeviceListResponse>(`${this.apiUrl}/Server/GetAll`, searchParams);
    }

    
    getAllWorkStations(searchParams: any): Observable<WorkStationResponse> {
        return this.http.post<WorkStationResponse>(`${this.apiUrl}/WorkStation/GetAll`, searchParams);
    }

   
}
