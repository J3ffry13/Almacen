import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from 'environments/environment';

import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ReportesService {
    myAppUrl: string;
    myApiUrl: string;

    constructor(private http: HttpClient) {
        this.myAppUrl = environment.endpoint;
        this.myApiUrl = '/api/reportes';
    }

    public listadoDasboard$ = (datos: any): Observable<any> =>
        this.http.get(
            this.myAppUrl + this.myApiUrl + '/listadoDashboard',
            datos
        );
    public listadoReporteIngresosVSEgresos$ = (datos: any): Observable<any> =>
        this.http.post(
            this.myAppUrl + this.myApiUrl + '/listadoReporteIngresosVSEgresos',
            datos
        );
    public listadoReporteAsistencias$ = (datos: any): Observable<any> =>
        this.http.post(
            this.myAppUrl + this.myApiUrl + '/listadoReporteAsistencias',
            datos
        );
    public listadoReporteHorasSemanales$ = (datos: any): Observable<any> =>
        this.http.post(
            this.myAppUrl + this.myApiUrl + '/listadoReporteHorasSemanales',
            datos
        );
    public listadoReporteActividadesxTrabajador$ = (
        datos: any
    ): Observable<any> =>
        this.http.post(
            this.myAppUrl +
                this.myApiUrl +
                '/listadoReporteActividadesxTrabajador',
            datos
        );
}
