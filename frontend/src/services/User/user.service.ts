import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient
  ) { }

  buscarUsers(): Observable<any> {
    return this.http.get(`${environment.URL_BASE}/consulta/user`);
  }

  cadastrarUser(data: { username: string, password: string }): Observable<any> {
    return this.http.post(`${environment.URL_BASE}/register`, data);
  }

  loginUser(data: { username: string, password: string }): Observable<any> {
    return this.http.post(`${environment.URL_BASE}/login`, data).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
      })
    );
  }

  logoutUser(): void {
    localStorage.removeItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
