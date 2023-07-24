export class UsuarioModel {
    idUsuario: number;
    dni: string;
    nombre: string;
    usuario: string;
    password: string;
    idPerfilWeb: number;
    idPersona: number;
    accion: number;
    login: string;
    host: string;

    clean() {
        this.idUsuario = 0;
        this.dni = '';
        this.nombre = '',
        this.usuario = '',
        this.password = '',
        this.idPerfilWeb = 0;
        this.idPersona = 0
        this.accion = 0;
    }
}
