export class TrabajadorModel {
    idTrabajador: number;
    idPersona: number;
    tipoID: number;
    tipo: string;
    f_inicio: string;
    f_fin: string;
    urlFire: string;
    urlDocumento: string;
    urlDocumentoAnterior: string;
    file: any;
    accion: number;
    estado: number;
    status: boolean;
    login: string;
    host: string;
    isEdit: boolean;

    clean() {
        this.idTrabajador = 0;
        this.idPersona = 0;
        this.tipoID = 0;
        this.tipo = '';
        this.f_inicio = '';
        this.f_fin = '';
        this.urlFire = '';
        this.urlDocumento = '';
        this.urlDocumentoAnterior = '';
        this.estado = 0;
        this.status = true;
        this.accion = 0;
        this.isEdit = false;
    }
}
