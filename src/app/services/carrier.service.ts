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
export class CarrierService {

  private apiUrl = `${environment.backendUrl}/Carrier`;

  constructor(private http: HttpClient) { }

  getAllCarriers(): Observable<ApiResponse<CommonResponse[]>> {
    return this.http.get<ApiResponse<CommonResponse[]>>(`${this.apiUrl}/GetAll`);
  }

  getCarrierById(id: number): Observable<ApiResponse<CommonResponse>> {
    return this.http.get<ApiResponse<CommonResponse>>(`${this.apiUrl}/GetById/${id}`);
  }

  createCarrier(name: string): Observable<ApiResponse<CommonResponse>> {
    const body = { name };
    return this.http.post<ApiResponse<CommonResponse>>(`${this.apiUrl}/Add`, body);
  }
  updateCarrier(id: number, name: string): Observable<ApiResponse<CommonResponse>> {
    const body = { id, name };
    return this.http.put<ApiResponse<CommonResponse>>(`${this.apiUrl}/Update`, body);
  }

  deleteCarrier(id: number): Observable<ApiResponse<CommonResponse>> {
    return this.http.delete<ApiResponse<CommonResponse>>(`${this.apiUrl}/Delete/${id}`);
  }
}
