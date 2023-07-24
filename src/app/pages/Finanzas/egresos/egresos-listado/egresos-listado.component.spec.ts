import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExcelService } from '@services/excel.service';
import { LoginService } from '@services/auth/login.service';
import { EgresosService } from '@services/finanzas/egresos.service';
import { EgresosModel } from '@/Models/finanzas/EgresosModel.model';
import { EgresosRegistroComponent } from '../egresos-registro/egresos-registro.component';
import { EgresosListadoComponent } from './egresos-listado.component';
import { of } from 'rxjs';
import moment from 'moment';

describe('EgresosListadoComponent', () => {
  let component: EgresosListadoComponent;
  let fixture: ComponentFixture<EgresosListadoComponent>;
  let egresosService: EgresosService;
  let excelService: ExcelService;
  let loginService: LoginService;
  let matDialog: MatDialog;
  let matSnackBar: MatSnackBar;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [EgresosListadoComponent],
      providers: [
        { provide: EgresosService, useValue: jasmine.createSpyObj('EgresosService', ['listarEgresos$', 'elimina_Egresos$']) },
        { provide: ExcelService, useValue: jasmine.createSpyObj('ExcelService', ['exportToExcelGenerico']) },
        { provide: LoginService, useValue: jasmine.createSpyObj('LoginService', ['getTokenDecoded']) },
        { provide: MatDialog, useValue: jasmine.createSpyObj('MatDialog', ['open']) },
        { provide: MatSnackBar, useValue: jasmine.createSpyObj('MatSnackBar', ['openFromComponent']) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EgresosListadoComponent);
    component = fixture.componentInstance;
    egresosService = TestBed.inject(EgresosService);
    excelService = TestBed.inject(ExcelService);
    loginService = TestBed.inject(LoginService);
    matDialog = TestBed.inject(MatDialog);
    matSnackBar = TestBed.inject(MatSnackBar);
  });

  it('Se debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('Debe inicializar el componente', () => {
    // const mockUser = { idUsuario: 1, usuarioNombre: 'admin' };
    const mockFormGroup = new FormGroup({
      fechaIni: new FormControl(moment().add(-1, 'days')),
      fechaFin: new FormControl(moment()),
    });
    // const mockListadoResult = ['item1', 'item2'];
    // const mockDataSource = new MatTableDataSource(mockListadoResult);

    spyOn(component, 'createFrom');
    spyOn(component, 'renderColumns');
    spyOn(component, 'cargarListaDatos');

    // spyOn(loginService, 'getTokenDecoded').and.returnValue(mockUser);

    fixture.detectChanges();

    expect(component.createFrom).toHaveBeenCalled();
    expect(component.renderColumns).toHaveBeenCalled();
    expect(component.cargarListaDatos).toHaveBeenCalled();
    // expect(component.user).toEqual(mockUser);
    // expect(component.formGroupFiltros).toEqual(mockFormGroup);
  });

  it('Se debe crear el formulario', () => {
    component.createFrom();

    expect(component.formGroupFiltros).toBeTruthy();
    expect(component.formGroupFiltros.get('fechaIni')).toBeTruthy();
    expect(component.formGroupFiltros.get('fechaFin')).toBeTruthy();
  });

  it('Debe renderizar las columnas', () => {
    component.renderColumns();

    expect(component.displayedColumns).toEqual(['nro','descripcion', 'monto','fecha', 'actions']);
  });

  it('debe cargar el listado de datos', () => {
    const mockListadoResult = [];

    // spyOn(egresosService, 'listarEgresos$').and.returnValue(of(mockListadoResult));

    component.createFrom();
    component.cargarListaDatos();

    expect(egresosService.listarEgresos$).toHaveBeenCalled();
    expect(component.dataSource.data.length).toEqual(0);
  });

//   it('should exportToExcel', () => {
//     const mockListadoResult = ['item1', 'item2'];

//     spyOn(egresosService, 'listarEgresos$').and.returnValue(of(mockListadoResult));
//     spyOn(excelService, 'exportToExcelGenerico');

//     component.exportToExcel();

//     expect(egresosService.listarEgresos$).toHaveBeenCalled();
//     expect(excelService.exportToExcelGenerico).toHaveBeenCalledWith(mockListadoResult, 'Egresos');
//   });

//   it('should openRegistroDialog when id is null', () => {
//     spyOn(matDialog, 'open');

//     component.openRegistroDialog(null);

//     expect(matDialog.open).toHaveBeenCalledWith(EgresosRegistroComponent, { data: null });
//   });

//   it('should openRegistroDialog when id is provided', () => {
//     spyOn(matDialog, 'open');

//     component.openRegistroDialog(1);

//     expect(matDialog.open).toHaveBeenCalledWith(EgresosRegistroComponent, { data: 1 });
//   });

//   it('should eliminarRegistro', () => {
//     const mockEgreso: EgresosModel = { idEgresos: 1, fecha: '2023-05-26', descripcion: 'test', monto: 100 };

//     spyOn(egresosService, 'elimina_Egresos$').and.returnValue(of(null));
//     spyOn(component, 'cargarListaDatos');
//     spyOn(matSnackBar, 'openFromComponent');

//     component.eliminarRegistro(mockEgreso);

//     expect(egresosService.elimina_Egresos$).toHaveBeenCalledWith(mockEgreso.id);
//     expect(component.cargarListaDatos).toHaveBeenCalled();
//     expect(matSnackBar.openFromComponent).toHaveBeenCalled();
//   });
});
