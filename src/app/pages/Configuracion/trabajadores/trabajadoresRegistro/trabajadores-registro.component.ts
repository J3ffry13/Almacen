import {Inject, ViewChild} from '@angular/core';
import {
    MatDialog
} from '@angular/material/dialog';
import {Component, ChangeDetectorRef} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {OnInit, AfterViewInit} from '@angular/core';
import moment from 'moment';
import {map} from 'rxjs/operators';
import {LoginService} from '@services/auth/login.service';
import {CurrentUser} from '@/Models/auth/auth.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SnackbarComponent} from '@components/crud/snackbar/snackbar.component';
import {ActivatedRoute, Router} from '@angular/router';
import {PersonaModel} from '@/Models/configuracion/PersonaModel.model';
import {MatTableDataSource} from '@angular/material/table';
import {TrabajadoresService} from '@services/configuracion/trabajadores.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {TrabajadorModel} from '@/Models/configuracion/TrabajadorModel.model';
import {TrabajadorContratoComponent} from '../trabajadorContrato/trabajador-contrato.component';
import {Storage, ref, getDownloadURL, uploadBytes} from '@angular/fire/storage';
import {ConfirmActionComponent} from '@components/crud/confirm-action/confirm-action.component';

@Component({
    selector: 'app-trabajadores-registro',
    templateUrl: './trabajadores-registro.component.html',
    styleUrls: ['./trabajadores-registro.component.scss']
})
export class TrabajadoresRegistroComponent implements OnInit, AfterViewInit {
    registro: PersonaModel = undefined;
    registroForm: FormGroup;
    user: CurrentUser;
    listTipoDoccbo: any[] = [];
    listTipoContcbo: any[] = [];
    loading = true;
    imageBase64 = 'assets/img/default_trabajador.png';
    imageBase64Init = '';
    file: any;

    displayedColumns: string[] = [];
    dataSource: MatTableDataSource<any>;
    listadoResult: any[] = [];
    customColumns: any[] = [];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    validations = {
        tipoDocu: [{name: 'min', message: 'El TIPO DE DOCUMENTO es requerido'}],
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
        private loginService: LoginService,
        private fb: FormBuilder,
        public dialog: MatDialog,
        private ref: ChangeDetectorRef,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private _snackBar: MatSnackBar,
        private trabajadorService: TrabajadoresService,
        private storage: Storage
    ) {}

    ngOnInit() {
        this.loading = true;
        this.activatedRoute.paramMap
            .pipe(map(() => window.history.state))
            .subscribe((data) => {
                if (data.param) {
                    this.registro = data.param;
                    if (this.registro.urlImagen !== '') {
                        this.registro.urlImagenAnterior =
                            this.registro.urlImagen;
                    }
                    this.imageBase64Init = this.imageBase64;
                    this.listTipoDoccbo = data.listTipoDoccbo;
                    this.listTipoContcbo = data.listTipoContcbo;
                } else {
                    this.loading = false;
                    this.router.navigate(['masters/workers']);
                }
            });
        // this.user = this.loginService.getTokenDecoded();
        this.renderColumns();
        this.createForm();
    }

    ngAfterViewInit(): void {
        if (this.registro.idPersona > 0) {
            this.loading = true;
            this.trabajadorService
                .obtenerContratosTrabajadores$({dni: this.registro.idPersona})
                .subscribe(
                    (result) => {
                        this.listadoResult = result;
                        this.listadoResult.forEach((x) => {
                            if (x.urlDocumento != '') {
                                this.getImagenes(x);
                            }
                        });
                        this.refreshLista();
                        this.loading = false;
                        if (this.registro.idPersona > 0) {
                            if (this.registro.urlImagen !== '') {
                                this.getImagenenPersona(
                                    this.registro.urlImagen
                                );
                            }
                        }
                    },
                    (error) => {
                        this.loading = false;
                        console.log(error);
                    }
                );
        } else {
            this.loading = false;
        }
    }

