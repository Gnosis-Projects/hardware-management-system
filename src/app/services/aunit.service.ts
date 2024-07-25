import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/enrivonment";
import { CommonResponse } from "../interfaces/responses/common-response";
import { ApiResponse } from "../interfaces/responses/api-response";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class AUnitService {
  getAllAUnits(): any {
    throw new Error('Method not implemented.');
  }
  private apiUrl = `${environment.backendUrl}/AUnit`;

  constructor(private http: HttpClient) { }

  getAUnitsByCarrierId(carrierId: number): Observable<ApiResponse<CommonResponse[]>> {
    return this.http.get<ApiResponse<CommonResponse[]>>(`${this.apiUrl}/GetByCarrierId/${carrierId}`);
  }

  getAUnitById(id: number): Observable<ApiResponse<CommonResponse>> {
    return this.http.get<ApiResponse<CommonResponse>>(`${this.apiUrl}/GetById/${id}`);
  }

  addAUnit(carrierId: number, unitName: string): Observable<ApiResponse<CommonResponse>> {
    const body = { name: unitName };
    return this.http.post<ApiResponse<CommonResponse>>(`${this.apiUrl}/Add/${carrierId}`, body);
  }

  updateAunit(id: number, name: string): Observable<ApiResponse<CommonResponse>> {
    const body = { id, name };
    return this.http.put<ApiResponse<CommonResponse>>(`${this.apiUrl}/Update`, body);
  }

  deleteAunit(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/Delete/${id}`);
  }
}
