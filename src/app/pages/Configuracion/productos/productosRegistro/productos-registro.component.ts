import {Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {OnInit} from '@angular/core';
import {LoginService} from '@services/auth/login.service';
import {CurrentUser} from '@/Models/auth/auth.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SnackbarComponent} from '@components/crud/snackbar/snackbar.component';
import {ProductoModel} from '@/Models/configuracion/ProductoModel.model';
import {ProductosService} from '@services/configuracion/productos.service';

@Component({
    selector: 'app-productos-registro',
    templateUrl: './productos-registro.component.html',
    styleUrls: ['./productos-registro.component.scss']
})
export class ProductosRegistroComponent implements OnInit {
    registro: ProductoModel = undefined;
    registroForm: FormGroup;
    user = new CurrentUser();
    accion: number;
    loading = true;

    validations = {
        codigo: [
            {name: 'required', message: 'El Código es requerido'},
            {name: 'min', message: 'Debe ingresar mínimo 2 dígitos'}
        ],
        nombre: [{name: 'required', message: 'El Nombre es requerido'}],
        descripcion: [
            {name: 'required', message: 'El Descripcion es requerido'}
        ],
        stock: [
            {name: 'required', message: 'El Stock es requerido'},
            {name: 'min', message: 'Debe ingresar el Stock disponible'}
        ]
        // precio: [{name: 'required', message: 'El Precio es requerido'},
        // {name: 'min', message: 'Debe ingresar el Precio'}],
    };

    constructor(
        public dialogRef: MatDialogRef<ProductosRegistroComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public loginService: LoginService,
        public productosService: ProductosService,
        public fb: FormBuilder,
        public _snackBar: MatSnackBar
    ) {}

    async ngOnInit() {
        this.loading = true;
        this.registro = this.data.registro;
        this.accion = this.data.accion;
        this.user.email = await this.loginService.getUser();
        this.createForm();
    }

    createForm() {
        this.registroForm = this.fb.group({
            codigo: [
                this.registro.codigo + '',
                [Validators.required, Validators.min(2)]
            ],
            nombre: [this.registro.nombre + '', Validators.required],
            descripcion: [this.registro.descripcion + '', Validators.required],
            stock: [
                +this.registro.stock,
                [Validators.required, Validators.min(1)]
            ],
            precio: [+this.registro.precio]
        });
        this.loading = false;
    }

    getTitle() {
        return this.accion == 1
            ? 'Nuevo Producto'
            : 'Editar Producto: ' +
                  this.registro.codigo +
                  ' - ' +
                  this.registro.nombre;
    }

    guardarRegistro() {
        let registroDatos: ProductoModel = new ProductoModel();
        registroDatos.clean();
        registroDatos = this.registroForm.getRawValue();
        registroDatos.stock = this.registroForm.get('stock').value == null ? 0 : this.registroForm.get('stock').value
        registroDatos.status = true;
        if (this.accion == 1) {
            registroDatos.dt_cr = new Date();
            registroDatos.login_cr = this.user.email;
            registroDatos.dt_up = null;
            registroDatos.login_up = null;
            this.productosService
                .crea_Productos(registroDatos)
                .then(() => {
                    this._snackBar.openFromComponent(SnackbarComponent, {
                        duration: 3 * 1000,
                        data: 'Producto Registrado con Éxito'
                    });
                    this.dialogRef.close({result: true, close: false});
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            registroDatos.dt_cr = this.registro.dt_cr;
            registroDatos.login_cr = this.registro.login_cr;
            registroDatos.dt_up = new Date();
            registroDatos.login_up = this.user.email;
            this.productosService
                .editar_Productos(this.registro.idProducto, registroDatos)
                .then(() => {
                    this._snackBar.openFromComponent(SnackbarComponent, {
                        duration: 3 * 1000,
                        data: 'Producto Editado con Éxito'
                    });
                    this.dialogRef.close({result: true, close: false});
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    getError(controlName: string): string {
        let error = '';
        const control = this.registroForm.get(controlName);
        if (control.touched && control.errors !== null) {
            const json: string = JSON.stringify(control.errors);
            this.validations[controlName].forEach((e) => {
                if (json.includes(e.name)) {
                    error = e.message;
                }
            });
        }
        return error;
    }
}
