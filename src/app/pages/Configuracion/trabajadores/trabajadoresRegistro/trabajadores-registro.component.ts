import {Inject, ViewChild} from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef
} from '@angular/material/dialog';
import {Component, ChangeDetectorRef} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {OnInit, AfterViewInit} from '@angular/core';
import moment from 'moment';
import {LoginService} from '@services/auth/login.service';
import {CurrentUser} from '@/Models/auth/auth.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SnackbarComponent} from '@components/crud/snackbar/snackbar.component';
import {ActivatedRoute, Router} from '@angular/router';
import {TrabajadorModel} from '@/Models/configuracion/TrabajadorModel.model';
import {Storage, ref, getDownloadURL, uploadBytes} from '@angular/fire/storage';
import {ConfirmActionComponent} from '@components/crud/confirm-action/confirm-action.component';
import {TrabajadorService} from '@services/configuracion/trabajadores.service';
import {UtilsService} from '@services/utils/utils.service';
import { combineLatest } from 'rxjs';

@Component({
    selector: 'app-trabajadores-registro',
    templateUrl: './trabajadores-registro.component.html',
    styleUrls: ['./trabajadores-registro.component.scss']
})
export class TrabajadoresRegistroComponent implements OnInit, AfterViewInit {
    registro: TrabajadorModel = undefined;
    registroForm: FormGroup;
    user = new CurrentUser();
    listTipoDoccbo: any[] = [];
    listTipoContcbo: any[] = [];
    loading = true;
    imageBase64 = 'assets/img/default_trabajador.png';
    imageBase64Init = '';
    file: any;
    accion: number;

    validations = {
        tipoDocu: [{name: 'min', message: 'El TIPO DE DOCUMENTO es requerido'}],
        tipoCon: [{name: 'min', message: 'El TIPO DE CONTRATO es requerido'}],
        dni: [
            {name: 'required', message: 'El DOCUMENTO es requerido'},
            {name: 'min', message: 'Debe ingresar 8 dígitos como mínimo'}
        ],
        nombres: [{name: 'required', message: 'El NOMBRE es requerido'}],
        apellidos: [{name: 'required', message: 'El APELLIDO es requerido'}],
        f_nacimiento: [
            {name: 'required', message: 'La FECHA DE NACIMIENTO es requerida'}
        ]
    };

    constructor(
        public dialogRef: MatDialogRef<TrabajadoresRegistroComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private loginService: LoginService,
        private fb: FormBuilder,
        private ref: ChangeDetectorRef,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private utilsService: UtilsService,
        private _snackBar: MatSnackBar,
        private trabajadorService: TrabajadorService,
        private storage: Storage
    ) {}

    async ngOnInit() {
        this.loading = true;
        this.registro = this.data.registro
        this.registro.urlImagenAnterior = this.registro.urlImagen
        this.accion = this.data.accion;
        this.user.email = await this.loginService.getUser();
        this.imageBase64Init = this.imageBase64;
        this.createForm()
        
    }

    ngAfterViewInit() {
        combineLatest([
            this.utilsService.listarCombos$('T. Documento'),
            this.utilsService.listarCombos$('T. Trab')
          ]).subscribe(([listTipoDoccbo, listTipoContcbo]) => {
            this.loading = false;
            this.listTipoDoccbo = listTipoDoccbo || [];
            this.listTipoContcbo = listTipoContcbo || [];
          });
        this.verificarImagen()
    }

    verificarImagen() {
        if(this.accion == 2) {
            if(this.registro.urlImagen !== null || this.registro.urlImagen !== undefined) {
                this.getImagenenPersona(this.registro.urlImagen);
            }
        }
    }

    getImagenenPersona(registro: string) {
        this.loading = true;
        let x = getDownloadURL(ref(this.storage, `imagenes/${registro}`))
            .then((url) => {
                const xhr = new XMLHttpRequest();
                xhr.responseType = 'blob';
                xhr.onload = (event) => {
                    const blob = xhr.response;
                };
                xhr.open('GET', url);
                xhr.send();
                this.imageBase64 = url;
                this.loading = false;
            })
            .catch((error) => {
                console.log(error);
                this.loading = false;
            });
    }

