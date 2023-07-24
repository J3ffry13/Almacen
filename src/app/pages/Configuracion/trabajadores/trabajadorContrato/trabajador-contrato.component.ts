import {Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {LoginService} from '@services/auth/login.service';
import {CurrentUser} from '@/Models/auth/auth.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TrabajadorModel} from '@/Models/configuracion/TrabajadorModel.model';
import {Storage, ref, uploadBytes} from '@angular/fire/storage';
import moment from 'moment';

@Component({
    selector: 'app-trabajador-contrato',
    templateUrl: './trabajador-contrato.component.html',
    styleUrls: ['./trabajador-contrato.component.scss']
})
export class TrabajadorContratoComponent implements OnInit {
    registro: TrabajadorModel = undefined;
    register: TrabajadorModel;
    registroForm: FormGroup;
    user: CurrentUser;
    listTipoContcbo: any[] = [];
    formGroupFiltros: FormGroup;
    loading = true;
    file: any;
    porcentaje = 0;

    validations = {
        tipoID: [{name: 'min', message: 'El TIPO DE CONTRATO es requerido'}],
        f_inicio: [
            {name: 'required', message: 'La FECHA DE INICIO es requerida'}
        ],
        direccion: [{name: 'required', message: 'El DIRECCION es requerido'}]
    };

    constructor(
        public dialogRef: MatDialogRef<TrabajadorContratoComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private formBuilder: FormBuilder,
        private loginService: LoginService,
        private ref: ChangeDetectorRef,
        private fb: FormBuilder,
        private _snackBar: MatSnackBar,
        private storage: Storage
    ) {}

    ngOnInit() {
        this.formGroupFiltros = this.formBuilder.group({
            inputFileControl: ['', [Validators.required]]
        });
        this.loading = true;
        this.registro = this.data.registro;
        this.registro.urlDocumentoAnterior = this.registro.urlDocumento;
        this.listTipoContcbo = this.data.listTipoContcbo;
        // this.user = this.loginService.getTokenDecoded();
        this.createForm();
    }

    createForm() {
        this.registroForm = this.fb.group({
            tipoID: new FormControl(this.registro.tipoID + '', [
                Validators.min(1)
            ]),
            f_inicio: new FormControl(
                this.registro.f_inicio === ''
                    ? console.log()
                    : moment(this.registro.f_inicio, 'DD/MM/YYYY'),
                Validators.required
            ),
            f_fin: new FormControl(
                this.registro.f_fin === ''
                    ? console.log()
                    : moment(this.registro.f_fin, 'DD/MM/YYYY')
            )
        });
        this.loading = false;
    }

    getTitle() {
        return this.registro.idTrabajador == null ||
            this.registro.idTrabajador == 0
            ? 'Nuevo Contrato'
            : 'Editar Contrato: ';
    }

    uploadData(event: any) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            this.registro.urlDocumento = file.name;
            this.file = file;
            this.ref.detectChanges();
        };
    }

    guardarRegistro() {
        const registroDatos: TrabajadorModel = new TrabajadorModel();
        registroDatos.clean();
        registroDatos.f_inicio = moment(
            this.registroForm.getRawValue().f_inicio
        ).format('DD/MM/YYYY');
        if (
            this.registroForm.getRawValue().f_fin === '' ||
            this.registroForm.getRawValue().f_fin === null ||
            this.registroForm.getRawValue().f_fin === undefined
        ) {
            registroDatos.f_fin = null;
        } else {
            registroDatos.f_fin = moment(
                this.registroForm.getRawValue().f_fin
            ).format('DD/MM/YYYY');
        }
        registroDatos.urlDocumentoAnterior = this.registro.urlDocumentoAnterior;
        registroDatos.urlDocumento = this.registro.urlDocumento;
        registroDatos.file = this.file;
        registroDatos.estado = this.compareDateToCurrent(
            moment(this.registroForm.getRawValue().f_fin).format('DD/MM/YYYY')
        );
        registroDatos.tipoID = this.registroForm.getRawValue().tipoID;
        let val = this.listTipoContcbo.find(
            (x) => x.codigo == this.registroForm.getRawValue().tipoID
        );
        registroDatos.tipo = val != undefined ? val.descr : 'SIN CONTRATO';
        registroDatos.status = true;

        this.register = registroDatos;
        return this.register;
    }

    SubeArhivo() {
        if (
            this.register.urlDocumentoAnterior !== this.register.urlDocumento ||
            this.register.urlDocumento !== ''
        ) {
            const imgRef = ref(
                this.storage,
                `documentos/${this.register.urlDocumento}`
            );
            uploadBytes(imgRef, this.file)
                .then((response) => console.log(response))
                .catch((error) => console.log(error));
        }
    }

    compareDateToCurrent(fecha: string): number {
        if (fecha === '') {
            return 1;
        } else {
            const date = moment(fecha, 'DD/MM/YYYY');
            const now = moment(moment().format('DD/MM/YYYY'), 'DD/MM/YYYY');
            if (now > date) {
                return 2;
            } else {
                return 1;
            }
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
