import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { UserData } from '../../interfaces/responses/auth-response';
import { Helper } from '../../shared/helpers';

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {
  private readonly tokenKey = 'auth_token';
  private readonly userKey = 'auth_user';
  private readonly viewUserKey = 'view_user';

  token = signal<string | null>(null);
  user = signal<UserData | null>(null);
  viewUser = signal<UserData | null>(null);
  isLoggedIn = signal<boolean>(false);

  constructor(private router: Router) {
    this.getFromLocalStorage();
  }

  private getFromLocalStorage() {
    const encryptedToken = localStorage.getItem(this.tokenKey);
    const encryptedUser = localStorage.getItem(this.userKey);
    const encryptedViewUser = localStorage.getItem(this.viewUserKey);

    if (encryptedToken && encryptedUser) {
      this.token.set(Helper.decode(encryptedToken));
      this.user.set(JSON.parse(Helper.decode(encryptedUser)));
      this.isLoggedIn.set(true);
    }
    if (encryptedViewUser) {
      this.viewUser.set(JSON.parse(Helper.decode(encryptedViewUser)));
    }
  }

  private saveToLocalStorage(token: string, user: UserData) {
    const encryptedToken = Helper.encode(token);
    const encryptedUser = Helper.encode(JSON.stringify(user));

    localStorage.setItem(this.tokenKey, encryptedToken);
    localStorage.setItem(this.userKey, encryptedUser);
  }

  private saveViewUserToLocalStorage(user: UserData) {
    const encryptedViewUser = Helper.encode(JSON.stringify(user));
    localStorage.setItem(this.viewUserKey, encryptedViewUser);
  }

  setUserData(token: string, user: UserData) {
    this.token.set(token);
    this.user.set(user);
    this.isLoggedIn.set(true);
    this.saveToLocalStorage(token, user);
  }

  clearUserData() {
    localStorage.clear();
    this.token.set(null);
    this.user.set(null);
    this.viewUser.set(null);
    this.isLoggedIn.set(false);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.token() !== null;
  }

  isSuperAdmin(): boolean {
    return this.user()?.roles[0] === 'SuperAdmin';
  }

  hasMultipleCarriers(): boolean{
    if(!this.isSuperAdmin){
      return this.user()!.carriers.length > 1;
    } 
    return false;
  }

  setIsLoggedIn(value: boolean) {
    this.isLoggedIn.set(value);
  }

  getIsLoggedIn(): boolean {
    return this.isLoggedIn();
  }

  setViewUser(user: UserData) {
    this.viewUser.set(user);
    this.saveViewUserToLocalStorage(user);
  }

  getViewUser(): UserData | null {
    return this.viewUser();
  }
}
