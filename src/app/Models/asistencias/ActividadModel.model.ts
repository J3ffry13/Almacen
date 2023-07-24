export class RegistroMarcacion {
    idRegAsistencia: number;
    idPersona: number;
    idTipo: number;
    login: string;
    accion: number;

    clean() {
        this.idRegAsistencia = 0;
        this.idPersona = 0;
        this.idTipo = 0;
        this.login = '';
        this.accion = 0;
    }
}