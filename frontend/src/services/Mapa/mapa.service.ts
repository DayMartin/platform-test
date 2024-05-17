import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MapaService {

  constructor(
    private http: HttpClient
  ) { }

  // buscarPontos(): Observable<any> {
  //   return this.http.get(`${Environment.URL_BASE}/get/pontos`);
  // }

  cadastrarPonto(data: { latitude: string, longitude: string }): Observable<any> {
    return this.http.post(`${environment.URL_BASE}/register/pontos`, data);
  }


  construirMapa(): Observable<string> {
    return this.http.get(`${environment.URL_BASE}/mapa`, { responseType: 'text' });
  }
}
