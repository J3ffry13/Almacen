import {Component, ViewChild, ChangeDetectorRef, OnInit} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {ExcelService} from '@services/excel.service';
import {MatDialog} from '@angular/material/dialog';
import {CurrentUser} from '@/Models/auth/auth.model';
import {LoginService} from '@services/auth/login.service';
import {ConfirmActionComponent} from '@components/crud/confirm-action/confirm-action.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SnackbarComponent} from '@components/crud/snackbar/snackbar.component';
import {ProveedoresRegistroComponent} from '../proveedoresRegistro/proveedores-registro.component';
import {ProveedoresModel} from '@/Models/configuracion/ProveedoresModel.model';
import {ProveedoresService} from '@services/configuracion/proveedores.service';

@Component({
    selector: 'app-proveedores-listado',
    templateUrl: './proveedores-listado.component.html',
    styleUrls: ['./proveedores-listado.component.scss']
})
export class ProveedoresListadoComponent implements OnInit {
    displayedColumns: string[] = [];
    dataSource: MatTableDataSource<any>;
    listadoResult: ProveedoresModel[] = [];
    customColumns: any[] = [];
    loading = false;
    loadingData = false;
    user = new CurrentUser();
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    users: string | null = null;

    constructor(
        private ref: ChangeDetectorRef,
        private proveedoresService: ProveedoresService,
        private loginService: LoginService,
        private excelService: ExcelService,
        public dialog: MatDialog,
        private _snackBar: MatSnackBar
    ) {}

    async ngOnInit() {
        this.loading = true;
        this.user.email = await this.loginService.getUser();
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
        this.proveedoresService.listarProveedores().subscribe((result) => {
            this.listadoResult = [];
            result.forEach((element) => {
                this.listadoResult.push({
                    idProveedor: element.payload.doc.id,
                    ...element.payload.doc.data()
                });
            });
            this.refreshLista();
            this.loading = false;
            this.loadingData = false;
        });
    }

    nuevo() {
        const registro = new ProveedoresModel();
        registro.clean();
        this.openDialog(registro, 1);
    }

    edit(registro: ProveedoresModel) {
        this.openDialog(registro, 2);
    }

    delete(registro: any) {
        let registroDatos: ProveedoresModel = new ProveedoresModel();
        registroDatos.clean();
        registroDatos = registro;
        registroDatos.status = false;
        registroDatos.status = false;
        registroDatos.login_up = this.user.email;

        const dialogRef = this.dialog.open(ConfirmActionComponent, {
            data: {
                type: 'Eliminar Registro',
                question: '¿Seguro de eliminar el registro?'
            }
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result == 'ok' && result != undefined) {
                this.proveedoresService
                    .editar_Proveedor(registroDatos.idProveedor, registroDatos)
                    .then(() => {
                        let message = 'Proveedor Eliminado con Éxito';
                        this._snackBar.openFromComponent(SnackbarComponent, {
                            duration: 3 * 1000,
                            data: message['']
                        });
                    });
                this.cargarListaDatos();
            }
        });
    }

    openDialog(registro: ProveedoresModel, accion: number) {
        const dialogRef = this.dialog.open(ProveedoresRegistroComponent, {
            data: {registro, accion}
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.cargarListaDatos();
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
                name: 'ruc',
                label: 'RUC',
                esFlag: false,
                width: 'mat-column  mat-column-60  center-cell'
            },
            {
                name: 'nombre',
                label: 'NOMBRE',
                esFlag: false,
                width: 'mat-column mat-column-60  center-cell'
            },
            {
                name: 'correo',
                label: 'CORREO',
                esFlag: false,
                width: 'mat-column center-cell'
            },
            {
                name: 'direccion',
                label: 'DIRECCION',
                esFlag: false,
                width: 'mat-column center-cell'
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

    exportarDatos() {
        this.asyncAction(this.listadoResult)
            .then(() => {
                this.ref.markForCheck();
            })
            .catch((e: any) => {
                this.ref.markForCheck();
            });
    }

    asyncAction(listaDatos: any[]) {
        let data = listaDatos;
        const promise = new Promise((resolve, reject) => {
            try {
                setTimeout(() => {
                    const columnsSize = [
                        30, 30, 30, 15, 40, 10, 15, 10, 20, 20, 20, 15
                    ];

                    this.excelService.exportToExcelGenerico(
                        'LISTADO DE PROVEEDORES',
                        'DATA',
                        this.customColumns.filter(
                            (f) =>
                                f.name !== 'indice' &&
                                f.name !== 'actions' &&
                                f.name !== 'select'
                        ),
                        data,
                        columnsSize,
                        'ListadoProveedores',
                        true
                    );
                }, 0);
            } catch (e) {
                reject(e);
            }
        });
        return promise;
    }
}
