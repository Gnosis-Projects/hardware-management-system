import { HttpClient, HttpParams } from "@angular/common/http";
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

    getWorkstationList(carrierId: number, searchParams: any): Observable<WorkStationResponse> {
        return this.http.post<WorkStationResponse>(`${this.apiUrl}/GetAllByCarrierId/${carrierId}`, searchParams);
    }

    getWorkStationsByCarrierId(
        carrierId: number, 
        page: number, 
        pageSize: number, 
        searchParams: any
    ): Observable<WorkStationResponse> {
        const params = new HttpParams()
          .set('PageNumber', page.toString())
          .set('PageSize', pageSize.toString());
    
        return this.http.post<WorkStationResponse>(`${this.apiUrl}/GetAllByCarrierId/${carrierId}`, searchParams, { params });
    }

    getByIdWithEquipment(id: number): Observable<SingleWorkStationResponse> {
        return this.http.get<SingleWorkStationResponse>(`${this.apiUrl}/GetByIdWithEquipment/${id}`);
    }

    addWorkStation(aUnitId: number, departmentId:number, request: WorkstationRequest,): Observable<any> {
        const params = new HttpParams()
          .set('departmentId', departmentId)
        return this.http.post<any>(`${this.apiUrl}/Add/${aUnitId}`, request, {params});
    }

    updateWorkStation(request: EditWorkStationRequest): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/Update`, request);
      }
    
    deleteWorkStation(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/Delete/${id}`);
    }
}
