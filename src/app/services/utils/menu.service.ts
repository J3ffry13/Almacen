export class Cildren {
  name: string = '';
  iconClasses: string  = '';
  permission: string  = '';
  path: string  = '';
}
export class MenuModel {
  name: string;
  iconClasses: string;
  permission: string;
  children: Cildren[] = [];

  clear(){
    this.name = ''
    this.iconClasses = ''
    this.permission = ''
    this.children = []
  }
}

export const MENU = [
  {
      name: 'CONFIGUACIÓN',
      iconClasses: 'fas fa-th-list',
      permission: 'accessToConfiguracionModule',
      children: [
          {
              name: 'Trabajadores',
              iconClasses: 'fas fa-user-alt',
              permission: 'accessToConfiguracionModuleTrabajadores',
              path: ['/masters/workers']
          },
          {
              name: 'Actividades',
              iconClasses: 'fas fa-tasks',
              permission: 'accessToConfiguracionModuleActividades',
              path: ['masters/activities']
          },
          {
              name: 'Grupos de Trabajo',
              iconClasses: 'fas fa-users',
              permission: 'accessToConfiguracionModuleGruposTrabajo',
              path: ['masters/workgroup']
          }
      ]
  },
  {
      name: 'PROCESOS',
      iconClasses: 'fas fa-edit',
      permission: 'accessToProcessModule',
      children: [
          {
              name: 'Asiganción de Labores',
              iconClasses: 'fas fa-tools',
              permission: 'accessToProcessModuleAsignacionLabores',
              path: ['/process/assigment']
          },
      ]
  },
  {
      name: 'ASISTENCIAS',
      iconClasses: 'fas fa-calendar-alt',
      permission: 'accessToAssistsModule',
      children: [
          {
              name: 'Registro Personal',
              iconClasses: 'fas fa-user-clock',
              permission: 'accessToAssistsModuleRegistroPersonal',
              path: ['/assists/registerpersonal']
          },
      ]
  },
  {
      name: 'FINANZAS',
      iconClasses: 'fas fa-donate',
      permission: 'accessToFinanceModule',
      children: [
          {
              name: 'Ingresos',
              iconClasses: 'fas fa-comment-dollar',
              permission: 'accessToFinanceModuleIngresos',
              path: ['/finance/income']
          },
          {
              name: 'Egresos',
              iconClasses: '	fas fa-comments-dollar',
              permission: 'accessToFinanceModuleEgresos',
              path: ['/finance/expenses']
          },
      ]
  },
  {
      name: 'REPORTES',
      iconClasses: 'fas fa-chart-bar',
      permission: 'accessToReportsModule',
      children: [
          {
              name: 'Dashboard',
              iconClasses: 'fas fa-chart-pie',
              permission: 'accessToReportsModuleDashboard',
              path: ['/reports/dashboard']
          },
          {
              name: 'Blank',
              iconClasses: 'fas fa-file',
              path: ['/sub-menu-2']
          }
      ]
  },
  {
      name: 'Seguridad',
      iconClasses: 'fas fa-user-shield',
      permission: 'accessToSecurityModule',
      children: [
        {
          name: 'Permisos',
          iconClasses: 'far fa-id-badge',
          permission: 'accessToSecurityModulePermisos',
          path: ['/security/permiss']
        },
        {
              name: 'Usuarios',
              iconClasses: 'far fa-id-badge',
              permission: 'accessToSecurityModuleUsuarios',
              path: ['/security/users']
        }
      ]
  }
];
