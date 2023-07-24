import {Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {OnInit} from '@angular/core';
import {LoginService} from '@services/auth/login.service';
import {CurrentUser} from '@/Models/auth/auth.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SnackbarComponent} from '@components/crud/snackbar/snackbar.component';
import { EgresosModel } from '@/Models/finanzas/EgresosModel.model';
import moment from 'moment';
import { EgresosService } from '@services/finanzas/egresos.service';

@Component({
    selector: 'app-egresos-registro',
    templateUrl: './egresos-registro.component.html',
    styleUrls: ['./egresos-registro.component.scss']
})
export class EgresosRegistroComponent implements OnInit {

    registro: EgresosModel = undefined;
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
        public dialogRef: MatDialogRef<EgresosRegistroComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private loginService: LoginService,
        public egresosService: EgresosService,
        public fb: FormBuilder,
        public _snackBar: MatSnackBar
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
        return this.registro.idEgresos == null || this.registro.idEgresos == 0
            ? 'Nuevo Egreso'
            : 'Editar Egreso: ' +
                  this.registro.descripcion;
    }

    guardarRegistro() {
        let registroDatos: EgresosModel = new EgresosModel();
        registroDatos.clean();
        registroDatos = this.registroForm.getRawValue();
        registroDatos.fecha = moment(this.registroForm.getRawValue().fecha).format('YYYY-MM-DD');
        registroDatos.idEgresos = this.registro.idEgresos;
        registroDatos.accion = this.registro.idEgresos > 0 ? 2 : 1;
        registroDatos.login = this.user.email
        this.egresosService
            .crea_edita_Egresos$({
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
