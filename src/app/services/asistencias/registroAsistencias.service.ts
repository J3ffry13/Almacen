import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegistroAsistenciasService {
    myAppUrl: string;
    myApiUrl: string;
  
    constructor(private http: HttpClient) {
      this.myAppUrl = environment.endpoint;
      this.myApiUrl = '/api/asistencias';
    }

  public obtenerTrabajador$ = (datos: any): Observable<any> =>
    this.http.post(this.myAppUrl + this.myApiUrl + '/obtenerTrabajador', datos);
  public crea_edita_RegistroAsistencia$ = (datos: any): Observable<any> =>
    this.http.post(this.myAppUrl + this.myApiUrl + '/creaeditaRedistroAsistencia', datos);
//   public elimina_GruposTrab$ = (datos: any): Observable<any> =>
//     this.http.put(this.myAppUrl + this.myApiUrl + '/eliminaGruposTrabajo', datos);
}
