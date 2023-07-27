export class ProveedoresModel {
    idProveedor: string;
    ruc: string;
    nombre: string;
    correo: string;
    direccion: string
    status: boolean;
    dt_cr: Date;
    login_cr: string;
    dt_up: Date;
    login_up: string;

    clean() {
        this.idProveedor = '';
        this.ruc = '';
        this.nombre = '';
        this.correo = '';
        this.direccion = '';
        this.status = true;
        this.login_cr = '';
        this.login_up = '';
    }
}