    createForm() {
        this.registroForm = this.fb.group({
            tipoDocu: new FormControl(+this.registro.tipoDocu + '', [Validators.min(1)]),
            tipoCon: new FormControl(+this.registro.tipoCon + '', [Validators.min(1)]),
            dni: new FormControl(this.registro.dni + '', [
                Validators.required,
                Validators.minLength(8)
            ]),
            nombres: new FormControl(
                this.registro.nombres + '',
                Validators.required
            ),
            apellidos: new FormControl(
                this.registro.apellidos + '',
                Validators.required
            ),
            f_nacimiento: [
                this.registro.f_nacimiento === ''
                    ? console.log()
                    : moment(this.registro.f_nacimiento, 'DD/MM/YYYY'),
                Validators.required
            ]
        });
        this.loading = false;
    }

    getTitle() {
        return this.accion == 1
            ? 'Nuevo Trabajador'
            : 'Editar Trabajador: ' +
                  this.registro.apellidos +
                  ' ' +
                  this.registro.nombres;
    }

    guardarRegistro() {
        let registroDatos: TrabajadorModel = new TrabajadorModel();
        registroDatos.clean();
        registroDatos = this.registroForm.getRawValue();
        registroDatos.nombres = registroDatos.nombres.toUpperCase()
        registroDatos.apellidos = registroDatos.apellidos.toUpperCase()
        registroDatos.f_nacimiento = moment(this.registroForm.getRawValue().f_nacimiento).format('YYYY-MM-DD');
        registroDatos.status = true;
        let foto = new Date().toISOString() + '-' + registroDatos.dni.toString();

        if (this.accion == 1) {
            registroDatos.dt_cr = new Date();
            registroDatos.login_cr = this.user.email;
            registroDatos.dt_up = null;
            registroDatos.login_up = null;
            this.trabajadorService
            .crea_Trabajador(registroDatos)
            .then(() => {
                this._snackBar.openFromComponent(SnackbarComponent, {
                    duration: 3 * 1000,
                    data: 'Trabajador Registrado con Éxito'
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
            this.trabajadorService
            .editar_Trabajador(this.registro.idTrabajador, registroDatos)
            .then(() => {
                this._snackBar.openFromComponent(SnackbarComponent, {
                    duration: 3 * 1000,
                    data: 'Trabajador Editado con Éxito'
                });
                this.dialogRef.close({result: true, close: false});
            })
            .catch((error) => {
                console.log(error);
            });
        }
        // registroDatos.login = this.user.email;
        // registroDatos.urlImagen = this.registro.urlImagen
        // this.listadoResult.forEach(x => {
        //     if (x.f_inicio !== null){
        //         let fechaI = moment(x.f_inicio, 'DD/MM/YYYY');
        //         x.f_inicio = fechaI.format('YYYY-MM-DD');
        //     }
        //     if (x.f_fin !== null && x.f_fin !== ''){
        //         let fecha = moment(x.f_fin, 'DD/MM/YYYY');
        //         x.f_fin = fecha.format('YYYY-MM-DD');
        //     }else {
        //         x.f_fin = null
        //     }
        // });
        // registroDatos.trabajadores = JSON.stringify(this.listadoResult);
        // if (
        //     this.imageBase64 != this.imageBase64Init &&
        //     this.registro.urlImagen != this.registro.urlImagenAnterior
        // ) {
        //     this.SubeArhivo();
        // }
        // this.trabajadorService
        //     .crea_edita_Trabajadores$({
        //         registroDatos
        //     })
        //     .subscribe((result) => {
        //         let message = result[0];
        //         this._snackBar.openFromComponent(SnackbarComponent, {
        //             duration: 3 * 1000,
        //             data: message['']
        //         });
        //         this.router.navigate(['/masters/workers']);
        //     });
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    SubeArhivo() {
        const imgRef = ref(this.storage, `imagenes/${this.registro.urlImagen}`);
        uploadBytes(imgRef, this.file)
            .then((response) => console.log())
            .catch((error) => console.log(error));
    }

    fileChangeEvent(event: any) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            this.imageBase64 = reader.result.toString();
            this.registro.urlImagen = file.name;
            this.file = file;
            this.ref.detectChanges();
        };
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
