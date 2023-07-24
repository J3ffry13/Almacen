import {Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {OnInit} from '@angular/core';
import {LoginService} from '@services/auth/login.service';
import {CurrentUser} from '@/Models/auth/auth.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SnackbarComponent} from '@components/crud/snackbar/snackbar.component';
import {ProveedoresModel} from '@/Models/configuracion/ProveedoresModel.model';
import {ProveedoresService} from '@services/configuracion/proveedores.service';

@Component({
    selector: 'app-proveedores-registro',
    templateUrl: './proveedores-registro.component.html',
    styleUrls: ['./proveedores-registro.component.scss']
})
export class ProveedoresRegistroComponent implements OnInit {
    registro: ProveedoresModel = undefined;
    registroForm: FormGroup;
    user = new CurrentUser();
    accion: number;
    loading = true;

    validations = {
        ruc: [
            {name: 'required', message: 'El Ruc es requerido'},
            {name: 'min', message: 'Debe ingresar mínimo 11 dígitos'}
        ],
        nombre: [{name: 'required', message: 'El Nombre es requerido'}],
        correo: [{name: 'required', message: 'El Correo es requerido'}],
        direccion: [{name: 'required', message: 'La Dirección es requerida'}]
    };

    constructor(
        public dialogRef: MatDialogRef<ProveedoresRegistroComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public loginService: LoginService,
        public proveedoresService: ProveedoresService,
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
            ruc: [
                this.registro.ruc + '',
                [Validators.required, Validators.min(11)]
            ],
            nombre: [this.registro.nombre + '', Validators.required],
            correo: [this.registro.correo + '', Validators.required],
            direccion: [this.registro.direccion + '', Validators.required]
        });
        this.loading = false;
    }

    getTitle() {
        return this.accion == 1
            ? 'Nuevo Proveedor'
            : 'Editar Proveedor: ' +
                  this.registro.ruc +
                  ' - ' +
                  this.registro.nombre;
    }

    guardarRegistro() {
        let registroDatos: ProveedoresModel = new ProveedoresModel();
        registroDatos.clean();
        registroDatos = this.registroForm.getRawValue();
        registroDatos.status = true;
        if (this.accion == 1) {
            registroDatos.dt_cr = new Date();
            registroDatos.login_cr = this.user.email;
            registroDatos.dt_up = null;
            registroDatos.login_up = null;
            this.proveedoresService
            .crea_Proveedor(registroDatos)
            .then(() => {
                this._snackBar.openFromComponent(SnackbarComponent, {
                    duration: 3 * 1000,
                    data: 'Proveedor Registrado con Éxito'
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
            this.proveedoresService
            .editar_Proveedor(this.registro.idProveedor, registroDatos)
            .then(() => {
                this._snackBar.openFromComponent(SnackbarComponent, {
                    duration: 3 * 1000,
                    data: 'Proveedor Editado con Éxito'
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
