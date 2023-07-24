import { AccesoModel } from '@/Models/auth/acceso.model';
import {AppState} from '@/store/state';
import {UiState} from '@/store/ui/state';
import {Component, HostBinding, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppService} from '@services/app.service';
import { LoginService } from '@services/auth/login.service';
import {Observable} from 'rxjs';

const BASE_CLASSES = 'main-sidebar elevation-4';
@Component({
    selector: 'app-menu-sidebar',
    templateUrl: './menu-sidebar.component.html',
    styleUrls: ['./menu-sidebar.component.scss']
})
export class MenuSidebarComponent implements OnInit {
    @HostBinding('class') classes: string = BASE_CLASSES;
    public ui: Observable<UiState>;
    public user;
    public listadoPermisos: string[] = []
    public menu = MENU

    constructor(
        public appService: AppService,
        private store: Store<AppState>,
        private loginService: LoginService,
    ) {}

    ngOnInit() {
        // // this.user = this.loginService.getTokenDecoded();
        // this.loginService.get// permissions({
        //     user: this.user
        // })
        // .subscribe((result) => {
        //     this.listadoPermisos = result
        //    this.menu.filter((x) =>  {this.listadoPermisos.includes(x.// permission) ? console.log(x) : console.log(''); } )
        // });
        this.ui = this.store.select('ui');
        this.ui.subscribe((state: UiState) => {
            this.classes = `${BASE_CLASSES} ${state.sidebarSkin}`;
        });
        this.user = this.appService.user;
    }
}
//https://www.w3schools.com/icons/fontawesome5_icons_code.asp
export const MENU = [
    {
        name: 'CONFIGUACIÓN',
        iconClasses: 'fas fa-th-list',
        // permission: 'accessToConfiguracionModule',
        children: [
            {
                name: 'Trabajadores',
                iconClasses: 'fas fa-user-alt',
                path: ['/configuracion/trabajadores'],
                // permission: 'accessToConfiguracionModuleTrabajadores'
            },
            {
                name: 'Productos',
                iconClasses: 'fas fa-tasks',
                path: ['configuracion/productos'],
                // permission: 'accessToConfiguracionModuleActividades'
            },
            {
                name: 'Proveedores',
                iconClasses: 'fas fa-users',
                path: ['configuracion/proveedores'],
                // permission: 'accessToConfiguracionModuleGruposTrabajo'
            }
        ]
    },
    {
        name: 'PROCESOS',
        iconClasses: 'fas fa-edit',
        // permission: 'accessToProcessModule',
        children: [
            {
                name: 'Asiganción de Labores',
                iconClasses: 'fas fa-tools',
                path: ['/process/assigment'],
                // permission: 'accessToProcessModuleAsignacionLabores'
            },
        ]
    },
    {
        name: 'ASISTENCIAS',
        // permission: 'accessToAssistsModule',
        iconClasses: 'fas fa-calendar-alt',        
        children: [
            {
                name: 'Registro Asistencias',
                iconClasses: 'fas fa-user-clock',
                path: ['/assists/registerpersonal'],
                // permission: 'accessToAssistsModuleRegistroPersonal'
            },
        ]
    },
    {
        name: 'INGRESOS - EGRESOS',
        iconClasses: 'fas fa-donate',     
        // permission: 'accessToFinanceModule',
        children: [
            {
                name: 'Ingresos',
                iconClasses: 'fas fa-comment-dollar',
                path: ['/finance/income'],
                // permission: 'accessToFinanceModuleIngresos'
            },
            {
                name: 'Egresos',
                iconClasses: '	fas fa-comments-dollar',
                path: ['/finance/expenses'],
                // permission: 'accessToFinanceModuleEgresos'
            },
        ]
    },
    {
        name: 'REPORTES',
        iconClasses: 'fas fa-chart-bar',  
        // permission: 'accessToReportsModule',
        children: [
            {
                name: 'Dashboard',
                iconClasses: 'fas fa-chart-pie',
                path: ['/reports/dashboard'],
                // permission: 'accessToReportsModuleDashboard'
            },
            {
                name: 'Ingresos vs Egresos',
                iconClasses: 'fas fa-balance-scale',
                path: ['/reports/incomevsexpenses'],
                // permission: 'accessToReportsModuleIngresosVSEgresos'
            },
            {
                name: 'Reporte de Asistencias',
                iconClasses: '	far fa-calendar-alt',
                path: ['/reports/asistences'],
                // permission: 'accessToReportsModuleReporteAsistencias'
            },
            {
                name: 'Reporte de Horas',
                iconClasses: 'fas fa-business-time',
                path: ['/reports/hours'],
                // permission: 'accessToReportsModuleReporteHoras'
            },
            {
                name: 'Reporte de Actividades',
                iconClasses: 'fas fa-tasks',
                path: ['/reports/activitiesxworkers'],
                // permission: 'accessToReportsModuleReporteActividades'
            },
        ]
    },
    {
        name: 'Seguridad',
        iconClasses: 'fas fa-user-shield',   
        // permission: 'accessToSecurityModule',   
        children: [
            {
                name: 'Perfiles Web',
                iconClasses: 'far fa-id-badge',
                path: ['/security/webprofiles'],
                // permission: 'accessToSecurityModulePerfilesWeb'
            },
            {
                name: 'Usuarios',
                iconClasses: 'far fa-id-badge',
                path: ['/security/users'],
                // permission: 'accessToSecurityModuleUsuarios'
            }
        ]
    }
];