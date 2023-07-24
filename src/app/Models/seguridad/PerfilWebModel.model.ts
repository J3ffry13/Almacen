export class PerfilWebModel {
    idPerfilWeb: number;
    descripcion: string;
    accesosWeb: string;
    accion: number;
    status: boolean;
    login: string;
    host: string;

    clean() {
        this.idPerfilWeb = 0;
        this.descripcion = '';
        this.accesosWeb = '';
        this.status = true;
        this.accion = 0;
    }
}
