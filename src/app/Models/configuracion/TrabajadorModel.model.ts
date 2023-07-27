export class TrabajadorModel {
    idTrabajador: string;
    tipoDocu: number;
    tipoCon: number;
    dni: string;
    nombres: string;
    apellidos: string;
    f_nacimiento: string;
    urlImagen: string;
    urlImagenAnterior: string;
    status: boolean;
    dt_cr: Date;
    login_cr: string;
    dt_up: Date;
    login_up: string;

    clean() {
        this.idTrabajador = '';
        this.tipoDocu = -1;
        this.tipoCon = -1;
        this.dni = '';
        this.nombres = '';
        this.urlImagenAnterior = '';
        this.apellidos = '';
        this.f_nacimiento = '';
        this.urlImagen = null;
    }
}
