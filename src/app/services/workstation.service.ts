import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/enrivonment";
import { SingleWorkStationResponse, WorkStationResponse } from "../interfaces/responses/workstation-response";
import { Observable } from "rxjs";
import { WorkstationRequest } from "../interfaces/requests/workstation/add-workstation-request";
import { EditWorkStationRequest } from "../interfaces/requests/workstation/edit-workstation-request";

@Injectable({
    providedIn: 'root'
})

export class WorkStationService {
    private apiUrl = `${environment.backendUrl}/WorkStation`;

    constructor(private http: HttpClient) { }

    getWorkStationsByCarrierId(carrierId: number, searchParams: any): Observable<WorkStationResponse> {
        return this.http.post<WorkStationResponse>(`${this.apiUrl}/GetAllByCarrierId/${carrierId}`, searchParams);
    }

    getByIdWithEquipment(id: number): Observable<SingleWorkStationResponse> {
        return this.http.get<SingleWorkStationResponse>(`${this.apiUrl}/GetByIdWithEquipment/${id}`);
    }

    addWorkStation(aUnitId: number, request: WorkstationRequest): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/Add/${aUnitId}`, request);
    }

    updateWorkStation(request: EditWorkStationRequest): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/Update`, request);
      }
    
    deleteWorkStation(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/Delete/${id}`);
    }
}
