import {
    Component,
    ViewChild,
    ChangeDetectorRef,
    OnInit
} from '@angular/core';
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
import { PerfilWebService } from '@services/seguridad/perfilWeb.service';
import { PerfilWebModel } from '@/Models/seguridad/PerfilWebModel.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil-web-listado',
  templateUrl: './perfil-web-listado.component.html',
  styleUrls: ['./perfil-web-listado.component.scss']
})
export class PerfilWebListadoComponent implements OnInit {
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
      private perfilWebService: PerfilWebService,
      private loginService: LoginService,
      private excelService: ExcelService,
      public dialog: MatDialog,
      private _snackBar: MatSnackBar,
      private router: Router,
  ) {}

  ngOnInit() {
      this.loading = true;
    //   // this.user = this.loginService.getTokenDecoded();
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
      this.perfilWebService.listadoPerfilesWEB$({}).subscribe((result) => {
          this.listadoResult = result;
          this.refreshLista();
          this.loading = false;
          this.loadingData = false;
      });
      this.loadingData = false;
  }

  nuevo() {
      const registro = new PerfilWebModel();
      registro.clean();
      this.router.navigate(['security/webprofiles-reg'], {
          state: {
              param: registro,
          }
      });
  }

  edit(registro: PerfilWebModel) {
    this.router.navigate(['security/webprofiles-reg'], {
        state: {
            param: registro,
        }
    });
  }

  delete(registro: any) {
      let registroDatos: PerfilWebModel = new PerfilWebModel();
      registroDatos.clean();
      registroDatos.idPerfilWeb = registro.idPerfilWeb;
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
              this.perfilWebService
                  .elimina_PerfilWeb$({
                      registroDatos
                  })
                  .subscribe((result) => {
                      let message = result[0];
                      this._snackBar.openFromComponent(SnackbarComponent, {
                          duration: 3 * 1000,
                          data: message['']
                      });
                  });
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
              name: 'nro',
              label: 'NRO',
              esFlag: false,
              width: 'mat-column  mat-column-60  center-cell'
          },
          {
              name: 'descripcion',
              label: 'DESCRIPCIÓN',
              esFlag: false,
              width: 'mat-column  mat-column-60  center-cell'
          },
          {
              name: 'cantidadAccesos',
              label: 'CANTIDAD',
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
                      'LISTADO DE PERFILES',
                      'DATA',
                      this.customColumns.filter(
                          (f) =>
                              f.name !== 'indice' &&
                              f.name !== 'actions' &&
                              f.name !== 'select'
                      ),
                      data,
                      columnsSize,
                      'ListadoPerfiles',
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