    refreshLista() {
        this.listadoResult = this.listadoResult.filter((x) => x.status == true);
        this.dataSource = new MatTableDataSource(this.listadoResult);
        this.loading = false;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.ref.markForCheck();
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

    getImagenes(registro: TrabajadorModel) {
        let x = getDownloadURL(
            ref(this.storage, `documentos/${registro.urlDocumento}`)
        )
            .then((url) => {
                const xhr = new XMLHttpRequest();
                xhr.responseType = 'blob';
                xhr.onload = (event) => {
                    const blob = xhr.response;
                };
                xhr.open('GET', url);
                xhr.send();
                registro.urlFire = url;
            })
            .catch((error) => {
                console.log(error);
            });    
        this.refreshLista();
    }

    createForm() {
        this.registroForm = this.fb.group({
            tipoDocu: new FormControl(-1 + '', [Validators.min(1)]),
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
        this.registro.idPersona == 0
            ? this.registroForm.controls['tipoDocu'].setValue(-1 + '')
            : this.registroForm.controls['tipoDocu'].setValue(
                  this.registro.tipoDocu + ''
              );
    }

    applyFilterGlobal(filterValue: string) {
        filterValue = filterValue.trim();
        filterValue = filterValue.toLowerCase();
        this.dataSource.filter = filterValue;
    }

    getTitle() {
        return this.registro.idPersona == null || this.registro.idPersona == 0
            ? 'Nuevo Trabajador'
            : 'Editar Trabajador: ' +
                  this.registro.apellidos +
                  ' ' +
                  this.registro.nombres;
    }

    renderColumns() {
        this.customColumns = [
            {
                name: 'tipo',
                label: 'TIPO',
                esFlag: false,
                width: 'mat-column'
            },
            {
                name: 'f_inicio',
                label: 'F. INICIO',
                esFlag: false,
                width: 'mat-column mat-column-120 center-cell'
            },
            {
                name: 'f_fin',
                label: 'F. FIN',
                esFlag: false,
                width: 'mat-column mat-column-120 center-cell'
            },
            {
                name: 'urlDocumento',
                label: 'DOCUMENTO',
                esFlag: false,
                width: 'mat-column mat-column-120 center-cell'
            },
            {
                name: 'estado',
                label: 'ESTADO',
                esFlag: true,
                width: 'mat-column mat-column-100 center-cell'
            },
            {
                name: 'actions',
                label: '...',
                esFlag: false,
                width: 'mat-column mat-column-120 center-cell'
            }
        ];
        this.displayedColumns = this.customColumns.map(
            (column: any) => column.name
        );
    }

    getItemByHtml(nume: number) {
        if (nume == 1) return 'ACTIVO';
        else if (nume == 2) return 'CESADO';
        else return 'SIN CONTRATO';
    }

    getItemByScss(nume: number) {
        if (nume == 1) return 'background-color: green';
        else if (nume == 2) return 'background-color: red';
        else return 'background-color: yellow';
    }

    nuevo() {
        const registro = new TrabajadorModel();
        registro.clean();
        registro.isEdit = false;
        this.openDialog(registro);
    }

    edit(registro: TrabajadorModel) {
        registro.isEdit = true;
        this.openDialog(registro);
    }

    openDialog(registro: TrabajadorModel) {
        const dialogRef = this.dialog.open(TrabajadorContratoComponent, {
            data: {registro, listTipoContcbo: this.listTipoContcbo}
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result !== undefined) {
                if (result.urlDocumento !== '') {
                    result.urlFire = this.getImagenes(result);
                }
                if ((result.isEdit == true)) {
                    let index: number = this.listadoResult.findIndex(
                        (x) => (x.idTrabajador = result.idTrabajador)
                    );
                    this.listadoResult[index] = result;
                } else {
                    this.listadoResult.push(result);
                }

                this.refreshLista();
            }
        });
    }

    delete(registro: any) {
        const dialogRef = this.dialog.open(ConfirmActionComponent, {
            data: {
                type: 'Eliminar Registro',
                question: '¿Seguro de eliminar el registro?'
            }
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result == 'ok' && result != undefined) {
                registro.status = false;
                this.refreshLista();
            }
        });
    }

    guardarRegistro() {
        let registroDatos: PersonaModel = new PersonaModel();
        console.log(this.listadoResult);
        registroDatos.clean();
        registroDatos = this.registroForm.getRawValue();
        registroDatos.nombres = registroDatos.nombres.toUpperCase()
        registroDatos.apellidos = registroDatos.apellidos.toUpperCase()
        registroDatos.f_nacimiento = moment(this.registroForm.getRawValue().f_nacimiento).format('YYYY-MM-DD');
        registroDatos.idPersona = this.registro.idPersona;
        registroDatos.accion = this.registro.idPersona > 0 ? 2 : 1;
        registroDatos.login = this.user.email;
        registroDatos.urlImagen = this.registro.urlImagen
        this.listadoResult.forEach(x => {
            if (x.f_inicio !== null){
                let fechaI = moment(x.f_inicio, 'DD/MM/YYYY');
                x.f_inicio = fechaI.format('YYYY-MM-DD');
            }
            if (x.f_fin !== null && x.f_fin !== ''){
                let fecha = moment(x.f_fin, 'DD/MM/YYYY');
                x.f_fin = fecha.format('YYYY-MM-DD');
            }else {
                x.f_fin = null
            }
        });
        registroDatos.trabajadores = JSON.stringify(this.listadoResult);
        if (
            this.imageBase64 != this.imageBase64Init &&
            this.registro.urlImagen != this.registro.urlImagenAnterior
        ) {
            this.SubeArhivo();
        }
        this.trabajadorService
            .crea_edita_Trabajadores$({
                registroDatos
            })
            .subscribe((result) => {
                let message = result[0];
                this._snackBar.openFromComponent(SnackbarComponent, {
                    duration: 3 * 1000,
                    data: message['']
                });
                this.router.navigate(['/masters/workers']);
            });
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
