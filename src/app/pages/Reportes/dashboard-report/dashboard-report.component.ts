import {Component, ViewChild, ChangeDetectorRef, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {ReportesService} from '@services/reportes/reportes.service';
import * as Highcharts from 'highcharts';
import Drilldown from 'highcharts/modules/drilldown';
import HC_stock from 'highcharts/modules/stock';

Drilldown(Highcharts);
HC_stock(Highcharts);

@Component({
    selector: 'app-dashboard-report',
    templateUrl: './dashboard-report.component.html',
    styleUrls: ['./dashboard-report.component.scss']
})
export class DashboardReportComponent implements OnInit {
    loading = false;
    loadingData = false;
    formGroupFiltros: FormGroup;
    listadoResult: any[] = [];
    listadoResultTrabajadores: any[] = [];
    listadoResultIngresosEgresos: any[] = [];
    listadoResultAsistenciaTrabajadores: any[] = [];
    updateFromInput = false;

    chart: any;
    chartCallback: any;

    highcharts = Highcharts;
    chartOptionsLabores: Highcharts.Options = {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            style: {fontFamily: 'Poppins, Helvetica, sans-serif'}
        },
        title: {
            text: 'Actividades X Grupo',
            style: {
                fontFamily: 'Poppins, Helvetica, sans-serif',
                fontSize: '25',
                fontWeight: '10'
            },
            align: 'center'
        },
        tooltip: {
            headerFormat:
                '<span style="font-size:11px">{point.name}</span><br>',
            pointFormat: '{point.name}: <b>{point.y}</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.y} '
                }
            }
        },
        lang: {noData: 'No hay información disponible.'},
        series: [{data: [], type: 'pie', colorByPoint: true}],
        colors: [
            '#E7C03C',
            '#3CA9E7',
            '#78E73C',
            '#E23CE7',
            '#E73C60',
            '#B63CE7',
            '#3CE7AE',
            '#D2E73C',
            '#686B73'
        ]
    };
    chartOptionsTrabjadores: Highcharts.Options = {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Trabajadores X Grupo',
            style: {
                fontFamily: 'Poppins, Helvetica, sans-serif',
                fontSize: '25',
                fontWeight: '10'
            }
        },
        xAxis: {
            categories: [],
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Cantidad de Trabajadores'
            }
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.y} </b>'
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: []
    };
    chartOptionsPieInvsEg: Highcharts.Options = {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: 0,
            plotShadow: false
        },
        title: {
            text: 'Ingresos VS Egresos',
            style: {
                fontFamily: 'Poppins, Helvetica, sans-serif',
                fontSize: '25',
                fontWeight: '10'
            },
            align: 'center'
            // verticalAlign: 'middle',
            // y: 60
        },
        tooltip: {
            pointFormat:
                'PORCENTAJE: <b>{point.percentage:.2f}%</b>' +
                '<br>TOTAL: <b>{point.y}</b>'
        },
        accessibility: {
            point: {
                valueSuffix: '%'
            }
        },
        plotOptions: {
            pie: {
                dataLabels: {
                    enabled: true,
                    style: {
                        fontWeight: 'bold',
                        color: 'white'
                    }
                },
                startAngle: -90,
                endAngle: 90,
                center: ['50%', '75%'],
                size: '100%'
            }
        },
        series: [
            {
                type: 'pie',
                name: 'Browser share',
                innerSize: '50%',
                data: []
            }
        ],
        colors: ['#50B432', '#E74C3C']
    };
    chartOptionsAsistencias: Highcharts.Options = {
        chart: {
            type: 'column'
        },
        title: {
            align: 'center',
            style: {
                fontFamily: 'Poppins, Helvetica, sans-serif',
                fontSize: '25',
                fontWeight: '10'
            },
            text: 'Asistencias Trabajadores'
        },
        credits: {enabled: true},
        lang: {
            noData: 'No hay información disponible'
        },
        accessibility: {
            announceNewData: {
                enabled: true
            }
        },
        xAxis: {
            type: 'category',
            scrollbar: {enabled: false},
            tickLength: 0
        },
        yAxis: {
            title: {
                text: 'Cant. Asistencias'
            }
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            series: {
                borderWidth: 0,
                dataLabels: {
                    enabled: true,
                    format: '{point.y}'
                }
            }
        },
        tooltip: {
            headerFormat:
                '<span style="font-size:11px">{series.name}</span><br>',
            pointFormat:
                '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b>'
        },
        series: [],
        drilldown: {
            activeDataLabelStyle: {
                color: 'white',
                textShadow: '0 0 2px black, 0 0 2px black'
            },
            breadcrumbs: {
                position: {
                    align: 'right'
                }
            },
            series: []
        }
    };

    constructor(private reportesService: ReportesService) {
        this.chartCallback = (chart: any) => {
            this.chart = chart;
        };
    }

    ngOnInit() {
        this.loading = true;
        this.cargarListaDatos();
    }

    cargarListaDatos() {
        this.loading = true;
        this.reportesService.listadoDasboard$({}).subscribe((result) => {
            this.listadoResult = result[0];
            this.listadoResultTrabajadores = result[1];
            this.listadoResultIngresosEgresos = result[2];
            this.listadoResultAsistenciaTrabajadores = result[3];

            this.generarDashboardAsistenciasTrabajadores();
            this.generarDashboardTrabajadores();
            this.generaraDashboardLabores();
            this.generarDashboardIngresosEgresos();

            this.updateFromInput = true;
            this.loading = false;
        });
        this.loading = false;
    }

    generarDashboardAsistenciasTrabajadores() {
        const gruposAgrupados = this.listadoResultAsistenciaTrabajadores.reduce(
            (acumulador, objeto) => {
                const grupo = objeto.grupo;
                if (!acumulador[grupo]) {
                    acumulador[grupo] = {
                        grupo: grupo,
                        cantidadTotal: 0
                    };
                }
                acumulador[grupo].cantidadTotal += objeto.cantidad;
                return acumulador;
            },
            {}
        );
        let resultado = [];
        resultado = Object.values(gruposAgrupados);
        // OBTENEMOS LAS SERIES
        let gruposSeries = [];
        resultado.forEach((x) => {
            gruposSeries.push({
                name: x.grupo,
                y: x.cantidadTotal,
                drilldown: x.grupo
            });
        });
        // OBTENEMOS DRILLDOWN
        const personasDrill = this.listadoResultAsistenciaTrabajadores.reduce(
            (acumulador, objeto) => {
                const grupo = objeto.grupo;
                if (!acumulador[grupo]) {
                    acumulador[grupo] = {
                        grupo: grupo,
                        data: []
                    };
                }
                acumulador[grupo].data.push([objeto.nombre, objeto.cantidad]);
                return acumulador;
            },
            {}
        );
        let resultadoDrill = [];
        resultadoDrill = Object.values(personasDrill);
        let personasDrilldown = [];
        resultadoDrill.forEach((x) => {
            personasDrilldown.push({
                name: x.grupo,
                id: x.grupo,
                type: 'column',
                data: x.data
            });
        });
        this.chartOptionsAsistencias.series = [
            {
                data: gruposSeries,
                type: 'column',
                name: 'Asistencias',
                colorByPoint: true
            }
        ];
        this.chartOptionsAsistencias.drilldown = {series: personasDrilldown};
    }

    generarDashboardIngresosEgresos() {
        let data = [];
        this.listadoResultIngresosEgresos.forEach((x) => {
            let y = [];
            y.push(x.name);
            y.push(x.monto);
            data.push(y);
        });
        this.chartOptionsPieInvsEg.series = [
            {data: data, type: 'pie', name: 'Browser share', innerSize: '50%'}
        ];
    }

    generaraDashboardLabores() {
        this.chartOptionsLabores.series = [
            {data: this.listadoResult, type: 'pie', colorByPoint: true}
        ];
    }

    generarDashboardTrabajadores() {
        var series = [];
        this.listadoResultTrabajadores.forEach((x) => {
            x.data = [];
            x.type = 'column';
            series.push(x.name);
        });
        this.listadoResultTrabajadores.forEach((x) => {
            series.forEach((y) => {
                y == x.name ? x.data.push(x.valor) : x.data.push(0);
            });
        });
        this.chartOptionsTrabjadores.series = this.listadoResultTrabajadores;
        this.chartOptionsTrabjadores.xAxis['categories'] = series;
    }
}
