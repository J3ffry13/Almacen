import {AfterViewInit, Inject} from '@angular/core';
import {
    MatDialogRef,
    MAT_DIALOG_DATA,
    MatDialog
} from '@angular/material/dialog';
import {Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {OnInit} from '@angular/core';
import {LoginService} from '@services/auth/login.service';
import {CurrentUser} from '@/Models/auth/auth.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import {UtilsService} from '@services/utils/utils.service';
import {UsuarioModel} from '@/Models/seguridad/UsuarioModel.model';
import {Observable, map, startWith} from 'rxjs';
import {ConfirmActionComponent} from '@components/crud/confirm-action/confirm-action.component';
import {UsuarioService} from '@services/seguridad/usuario.service';
import {SnackbarComponent} from '@components/crud/snackbar/snackbar.component';
@Component({
    selector: 'app-usuarios-registro',
    templateUrl: './usuarios-registro.component.html',
    styleUrls: ['./usuarios-registro.component.scss']
})
export class UsuariosRegistroComponent implements OnInit, AfterViewInit {
    registro: UsuarioModel = undefined;
    registroForm: FormGroup;
    user: CurrentUser;
    loading = true;
    listPerfilesWebCbo: any[] = [];
    listPersonasCbo: any[] = [];
    FilteredlistUsuarios: Observable<any[]>;
    personaCompleto = false;

    validations = {
        dni: [{name: 'required', message: 'El DNI es requerido'}],
        idPerfilWeb: [{name: 'min', message: 'Debe seleccionar un Perfil Web.'}]
    };

    constructor(
        public dialogRef: MatDialogRef<UsuariosRegistroComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        public loginService: LoginService,
        public utilsService: UtilsService,
        public usuarioService: UsuarioService,
        public fb: FormBuilder,
        public _snackBar: MatSnackBar
    ) {}

    ngOnInit() {
        this.registro = this.data.registro;
        this.loading = true;
        this.registro = this.data.registro;
        // // this.user = this.loginService.getTokenDecoded();
        this.createForm();
    }

    ngAfterViewInit(): void {
        this.loading = true;
        this.utilsService.listadoCombos$({opcion: 3}).subscribe(
            (result) => {
                this.listPerfilesWebCbo = result[0];
                this.listPersonasCbo = result[1];
                this.registroForm.controls['dni'].setValue(this.registro.dni);
            },
            (error) => {
                console.log(error);
            }
        );
        this.loading = false;
    }

    createForm() {
        this.registroForm = this.fb.group({
            dni: new FormControl(this.registro.dni + '', Validators.required),
            idPersona: new FormControl(this.registro.idPersona),
            nombre: new FormControl(this.registro.nombre + ''),
            usuario: new FormControl(this.registro.usuario + ''),
            password: new FormControl(''),
            idPerfilWeb: new FormControl(
                this.registro.idPerfilWeb + '',
                Validators.min(1)
            )
        });
        this.loading = false;

        this.FilteredlistUsuarios = this.registroForm.controls[
            'dni'
        ].valueChanges.pipe(
            startWith(''),
            map((val) => this.filteredPersona(val.toString()))
        );
    }

    filteredPersona(val: string): any[] {
        if (!this.personaCompleto) {
            const personaSelected = this.listPersonasCbo.filter(
                (f) => f.dni === val
            );
            if (personaSelected.length === 1) {
                this.registroForm.controls['idPersona'].setValue(
                    personaSelected[0].codigo
                );
                this.registroForm.controls['nombre'].setValue(
                    personaSelected[0].descripcion
                );
                this.registroForm.controls['usuario'].setValue(
                    personaSelected[0].usuario
                );
                this.registroForm.get('dni').markAsUntouched();
                this.registroForm.get('dni').setErrors(null);
            } else {
                this.registroForm.get('dni').markAsTouched();
                this.registroForm.get('dni').setErrors({required: true});
                this.registroForm.controls['idPersona'].setValue(-1);
                this.registroForm.controls['nombre'].setValue('');
                this.registroForm.controls['usuario'].setValue('');
            }
            return this.listPersonasCbo.filter((option) =>
                option.dni.toLowerCase().includes(val.toLowerCase())
            );
        } else {
            this.personaCompleto = false;
        }
    }

    getPersona(e: any) {
        const contratistaSelected = this.listPersonasCbo.filter(
            (f) => f.dni === e.source.value
        );
        if (contratistaSelected.length > 0) {
            this.personaCompleto = true;
            this.registroForm.controls['idPersona'].setValue(
                contratistaSelected[0].codigo
            );
            this.registroForm.controls['nombre'].setValue(
                contratistaSelected[0].descripcion
            );
            this.registroForm.controls['usuario'].setValue(
                contratistaSelected[0].usuario
            );
        }
    }

    _filter(x: any): any[] {
        const filterValue = x.toLowerCase();
        return this.listPersonasCbo.filter((y) =>
            y.dni.toLowerCase().includes(filterValue)
        );
    }

    getTitle() {
        return this.registro.idUsuario == null || this.registro.idUsuario == 0
            ? 'Nuevo Usuario'
            : 'Editar Usuario: ' + this.registro.usuario;
    }

    guardarRegistro() {
        const controls = this.registroForm.controls;
        let registroDatos: UsuarioModel = new UsuarioModel();
        registroDatos.clean();
        registroDatos.idUsuario = this.registro.idUsuario;
        registroDatos.dni = controls['dni'].value;
        registroDatos.usuario = controls['usuario'].value;
        registroDatos.idPerfilWeb = +controls['idPerfilWeb'].value;
        registroDatos.idPersona = +controls['idPersona'].value;
        registroDatos.password = controls['password'].value;
        registroDatos.accion = this.registro.idUsuario > 0 ? 2 : 1;
        if (registroDatos.idUsuario > 0 && registroDatos.password != '') {
            const dialogRef = this.dialog.open(ConfirmActionComponent, {
                data: {
                    type: 'Cambiar Contraseña',
                    question: '¿Seguro de editar la CONTRASEÑA?'
                }
            });
            dialogRef.afterClosed().subscribe((result) => {
                if (result != 'ok' && result == undefined) {
                    return;
                } else {
                    this.usuarioService
                        .crea_edita_Usuario$({
                            registroDatos
                        })
                        .subscribe((result) => {
                            let message = result[0];
                            this._snackBar.openFromComponent(
                                SnackbarComponent,
                                {
                                    duration: 3 * 1000,
                                    data: message['']
                                }
                            );
                            this.dialogRef.close({result: true, close: false});
                        });
                }
            });
        } else {
            this.usuarioService
                .crea_edita_Usuario$({
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
}
