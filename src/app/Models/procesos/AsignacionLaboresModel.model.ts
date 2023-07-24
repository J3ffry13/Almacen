export class AsignacionLaboresModel {
    idAsignacion: number;
    idActividad: number;
    idGrupo: number;
    title: string;
    descripcion: string;
    direccion: string;
    start: Date;
    end: Date;
    backgroundColor: string;
    inicio: string;
    final: string;
    fecha: string;
    estado: boolean;
    latitud: string;
    longitud: string;
    login: string;
    accion: number;

    clean() {
        this.idAsignacion = 0;
        this.idActividad = 0;
        this.idGrupo = 0;
        this.title = '';
        this.descripcion = '';
        this.direccion = '';
        this.fecha = '';
        this.start = new Date;
        this.end = new Date;
        this.inicio = '';
        this.final = '';
        this.backgroundColor = '';
        this.estado = false;
        this.latitud = '';
        this.longitud = '';
        this.login = '';
        this.accion = 0;
    }
}