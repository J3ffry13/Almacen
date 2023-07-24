export class IngresosModel {
    idIngresos: number;
    descripcion: string;
    monto: number;
    fecha: string;
    login: string;
    accion: number;

    clean() {
        this.idIngresos = 0;
        this.descripcion = '';
        this.monto = 0.00;
        this.fecha = '';
        this.login = '';
        this.accion = 0;
    }
}