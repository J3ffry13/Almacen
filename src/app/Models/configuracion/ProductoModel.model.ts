export class ProductoModel {
    idProducto: string;
    codigo: string;
    nombre: string;
    descripcion: string;
    stock: number;
    precio: number;
    status: boolean;
    dt_cr: Date;
    login_cr: string;
    dt_up: Date;
    login_up: string;

    clean() {
        this.idProducto = '';
        this.codigo = '';
        this.nombre = '';
        this.descripcion = '';
        this.stock = 0;
        this.precio = 0;
        this.status = true;
        this.login_cr = '';
        this.login_up = '';
    }
}