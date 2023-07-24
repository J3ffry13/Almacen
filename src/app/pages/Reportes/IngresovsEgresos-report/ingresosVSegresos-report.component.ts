import {
    Component,
    ViewChild,
    ChangeDetectorRef,
    OnInit    
} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ExcelService} from '@services/excel.service';
import {MatDialog} from '@angular/material/dialog';
import moment from 'moment';
import {ReportesService} from '@services/reportes/reportes.service';
import {SnackbarComponent} from '@components/crud/snackbar/snackbar.component';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
    selector: 'app-ingresosvsegresos-report.component',
    templateUrl: './ingresosVSegresos-report.component.html',
    styleUrls: ['./ingresosVSegresos-report.component.scss']
})
export class IngresosVSegresosReportComponent implements OnInit {
    displayedColumns: string[] = [];
    dataSourceIngre: MatTableDataSource<any>;
    dataSourceEgre: MatTableDataSource<any>;
    listadoResultIngresos: any[] = [];
    listadoResultEgresos: any[] = [];
    listTipoDoccbo: any[] = [];
    pageSizeOptions: any[] = [20, 30, 40, 50];
    listTipoContcbo: any[] = [];
    customColumns: any[] = [];
    loading = false;
    loadingData = false;
    formGroupFiltros: FormGroup;
    @ViewChild(MatPaginator) paginatorIngre: MatPaginator;
    @ViewChild(MatSort) sortIngre: MatSort;
    @ViewChild(MatPaginator) paginatorEgre: MatPaginator;
    @ViewChild(MatSort) sortEgre: MatSort;
    totalIngresos: number = 0
    totalEgresos: number = 0

    constructor(
        private ref: ChangeDetectorRef,
        private reportesService: ReportesService,
        private excelService: ExcelService,
        public dialog: MatDialog,
        private formBuilder: FormBuilder,
        private _snackBar: MatSnackBar
    ) {}

    ngOnInit() {
        this.loading = true;
        this.createFrom();
        this.renderColumns();
        this.cargarListaDatos();
    }

    createFrom() {
        this.formGroupFiltros = this.formBuilder.group({
            fechaIni: [moment().add(-1, 'day')],
            fechaFin: [moment()]
        });
        this.loading = false;
    }

    refreshLista() {
        this.dataSourceIngre = new MatTableDataSource(
            this.listadoResultIngresos
        );
        this.dataSourceIngre.paginator = this.paginatorIngre;
        this.dataSourceIngre.sort = this.sortIngre;
        this.dataSourceEgre = new MatTableDataSource(this.listadoResultEgresos);
        this.dataSourceEgre.paginator = this.paginatorIngre;
        this.dataSourceEgre.sort = this.sortEgre;
        this.loadingData = false;
        this.ref.markForCheck();
    }

    cargarListaDatos() {
        this.loadingData = true;
        this.reportesService
            .listadoReporteIngresosVSEgresos$({
                fechaIni: moment(this.formGroupFiltros.value.fechaIni).format(
                    'YYYY-MM-DD'
                ),
                fechaFin: moment(this.formGroupFiltros.value.fechaFin).format(
                    'YYYY-MM-DD'
                )
            })
            .subscribe((result) => {
                this.totalEgresos = 0
                this.totalIngresos = 0
                this.listadoResultIngresos = result[0];
                this.listadoResultEgresos = result[1];
                this.totalEgresos = this.listadoResultEgresos.reduce((total, x) => total + x.monto, 0);
                this.totalIngresos = this.listadoResultIngresos.reduce((total, x) => total + x.monto, 0);

                this.refreshLista();
                this.loading = false;
                this.loadingData = false;
            });
        this.loadingData = false;
    }

    applyFilterGlobalIngre(filterValue: string) {
        filterValue = filterValue.trim();
        filterValue = filterValue.toLowerCase();
        this.dataSourceIngre.filter = filterValue;
    }

    applyFilterGlobalEgre(filterValue: string) {
        filterValue = filterValue.trim();
        filterValue = filterValue.toLowerCase();
        this.dataSourceEgre.filter = filterValue;
    }

    validateFechas() {
        const diff = moment(this.formGroupFiltros.value.fechaFin).diff(
            moment(this.formGroupFiltros.value.fechaIni),
            'days'
        );
        if (diff > 31) {
            this._snackBar.openFromComponent(SnackbarComponent, {
                duration: 3 * 1000,
                data: 'La busqueda se debe realizar en un rango de 31 días como máximo.'
            });
        } else {
            this.cargarListaDatos();
        }
    }

    onFechaDesdeChange(event: any): void {
        if (event !== null && event !== undefined) {
            if (
                moment(event).toDate() >
                moment(this.formGroupFiltros.value.fechaFin).toDate()
            ) {
                this.formGroupFiltros.controls['fechaFin'].setValue(
                    moment(event, 'YYYY-MM-DD')
                );
            }
        }
    }

    onFechaHastaChange(event: any): void {
        if (event !== null && event !== undefined) {
            if (
                moment(event).toDate() <
                moment(this.formGroupFiltros.value.fechaIni).toDate()
            ) {
                this.formGroupFiltros.controls['fechaIni'].setValue(
                    moment(event, 'YYYY-MM-DD')
                );
            }
        }
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
                width: 'mat-column mat-column-120 center-cell'
            },
            {
                name: 'fecha',
                label: 'FECHA',
                esFlag: false,
                width: 'mat-column mat-column-120 center-cell'
            },
            {
                name: 'monto',
                label: 'MONTO',
                esFlag: false,
                width: 'mat-column'
            }
        ];
        this.displayedColumns = this.customColumns.map(
            (column: any) => column.name
        );
    }

    exportarDatos(tipo: number) {
        let data =
            tipo == 1 ? this.listadoResultIngresos : this.listadoResultEgresos;
        let name = tipo == 1 ? 'INGRESOS' : 'EGRESOS';
        this.asyncAction(data, name)
            .then(() => {
                this.ref.markForCheck();
            })
            .catch((e: any) => {
                this.ref.markForCheck();
            });
    }

    asyncAction(listaDatos: any[], name: any) {
        let data = listaDatos;
        const promise = new Promise((resolve, reject) => {
            try {
                setTimeout(() => {
                    const columnsSize = [
                        20, 30, 30, 40, 40, 10, 15, 10, 20, 20, 20, 15
                    ];

                    this.excelService.exportToExcelGenerico(
                        `REPORTE DE ${name}`,
                        'DATA',
                        this.customColumns.filter(
                            (f) => f.name !== 'actions' && f.name !== 'select'
                        ),
                        data,
                        columnsSize,
                        `Reporte${name}`,
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
