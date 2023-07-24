import {Component, ViewChild, ChangeDetectorRef, OnInit} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatDialog} from '@angular/material/dialog';
import {CurrentUser} from '@/Models/auth/auth.model';
import {LoginService} from '@services/auth/login.service';
import {ConfirmActionComponent} from '@components/crud/confirm-action/confirm-action.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SnackbarComponent} from '@components/crud/snackbar/snackbar.component';
import {Router} from '@angular/router';
import {UsuarioService} from '@services/seguridad/usuario.service';
import {UsuarioModel} from '@/Models/seguridad/UsuarioModel.model';
import {UsuariosRegistroComponent} from '../usuarios-registro/usuarios-registro.component';

@Component({
    selector: 'app-usuarios-listado',
    templateUrl: './usuarios-listado.component.html',
    styleUrls: ['./usuarios-listado.component.scss']
})
export class UsuariosListadoComponent implements OnInit {
    displayedColumns: string[] = [];
    dataSource: MatTableDataSource<any>;
    listadoResult: any[] = [];
    customColumns: any[] = [];
    loading = false;
    loadingData = false;
    user: CurrentUser;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(
        private ref: ChangeDetectorRef,
        private usuarioService: UsuarioService,
        private loginService: LoginService,
        public dialog: MatDialog,
        private _snackBar: MatSnackBar,
        private router: Router
    ) {}

    ngOnInit() {
        this.loading = true;
        // // this.user = this.loginService.getTokenDecoded();
        this.renderColumns();
        this.cargarListaDatos();
    }

    refreshLista() {
        this.dataSource = new MatTableDataSource(this.listadoResult);
        this.loadingData = false;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.ref.markForCheck();
    }

    cargarListaDatos() {
        this.loadingData = true;
        this.usuarioService.listadoUsuarios$({}).subscribe((result) => {
            this.listadoResult = result;
            this.refreshLista();
            this.loading = false;
            this.loadingData = false;
        });
        this.loadingData = false;
    }

    nuevo() {
        const registro = new UsuarioModel();
        registro.clean();
        this.openDialog(registro);
    }

    edit(registro: UsuarioModel) {
        this.openDialog(registro);
    }

    openDialog(registro: UsuarioModel) {
        const dialogRef = this.dialog.open(UsuariosRegistroComponent, {
            data: {registro}
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.cargarListaDatos();
            }
        });
    }

    delete(registro: any) {
        let registroDatos: UsuarioModel = new UsuarioModel();
        registroDatos.clean();
        registroDatos.idUsuario = registro.idUsuario;
        registroDatos.accion = 3;
        registroDatos.login = this.user.email;

        const dialogRef = this.dialog.open(ConfirmActionComponent, {
            data: {
                type: 'Eliminar Registro',
                question: '¿Seguro de eliminar el registro?'
            }
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result == 'ok' && result != undefined) {
                this.usuarioService
                    .elimina_Usuario$({
                        registroDatos
                    })
                    .subscribe((result) => {
                        this.cargarListaDatos();
                        let message = result[0];
                        this._snackBar.openFromComponent(SnackbarComponent, {
                            duration: 3 * 1000,
                            data: message['']
                        });
                    });
            }
        });
    }

    applyFilterGlobal(filterValue: string) {
        filterValue = filterValue.trim();
        filterValue = filterValue.toLowerCase();
        this.dataSource.filter = filterValue;
    }

    renderColumns() {
        this.customColumns = [
            {
                name: 'nro',
                label: 'NRO',
                esFlag: false,
                width: 'mat-column  mat-column-60  center-cell'
            },
            {
                name: 'usuario',
                label: 'USUARIO',
                esFlag: false,
                width: 'mat-column  mat-column-60  center-cell'
            },
            {
                name: 'dni',
                label: 'DNI',
                esFlag: false,
                width: 'mat-column mat-column-60  center-cell'
            },
            {
                name: 'nombre',
                label: 'NOMBRE COMPLETO',
                esFlag: false,
                width: 'mat-column mat-column-60  center-cell'
            },
            {
                name: 'descriçionPerfil',
                label: 'PERFIL',
                esFlag: false,
                width: 'mat-column mat-column-60  center-cell'
            },
            {
                name: 'actions',
                label: '...',
                esFlag: false,
                width: 'mat-column center-cell'
            }
        ];
        this.displayedColumns = this.customColumns.map(
            (column: any) => column.name
        );
    }
}
