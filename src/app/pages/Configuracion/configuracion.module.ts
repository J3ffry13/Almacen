import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ProfabricComponentsModule} from '@profabric/angular-components';
import {TrabajadoresListadoComponent} from './trabajadores/trabajadoresListado/trabajadores-listado.component';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import {ProveedoresListadoComponent} from './proveedores/proveedoresListado/proveedores-listado.component';
import {ProveedoresRegistroComponent} from './proveedores/proveedoresRegistro/proveedores-registro.component';
import {CommonModule} from '@angular/common';
import {ProductosListadoComponent} from './productos/productosListado/productos-listado.component';
import {ProductosRegistroComponent} from './productos/productosRegistro/productos-registro.component';
import {TrabajadoresRegistroComponent} from './trabajadores/trabajadoresRegistro/trabajadores-registro.component';
import {MatCardModule} from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MY_FORMATS_DDMMYYY } from '@/utils/format-datepicker';
import { MatDatepickerModule } from '@angular/material/datepicker';

const routes: Routes = [
    {
        path: 'trabajadores',
        component: TrabajadoresListadoComponent
    },
    {
        path: 'productos',
        component: ProductosListadoComponent
    },
    {
        path: 'proveedores',
        component: ProveedoresListadoComponent
    }
];

@NgModule({
    declarations: [
        TrabajadoresListadoComponent,
        TrabajadoresRegistroComponent,
        ProductosListadoComponent,
        ProductosRegistroComponent,
        ProveedoresListadoComponent,
        ProveedoresRegistroComponent
    ],
    entryComponents: [
        TrabajadoresRegistroComponent,
        ProveedoresRegistroComponent,
        ProductosRegistroComponent
    ],
    imports: [
        MatTableModule,
        MatPaginatorModule,
        MatIconModule,
        MatFormFieldModule,
        MatTooltipModule,
        MatButtonModule,
        MatInputModule,
        MatCardModule,
        MatSelectModule,
        MatDatepickerModule,
        RouterModule.forChild(routes),
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        ProfabricComponentsModule
    ],
    providers: [
        {provide: MAT_DATE_LOCALE, useValue: 'es-ES'},
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE]
        },
        {
            provide: MAT_DATE_FORMATS,
            useValue: MY_FORMATS_DDMMYYY
        }
    ]
})
export class ConfiguracionModule {}
