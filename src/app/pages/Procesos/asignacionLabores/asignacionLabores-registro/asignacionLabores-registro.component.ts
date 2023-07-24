import {AfterViewInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {OnInit, ViewChild} from '@angular/core';
import {LoginService} from '@services/auth/login.service';
import {CurrentUser} from '@/Models/auth/auth.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SnackbarComponent} from '@components/crud/snackbar/snackbar.component';
import {AsignacionLaboresService} from '@services/procesos/asignacionLabores.service';
import {AsignacionLaboresModel} from '@/Models/procesos/AsignacionLaboresModel.model';
import {UtilsService} from '@services/utils/utils.service';
import moment from 'moment';
// import { Map, tileLayer } from 'leaflet';
import * as L from 'leaflet';

@Component({
    selector: 'app-asignacionlabores-registro',
    templateUrl: './asignacionLabores-registro.component.html',
    styleUrls: ['./asignacionLabores-registro.component.scss']
})
export class AsignacionLaboresRegistroComponent
    implements OnInit, AfterViewInit
{
    registro: AsignacionLaboresModel = undefined;
    registroForm: FormGroup;
    user: CurrentUser;
    loading = true;
    listActividadesCbo: any[] = [];
    listGrupoTrabCbo: any[] = [];
    map: any;
    mapDisabled: boolean = false;
    miUbicacion: any;

    validations = {
        idActividad: [{name: 'min', message: 'Debe seleccionar una Actividad'}],
        idGrupo: [{name: 'min', message: 'Debe seleccionar un Grupo de Trab.'}],
        descripcion: [
            {name: 'required', message: 'La Descripción es requerida'}
        ],
        direccion: [{name: 'required', message: 'La Direccion es requerida'}],
        fechaIni: [{name: 'required', message: 'La Fecha Inicio es requerida'}],
        fechaFin: [{name: 'required', message: 'La Fecha Fin es requerida'}],
        backgroundColor: [{name: 'required', message: 'El color es requerido'}]
    };

    constructor(
        public dialogRef: MatDialogRef<AsignacionLaboresRegistroComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private loginService: LoginService,
        private utilsService: UtilsService,
        private asigancionLabores: AsignacionLaboresService,
        private fb: FormBuilder,
        private _snackBar: MatSnackBar
    ) {}

    ngOnInit() {
        this.loading = true;
        this.registro = this.data.registro;
        // this.user = this.loginService.getTokenDecoded();
        this.createForm();
    }

    ngAfterViewInit(): void {
        this.loading = true;
        this.utilsService.listadoCombos$({opcion: 2}).subscribe(
            (result) => {
                this.listActividadesCbo = result[0];
                this.listGrupoTrabCbo = result[1];
                this.loading = false;
                setTimeout(() => {
                    this.cargarMapa();
                }, 0);
            },
            (error) => {
                console.log(error);
                this.loading = false;
            }
        );
    }

    createForm() {
        this.registroForm = this.fb.group({
            idActividad: new FormControl(
                this.registro.idActividad + '',
                Validators.min(1)
            ),
            idGrupo: new FormControl(
                this.registro.idGrupo + '',
                Validators.min(1)
            ),
            descripcion: new FormControl(
                this.registro.descripcion + '',
                Validators.required
            ),
            direccion: new FormControl(
                this.registro.direccion + '',
                Validators.required
            ),
            fechaIni: ['', Validators.required],
            fechaFin: ['', Validators.required],
            backgroundColor: new FormControl(
                this.registro.backgroundColor + '',
                Validators.required
            ),
            start: new FormControl('', Validators.required),
            end: new FormControl('', Validators.required),
            estado: [this.registro.estado]
        });
        if (this.registro.idAsignacion > 0) {
            let fechaI = new Date(this.registro.start);
            let fechaF = new Date(this.registro.end);
            this.registroForm.controls['fechaIni'].setValue(
                moment(fechaI, 'DD/MM/YYYY').add(1, 'days')
            );
            this.registroForm.controls['fechaFin'].setValue(
                moment(fechaF, 'DD/MM/YYYY').add(1, 'days')
            );
            this.registroForm.controls['start'].setValue(
                (fechaI.getHours() >= 10 ? '' : '0') +
                    fechaI.getHours() +
                    ':' +
                    (fechaI.getMinutes() >= 10 ? '' : '0') +
                    fechaI.getMinutes()
            );
            this.registroForm.controls['end'].setValue(
                (fechaF.getHours() >= 10 ? '' : '0') +
                    fechaF.getHours() +
                    ':' +
                    (fechaF.getMinutes() >= 10 ? '' : '0') +
                    fechaF.getMinutes()
            );
        } else {
            this.registroForm.controls['fechaIni'].setValue(moment());
            this.registroForm.controls['fechaFin'].setValue(moment());
            this.registroForm.controls['start'].setValue('00:00');
            this.registroForm.controls['end'].setValue('00:00');
        }        
    }

    getTitle() {
        return this.registro.idAsignacion == null ||
            this.registro.idAsignacion == 0
            ? 'Nueva Asignación de Labores'
            : 'Editar Asignación: ' + this.registro.title;
    }

    compareDateToCurrent(controls: any): boolean {
        const inicio =
            moment(controls['fechaIni'].value).format('DD/MM/YYYY') +
            ' ' +
            controls['start'].value;
        const fin =
            moment(controls['fechaFin'].value).format('DD/MM/YYYY') +
            ' ' +
            controls['end'].value;
        if (inicio > fin || inicio == fin) {
            return true;
        } else {
            return false;
        }
    }

    guardarRegistro() {
        const controls = this.registroForm.controls;
        if (this.compareDateToCurrent(controls)) {
            this._snackBar.openFromComponent(SnackbarComponent, {
                duration: 3 * 1000,
                data: 'El registro no pudo ser procesador, la hora fin debe ser mayor a la hora inicio.'
            });
            this.dialogRef.close();
        } else {
            let registroDatos: AsignacionLaboresModel =
                new AsignacionLaboresModel();
            registroDatos.clean();
            registroDatos.idAsignacion = this.registro.idAsignacion;
            registroDatos.idActividad = +controls['idActividad'].value;
            registroDatos.idGrupo = +controls['idGrupo'].value;
            registroDatos.descripcion = controls['descripcion'].value;
            registroDatos.direccion = controls['direccion'].value;
            registroDatos.inicio =
                moment(controls['fechaIni'].value).format('YYYY-MM-DD') +
                ' ' +
                controls['start'].value;
            registroDatos.final =
                moment(controls['fechaFin'].value).format('YYYY-MM-DD') +
                ' ' +
                controls['end'].value;
            registroDatos.backgroundColor = controls['backgroundColor'].value;
            registroDatos.latitud = this.miUbicacion._latlng.lat;
            registroDatos.longitud = this.miUbicacion._latlng.lng;
            registroDatos.accion = this.registro.idActividad > 0 ? 2 : 1;
            registroDatos.login = this.user.email;
            this.asigancionLabores
                .crea_edita_Asignaciones$({
                    registroDatos
                })
                .subscribe((result) => {
                    let message = result[0];
                    this._snackBar.openFromComponent(SnackbarComponent, {
                        duration: 3 * 1000,
                        data: message['']
                    });
                    this.dialogRef.close({result: true, close: false});
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

    cargarMapa() {
        if (this.map !== null && this.map !== undefined) {
            this.map.off();
            this.map.remove();
        }
        let latitud = -8.0939013;
        let longitud = -79.0329095;
        if (this.registro.latitud.length > 0 || this.registro.longitud.length > 0) {
            latitud = parseFloat(this.registro.latitud);
            longitud = parseFloat(this.registro.longitud);
          }

        this.map = L.map('map', {
            zoomControl: false
        }).setView([latitud, longitud], 13);

        const googleLayer = L.tileLayer(
            'http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
            {
                maxZoom: 20,
                subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
                attribution: '© E & R TELEPON'
            }
        );
        this.map.addLayer(googleLayer);
        const iconoBase = L.icon({  iconUrl: 'assets/img/ubicacion.png', iconSize: [35, 35] });
    
        this.miUbicacion = L.marker([latitud, longitud], {
          draggable: true,
          icon: iconoBase,
        }).addTo(this.map);
    }
}
