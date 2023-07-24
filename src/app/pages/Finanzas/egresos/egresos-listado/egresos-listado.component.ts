import {Component, ViewChild, ChangeDetectorRef, OnInit} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ExcelService} from '@services/excel.service';
import {MatDialog} from '@angular/material/dialog';
import {CurrentUser} from '@/Models/auth/auth.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SnackbarComponent} from '@components/crud/snackbar/snackbar.component';
import { LoginService } from '@services/auth/login.service';
import { ConfirmActionComponent } from '@components/crud/confirm-action/confirm-action.component';
import moment from 'moment';
import { EgresosService } from '@services/finanzas/egresos.service';
import { EgresosModel } from '@/Models/finanzas/EgresosModel.model';
import { EgresosRegistroComponent } from '../egresos-registro/egresos-registro.component';
import * as Highcharts from 'highcharts';

@Component({
    selector: 'app-egresos-listado',
    templateUrl: './egresos-listado.component.html',
    styleUrls: ['./egresos-listado.component.scss']
})
export class EgresosListadoComponent implements OnInit {
    displayedColumns: string[] = [];
    dataSource: MatTableDataSource<any>;
    listadoResult: any[] = [];
    customColumns: any[] = [];
    loading = false;
    loadingData = false;
    user: CurrentUser;
    maxDate = new Date();
    formGroupFiltros: FormGroup;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    highcharts = Highcharts;
    chart: any;
    chartCallback: any;
    updateFromInput = false;
    chartOptionsEgresos: Highcharts.Options = {
        chart: {
            type: 'spline'
        },
        title: {
            text: 'EGRESOS',
            style: {
                fontFamily: 'Poppins, Helvetica, sans-serif',
                fontSize: '25',
                fontWeight: '10'
            }
        },
        xAxis: {
            // categories: [],
            crosshair: true,
            title: {
                text: 'Fecha'
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Cantidad'
            }
        },
        tooltip: {
            pointFormat: 'Total: <b>{point.y} </b>'
        },
        plotOptions: {
            series: {
                marker: {
                    enabled: true,
                    radius: 2.5
                }
            }
        },
        colors: ['#fa4b42', '#fe6a35'],
        series: []
    };

    constructor(
        private ref: ChangeDetectorRef,
        private egresosService: EgresosService,
        private loginService: LoginService,
        private excelService: ExcelService,
        public dialog: MatDialog,
        private _snackBar: MatSnackBar,
        private formBuilder: FormBuilder,
    ) {}

    ngOnInit() {
        this.loading = true;
        // this.user = this.loginService.getTokenDecoded();
        this.createFrom();
        this.renderColumns();
        this.cargarListaDatos();
    }

    createFrom() {
        this.formGroupFiltros = this.formBuilder.group({
          fechaIni: new FormControl(moment().add(-1, 'days')),
          fechaFin: new FormControl(moment())
        });
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
        const controls = this.formGroupFiltros.controls;
        this.egresosService
            .listarEgresos$({
                fechaIni: moment(controls['fechaIni'].value).format('YYYY-MM-DD'),                
                fechaFin: moment(controls['fechaFin'].value).format('YYYY-MM-DD')
            })
            .subscribe((result) => {
                this.listadoResult = result[0];
                this.refreshLista();
                this.generarGraficoEgresos(result[1]);
                this.updateFromInput = true;
                this.loading = false;
                this.loadingData = false;
            });
        this.loadingData = false;
    }

    nuevo() {
        const registro = new EgresosModel();
        registro.clean();
        this.openDialog(registro);
    }

    edit(registro: EgresosModel) {
        this.openDialog(registro);       
    }

     openDialog(registro: EgresosModel) {
        const dialogRef = this.dialog.open(EgresosRegistroComponent, {
            data: {registro}
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log(result);
            if (result) {
                this.cargarListaDatos();
            }
        });
    }

    delete(registro: any) {
        let registroDatos: EgresosModel = new EgresosModel();
        registroDatos.clean();
        registroDatos.idEgresos = registro.idEgresos;
        registroDatos.accion = 3;
        registroDatos.login = this.user.email
        const dialogRef = this.dialog.open(ConfirmActionComponent, {
            data: {
                type: 'Eliminar Registro',
                question: '¿Seguro de eliminar el registro?'
            }
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result == 'ok' && result != undefined) {
                this.egresosService
                    .elimina_Egresos$({
                        registroDatos
                    })
                    .subscribe((result) => {
                        let message = result[0];
                        this._snackBar.openFromComponent(SnackbarComponent, {
                            duration: 3 * 1000,
                            data: message['']
                        });
                        this.cargarListaDatos();
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
                width: 'mat-column mat-column-60 center-cell'
            },
            {
                name: 'descripcion',
                label: 'DESCRIPCIÓN',
                esFlag: false,
                width: 'mat-column'
            }, 
            {
                name: 'monto',
                label: 'MONTO',
                esFlag: false,
                width: 'mat-column'
            },     
            {
                name: 'fecha',
                label: 'FECHA',
                esFlag: false,
                width: 'mat-column mat-column-120 center-cell'
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

    generarGraficoEgresos(listado: any) {
        var series = [];
        var xname = [];
        let datax = {
            data: [],
            name: 'Egresos',
            type: 'spline'
        };
        listado.forEach((x) => {
            xname.push(x.name);
            datax.data.push([x.name, x.valor]);
        });
        console.log(datax);
        series.push(datax);
        this.chartOptionsEgresos.series = series;
        this.chartOptionsEgresos.xAxis['categories'] = xname;
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
                        20, 30, 30, 40, 40, 10, 15, 10, 20, 20, 20, 15
                    ];

                    this.excelService.exportToExcelGenerico(
                        'LISTADO DE EGRESOS',
                        'DATA',
                        this.customColumns.filter(
                            (f) =>
                                f.name !== 'indice' &&
                                f.name !== 'actions' &&
                                f.name !== 'select'
                        ),
                        data,
                        columnsSize,
                        'ListadoEgresos',
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
