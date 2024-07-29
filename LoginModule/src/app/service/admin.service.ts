import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  // private BASE_URL = "http://localhost:1010/admin";
  private BASE_URL = environment.ADMIN_URL;
  constructor(private http: HttpClient) { }

  adminRegister(userData: any): Observable<any> {
    const url = `${this.BASE_URL}/register`;
    return this.http.post<any>(url, userData);
  }

  getAllUsers(): Observable<any> {
    const url = `${this.BASE_URL}/get-all-users`;
    return this.http.get<any>(url);
  }

  getUsersById(userId: string): Observable<any> {
    const url = `${this.BASE_URL}/get-users/${userId}`;
    return this.http.get<any>(url);
  }

  deleteUser(userId: string): Observable<any> {
    const url = `${this.BASE_URL}/delete/${userId}`;
    return this.http.delete<any>(url);
  }

  updateUser(userId: string, userData: any): Observable<any> {
    const url = `${this.BASE_URL}/update/${userId}`;
    return this.http.put<any>(url, userData);
  }
}
