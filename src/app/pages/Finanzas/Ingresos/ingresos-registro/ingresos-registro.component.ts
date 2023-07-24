import {Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {OnInit} from '@angular/core';
import {LoginService} from '@services/auth/login.service';
import {CurrentUser} from '@/Models/auth/auth.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SnackbarComponent} from '@components/crud/snackbar/snackbar.component';
import moment from 'moment';
import { IngresosModel } from '@/Models/finanzas/IngresosModel.model';
import { IngresosService } from '@services/finanzas/ingresos.service';

@Component({
    selector: 'app-ingresos-registro',
    templateUrl: './ingresos-registro.component.html',
    styleUrls: ['./ingresos-registro.component.scss']
})
export class IngresosRegistroComponent implements OnInit {

    registro: IngresosModel = undefined;
    registroForm: FormGroup;
    user: CurrentUser;
    loading = true
    maxDate = new Date();

    validations = {
        descripcion: [ {name: 'required', message: 'Debe de ingresar la Descripción.'} ],
        monto: [ {name: 'required', message: 'Debe de ingresar el monto.'}, {name: 'min', message: 'El monto debe ser mayor a 0.'}, {name: 'pattern', message: 'El formato es incorrecto.'} ],
        fecha: [ {name: 'required', message: 'Debe de ingresar la Fecha.'} ],
    };

    constructor(
        public dialogRef: MatDialogRef<IngresosRegistroComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private loginService: LoginService,
        private ingresosService: IngresosService,
        private fb: FormBuilder,
        private _snackBar: MatSnackBar
    ) {}


    ngOnInit() {
        this.loading = true;
        this.registro = this.data.registro;
        // this.user = this.loginService.getTokenDecoded();
        this.createForm();
    }

    createForm() {
        this.registroForm = this.fb.group({
            descripcion: new FormControl(this.registro.descripcion + '', [Validators.required]),
            monto: new FormControl(
                this.registro.monto + '',
                [Validators.required, Validators.min(1), Validators.pattern(/^([1-9]\d*|0)(\.\d{1,2})?$|^0(\.0{1,2})?$/)]
            ),
            fecha: new FormControl(this.registro.fecha === ''
            ? moment()
            : moment(this.registro.fecha, 'DD/MM/YYYY'),
        Validators.required)
        });
        this.loading = false;
    }

    getTitle() {
        return this.registro.idIngresos == null || this.registro.idIngresos == 0
            ? 'Nuevo Ingreso'
            : 'Editar Ingreso: ' +
                  this.registro.descripcion;
    }

    guardarRegistro() {
        let registroDatos: IngresosModel = new IngresosModel();
        registroDatos.clean();
        registroDatos = this.registroForm.getRawValue();
        registroDatos.fecha = moment(this.registroForm.getRawValue().fecha).format('YYYY-MM-DD');
        registroDatos.idIngresos = this.registro.idIngresos;
        registroDatos.accion = this.registro.idIngresos > 0 ? 2 : 1;
        registroDatos.login = this.user.email
        this.ingresosService
            .crea_edita_Ingresos$({
                registroDatos
            })
            .subscribe((result) => {
                let message = result[0];
                this._snackBar.openFromComponent(SnackbarComponent, {
                    duration: 3 * 1000,
                    data: message['']
                });
                this.dialogRef.close({ result: true , close: false });
            });
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
