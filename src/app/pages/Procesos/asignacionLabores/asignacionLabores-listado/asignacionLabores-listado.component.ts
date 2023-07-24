import {Component, ViewChild, ChangeDetectorRef, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {AsignacionLaboresRegistroComponent} from '../asignacionLabores-registro/asignacionLabores-registro.component';
import {
    CalendarOptions,
    EventApi,
    EventClickArg
} from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import {FullCalendarComponent} from '@fullcalendar/angular';
import {AsignacionLaboresService} from '@services/procesos/asignacionLabores.service';
import { AsignacionLaboresModel } from '@/Models/procesos/AsignacionLaboresModel.model';
import moment from 'moment';
import { ExcelService } from '@services/excel.service';
import { CalendarTemplateRef } from '@fullcalendar/angular/private-types';

@Component({
    selector: 'app-asignacionlabores-listado',
    templateUrl: './asignacionLabores-listado.component.html',
    styleUrls: ['./asignacionLabores-listado.component.scss']
})
export class AsignacionLaboresListadoComponent implements OnInit {
    loadingData = true;
    listadoResult: any[] = [];

    customColumns = [
        {
            name: 'title',
            label: 'TÍTULO',
        },
        {
            name: 'descripcion',
            label: 'DESCRIPCIÓN',
        },
        {
            name: 'direccion',
            label: 'DIRECCIÓN',
        },
        {
            name: 'start',
            label: 'FECHA HORA INICIO',
        },
        {
            name: 'end',
            label: 'FECHA HORA FIN',
        }
    ];

    @ViewChild('calendar') calendarComponent: FullCalendarComponent;

    calendarVisible = true;
    calendarOptions: CalendarOptions = {
        plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin],
        headerToolbar: {
            left: 'prev,next today customButton',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        locale: 'es-ES',
        initialView: 'dayGridMonth',
        weekends: true,
        editable: true,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        themeSystem: 'bootstrap',
        dateClick: this.nuevo.bind(this),
        buttonText: {
            today: 'Hoy',
            month: 'Mes',
            day: 'Día',
            week: 'Semana',
            previous: 'Anterior',
            custom: 'Descargar'
        },
        customButtons: {
            customButton: {
              text: 'Descargar',
              click: () => {
                this.exportarDatos()
              }
            }
          },
        // select: this.handleDateSelect.bind(this),
        eventClick: this.edit.bind(this),
    };
    currentEvents: EventApi[] = [];

    constructor(
        private changeDetector: ChangeDetectorRef,
        private excelService: ExcelService,
        private asignacionLaboresService: AsignacionLaboresService,
        private ref: ChangeDetectorRef,
        public dialog: MatDialog,
    ) {}

    ngOnInit() {
        this.cargarListaDatos();
    }

    nuevo(res:{dateStr: string}) {
        const registro = new AsignacionLaboresModel();
        registro.clean();
        registro.fecha = res.dateStr;
        this.openDialog(registro);
    }

    edit(clickInfo: EventClickArg) {
        let registro = new AsignacionLaboresModel();
        registro.clean();
        let x = clickInfo.event._def.extendedProps['idAsignacion'];
        registro = this.listadoResult.find(y => y.idAsignacion == x)
        registro.idAsignacion = x
        registro.fecha = moment(registro.start).format('YYYY-MM-DD')
        this.openDialog(registro);
    }

    openDialog(registro: any) {
        const dialogRef = this.dialog.open(AsignacionLaboresRegistroComponent,{
            data: {registro: registro}
        } );
    
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.cargarListaDatos();
            }
        });
    }

    cargarListaDatos() {
        this.loadingData = true;
        this.asignacionLaboresService
            .listarAsignaciones$({})
            .subscribe((result) => {
                this.listadoResult = []
                this.listadoResult = result;
                this.calendarComponent.events = this.listadoResult
                this.loadingData = false;
            });
        this.loadingData = false;
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
                        'ASIGNACIONES LABORALES',
                        'DATA',
                        this.customColumns.filter(
                            (f) =>
                                f.name !== 'indice' &&
                                f.name !== 'actions' &&
                                f.name !== 'select'
                        ),
                        data,
                        columnsSize,
                        'ListadoAsignaciones',
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
