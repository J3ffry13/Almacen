import {Inject, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
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
import {Storage, ref, getDownloadURL, uploadBytes} from '@angular/fire/storage';
import {ConfirmActionComponent} from '@components/crud/confirm-action/confirm-action.component';
import {BehaviorSubject} from 'rxjs';
import {ThemePalette} from '@angular/material/core';
import {PerfilWebModel} from '@/Models/seguridad/PerfilWebModel.model';
import {PerfilWebService} from '@services/seguridad/perfilWeb.service';

export interface Task {
    name: string;
    completed: boolean;
    color: ThemePalette;
    subtasks?: Task[];
}

@Component({
    selector: 'app-perfil-web-registro',
    templateUrl: './perfil-web-registro.component.html',
    styleUrls: ['./perfil-web-registro.component.scss']
})
export class PerfilWebRegistroComponent implements OnInit, AfterViewInit {
    registro: PerfilWebModel = undefined;
    registroForm: FormGroup;
    user: CurrentUser;
    listadoCabecerasCbo: any[] = [];
    listadoChildrenCbo: any[] = [];
    listadoAll: any[] = [];
    loading = true;

    displayedColumns: string[] = [];
    dataSource: MatTableDataSource<any>;
    listadoResult: any[] = [];
    customColumns: any[] = [];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    validations = {
        descripcion: [
            {name: 'required', message: 'La Descripción es requerida'}
        ]
    };

    task: Task = {
        name: 'Indeterminate',
        completed: false,
        color: 'primary',
        subtasks: [
            {name: 'Primary', completed: false, color: 'primary'},
            {name: 'Accent', completed: false, color: 'accent'},
            {name: 'Warn', completed: false, color: 'warn'}
        ]
    };
    allComplete: boolean = false;

    constructor(
        private loginService: LoginService,
        private fb: FormBuilder,
        public dialog: MatDialog,
        private ref: ChangeDetectorRef,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private _snackBar: MatSnackBar,
        private perfilWebService: PerfilWebService
    ) {}

    ngOnInit() {
        this.loading = true;
        this.activatedRoute.paramMap
            .pipe(map(() => window.history.state))
            .subscribe((data) => {
                if (data.param) {
                    this.registro = data.param;
                } else {
                    this.router.navigate(['security/webprofiles']);
                }
            });
        // this.user = this.loginService.getTokenDecoded();
        this.createForm();
        this.loading = false;
    }

    ngAfterViewInit(): void {
        this.loading = true;
        this.perfilWebService
            .obtenerPerfiles$({idPerfil: this.registro.idPerfilWeb})
            .subscribe(
                (result) => {
                    this.listadoCabecerasCbo = result[0];
                    this.listadoChildrenCbo = result[1];
                    this.listadoCabecerasCbo.forEach((x) => {
                        this.listadoAll.push({
                            name: x.descripcion,
                            subtasks: this.listadoChildrenCbo.filter(
                                (y) => y.codigoPadre == x.codigo
                            )
                        });
                    });
                },
                (error) => {
                    console.log(error);
                }
            );
        this.loading = false;
    }

    createForm() {
        this.registroForm = this.fb.group({
            descripcion: new FormControl(this.registro.descripcion, [Validators.required])
        });
        this.loading = false;
    }

    applyFilterGlobal(filterValue: string) {
        filterValue = filterValue.trim();
        filterValue = filterValue.toLowerCase();
        this.dataSource.filter = filterValue;
    }

    getTitle() {
       return this.registro.idPerfilWeb == null || this.registro.idPerfilWeb == 0
          ? 'Nuevo Perfil'
          : 'Editar Perfil'
    }

    guardarRegistro() {
          let registroDatos: PerfilWebModel = new PerfilWebModel();
          registroDatos.clean();
          registroDatos = this.registroForm.getRawValue();
          registroDatos.idPerfilWeb = this.registro.idPerfilWeb;
          registroDatos.accion = this.registro.idPerfilWeb > 0 ? 2 : 1;
          registroDatos.login = this.user.email;
          let data = []
          this.listadoAll.forEach(x => {
              let sub = x.subtasks.filter((y) => y.completed == true)
              if(sub.length > 0){
                data.push(...sub)
              }
          });
          registroDatos.accesosWeb = JSON.stringify(data);
          console.log(registroDatos);
          this.perfilWebService
              .crea_edita_PerfilWeb$({
                  registroDatos
              })
              .subscribe((result) => {
                  let message = result[0];
                  this._snackBar.openFromComponent(SnackbarComponent, {
                      duration: 3 * 1000,
                      data: message['']
                  });
                  this.router.navigate(['/security/webprofiles']);
              });
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
