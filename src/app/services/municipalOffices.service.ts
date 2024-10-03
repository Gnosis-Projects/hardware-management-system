import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/enrivonment';
import { CommonResponse } from '../interfaces/responses/common-response';
import { Observable } from 'rxjs';
import { CarrierStateService } from './state-management/carrier-state.service';
import { ApiResponse } from '../interfaces/responses/api-response';

@Injectable({
  providedIn: 'root'
})
export class MunicipalOfficesService {

  private apiUrl = `${environment.backendUrl}/MunicipalOffice`;

  constructor(private http: HttpClient) { }

  getAllMunicipalOffices(): Observable<ApiResponse<CommonResponse[]>> {
    return this.http.get<ApiResponse<CommonResponse[]>>(`${this.apiUrl}/GetAll`);
  }

  getAllByCarrier(carrierId: number): Observable<ApiResponse<CommonResponse[]>> {
    return this.http.get<ApiResponse<CommonResponse[]>>(`${this.apiUrl}/GetAllByCarrier/${carrierId}`);
  }

  getMunicipalOfficeById(id: number): Observable<ApiResponse<CommonResponse>> {
    return this.http.get<ApiResponse<CommonResponse>>(`${this.apiUrl}/GetById/${id}`);
  }

  createMunicipalOffice(carrierId: number, name: string): Observable<ApiResponse<CommonResponse>> {
    const body = { name };
    return this.http.post<ApiResponse<CommonResponse>>(`${this.apiUrl}/Add/${carrierId}`, body);
  }
  updateMunicipalOffice(id: number, name: string): Observable<ApiResponse<CommonResponse>> {
    const body = { id, name };
    return this.http.put<ApiResponse<CommonResponse>>(`${this.apiUrl}/Update`, body);
  }

  deleteMunicipalOffice(id: number): Observable<ApiResponse<CommonResponse>> {
    return this.http.delete<ApiResponse<CommonResponse>>(`${this.apiUrl}/Delete/${id}`);
  }
}
