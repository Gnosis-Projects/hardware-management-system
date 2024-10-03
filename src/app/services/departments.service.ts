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
export class DepartmentsService {

  private apiUrl = `${environment.backendUrl}/Department`;

  constructor(private http: HttpClient) { }

  getAllDepartments(): Observable<ApiResponse<CommonResponse[]>> {
    return this.http.get<ApiResponse<CommonResponse[]>>(`${this.apiUrl}/GetAll`);
  }

  getAllByMunicipalOffice(officeId: number): Observable<ApiResponse<CommonResponse[]>> {
    return this.http.get<ApiResponse<CommonResponse[]>>(`${this.apiUrl}/GetAllByMunicipalOfficeId/${officeId}`);
  }
  
  getDepartmentById(id: number): Observable<ApiResponse<CommonResponse>> {
    return this.http.get<ApiResponse<CommonResponse>>(`${this.apiUrl}/GetById/${id}`);
  }

  createDepartment(municipalOfficeId: number, departmentName: string): Observable<ApiResponse<CommonResponse>> {
    const body = { name: departmentName };
    return this.http.post<ApiResponse<CommonResponse>>(`${this.apiUrl}/Add/${municipalOfficeId}`, body);
  }

  updateDepartment(id: number, name: string): Observable<ApiResponse<CommonResponse>> {
    const body = { id, name };
    return this.http.put<ApiResponse<CommonResponse>>(`${this.apiUrl}/Update`, body);
  }

  deleteDepartment(id: number): Observable<ApiResponse<CommonResponse>> {
    return this.http.delete<ApiResponse<CommonResponse>>(`${this.apiUrl}/Delete/${id}`);
  }
}
