import {
    Component,
    ViewChild,
    ChangeDetectorRef,
    OnInit} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ExcelService} from '@services/excel.service';
import {MatDialog} from '@angular/material/dialog';
import moment from 'moment';
import {ReportesService} from '@services/reportes/reportes.service';
import {SnackbarComponent} from '@components/crud/snackbar/snackbar.component';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
    selector: 'app-asistencias-report.component',
    templateUrl: './asistencias-report.component.html',
    styleUrls: ['./asistencias-report.component.scss']
})
export class AsistenciaReportComponent implements OnInit {
    displayedColumns: string[] = [];
    dataSource: MatTableDataSource<any>;
    listadoResult: any[] = [];
    listTipoDoccbo: any[] = [];
    listTipoContcbo: any[] = [];
    customColumns: any[] = [];
    pageSizeOptions: any[] = [20, 30, 40, 50];
    loading = false;
    loadingData = false;
    formGroupFiltros: FormGroup;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

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
            dni: new FormControl(''),
            fechaIni: [moment().add(-1, 'day')],
            fechaFin: [moment()]
        });
        this.loading = false;
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
        this.reportesService
            .listadoReporteAsistencias$({
                dni:
                    this.formGroupFiltros.value.dni == null
                        ? ''
                        : this.formGroupFiltros.value.dni,
                fechaIni: moment(this.formGroupFiltros.value.fechaIni).format(
                    'YYYY-MM-DD'
                ),
                fechaFin: moment(this.formGroupFiltros.value.fechaFin).format(
                    'YYYY-MM-DD'
                )
            })
            .subscribe((result) => {
                this.listadoResult = result;
                this.refreshLista();
                this.loading = false;
                this.loadingData = false;
            });
        this.loadingData = false;
    }

    applyFilterGlobal(filterValue: string) {
        filterValue = filterValue.trim();
        filterValue = filterValue.toLowerCase();
        this.dataSource.filter = filterValue;
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
            if (moment(event).toDate() > moment(this.formGroupFiltros.value.fechaFin).toDate()) {
                this.formGroupFiltros.controls['fechaFin'].setValue(moment(event, 'YYYY-MM-DD'));
            }
        }
    }

    onFechaHastaChange(event: any): void {
        if (event !== null && event !== undefined) {
            if (moment(event).toDate() < moment(this.formGroupFiltros.value.fechaIni).toDate()) {
                this.formGroupFiltros.controls['fechaIni'].setValue(moment(event, 'YYYY-MM-DD'));
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
                name: 'documento',
                label: 'DOCUMENTO',
                esFlag: false,
                width: 'mat-column mat-column-120 center-cell'
            },
            {
                name: 'nombreCompleto',
                label: 'TRABAJADOR',
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
                name: 'hora',
                label: 'HORA',
                esFlag: false,
                width: 'mat-column'
            },
            {
                name: 'tipoMarcacion',
                label: 'TIPO',
                esFlag: false,
                width: 'mat-column'
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
        else return 'background-color: #b0a700';
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
                        'REPORTE DE ASISTENCIAS',
                        'DATA',
                        this.customColumns.filter(
                            (f) => f.name !== 'actions' && f.name !== 'select'
                        ),
                        data,
                        columnsSize,
                        'ReporteAsistencias',
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
