import {
    Component,
    ViewChild,
    ChangeDetectorRef,
    OnInit
} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ExcelService} from '@services/excel.service';
import {MatDialog} from '@angular/material/dialog';
import {ReportesService} from '@services/reportes/reportes.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
    selector: 'app-horas-report.component',
    templateUrl: './horas-report.component.html',
    styleUrls: ['./horas-report.component.scss']
})
export class HorasReportComponent implements OnInit {
    displayedColumns: string[] = [];
    dataSource: MatTableDataSource<any>;
    listadoResult: any[] = [];
    listSemanasCbo: any[] = [];
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
        this.cargarSemanas();
        this.createFrom();
        this.renderColumns();
        this.cargarListaDatos();
    }

    obtenerSemana() {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const firstDayOfYear = new Date(currentYear, 0, 1);
        const daysOffset =
            firstDayOfYear.getDay() === 0 ? -6 : 1 - firstDayOfYear.getDay();
        const firstMondayOfYear = new Date(currentYear, 0, 1 + daysOffset);
        const currentDayOfYear = Math.floor(
            (currentDate.getTime() - firstMondayOfYear.getTime()) /
                (24 * 60 * 60 * 1000)
        );
        const currentWeekNumber = Math.floor(currentDayOfYear / 7) + 1;
        return currentWeekNumber;
    }

    getWeekNumber(date: Date): number {
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const daysOffset =
            firstDayOfYear.getDay() === 0 ? -6 : 1 - firstDayOfYear.getDay();
        const firstMondayOfYear = new Date(
            date.getFullYear(),
            0,
            1 + daysOffset
        );
        const currentDayOfYear = Math.floor(
            (date.getTime() - firstMondayOfYear.getTime()) /
                (24 * 60 * 60 * 1000)
        );
        const weekNumber = Math.floor(currentDayOfYear / 7) + 1;
        return weekNumber;
    }

    cargarSemanas() {
        this.listSemanasCbo = [];

        const fechaActual = new Date();
        const anioActual = fechaActual.getFullYear();

        const fechaInicio = new Date(anioActual, 0, 1); // Primer día del año
        const fechaFin = new Date(anioActual, 11, 31); // Último día del año

        while (fechaInicio < fechaFin) {
            const codigoSemana = this.getWeekNumber(fechaInicio);
            const descripcionSemana = `Semana ${codigoSemana} - ${anioActual}`;
            this.listSemanasCbo.push({
                codigo: codigoSemana.toString(),
                descr: descripcionSemana
            });
            fechaInicio.setDate(fechaInicio.getDate() + 7);
        }
    }

    createFrom() {
        this.formGroupFiltros = this.formBuilder.group({
            semanaID: new FormControl(-1 + '', [Validators.min(1)])
        });
        this.loading = false;
        this.formGroupFiltros.controls['semanaID'].setValue((this.obtenerSemana()-1).toString())
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
            .listadoReporteHorasSemanales$({
                semanaID: +this.formGroupFiltros.value.semanaID
            })
            .subscribe((result) => {
                this.listadoResult = result;
                this.refreshLista();
                this.loadingData = false;
            });
        this.loadingData = false;
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
                name: 'nombreCompleto',
                label: 'TRABAJADOR',
                esFlag: false,
                width: 'mat-column mat-column-120 center-cell'
            },
            {
                name: 'lunes',
                label: 'LUNES',
                esFlag: false,
                width: 'mat-column mat-column-120 center-cell'
            },
            {
                name: 'martes',
                label: 'MARTES',
                esFlag: false,
                width: 'mat-column'
            },
            {
                name: 'miercoles',
                label: 'MIERCOLES',
                esFlag: false,
                width: 'mat-column'
            },
            {
                name: 'jueves',
                label: 'JUEVES',
                esFlag: false,
                width: 'mat-column'
            },
            {
                name: 'viernes',
                label: 'VIERNES',
                esFlag: false,
                width: 'mat-column'
            },
            {
                name: 'sabado',
                label: 'SÁBADO',
                esFlag: false,
                width: 'mat-column'
            },
            {
                name: 'domingo',
                label: 'DOMINGO',
                esFlag: false,
                width: 'mat-column'
            },
            {
                name: 'total',
                label: 'TOTAL',
                esFlag: false,
                width: 'mat-column'
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
                        20, 30, 30, 40, 40, 10, 15, 10, 20, 20, 20, 15
                    ];

                    this.excelService.exportToExcelGenerico(
                        'REPORTE DE HORAS',
                        'DATA',
                        this.customColumns.filter(
                            (f) => f.name !== 'actions' && f.name !== 'select'
                        ),
                        data,
                        columnsSize,
                        'ReporteHoras',
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
