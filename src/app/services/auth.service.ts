import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/enrivonment';
import { LoginRequest,EditUserRequest, RegisterRequest, ChangePasswordRequest } from '../interfaces/requests/auth/auth-request';
import { GetUserResponse, GetAllUsersResponse } from '../interfaces/responses/auth-response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.backendUrl}/User`;
  
  constructor(private http: HttpClient) { }

  login(request: LoginRequest): Observable<GetUserResponse> {
    return this.http.post<GetUserResponse>(`${this.apiUrl}/Login`, request);
  }
  
  register(request: RegisterRequest): Observable<GetAllUsersResponse> {
    return this.http.post<GetAllUsersResponse>(`${this.apiUrl}/Register`, request);
  }

  getAllUsers(): Observable<GetAllUsersResponse> {
    return this.http.get<GetAllUsersResponse>(`${this.apiUrl}/GetAll`);
  }

  changePassword(request: ChangePasswordRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/ChangePassword`, request);
  }

  editUser(userId: string, request: EditUserRequest): Observable<GetUserResponse> {
    return this.http.put<GetUserResponse>(`${this.apiUrl}/Update`, request);
  }

  disableUser(userId: string): Observable<GetUserResponse> {
    const request: Partial<EditUserRequest> = {
      userId,
      active: false
    };
    return this.http.put<GetUserResponse>(`${this.apiUrl}/Update`, request);
  }
  
  deleteUser(userId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/Delete/${userId}`);
  }
}
