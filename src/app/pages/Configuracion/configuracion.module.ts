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
import { ProductosRegistroComponent } from './productos/productosRegistro/productos-registro.component';

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
        ProductosListadoComponent,
        ProductosRegistroComponent,
        ProveedoresListadoComponent,
        ProveedoresRegistroComponent
    ],
    entryComponents: [ProveedoresRegistroComponent, ProductosRegistroComponent],
    imports: [
        MatTableModule,
        MatPaginatorModule,
        MatIconModule,
        MatFormFieldModule,
        MatTooltipModule,
        MatButtonModule,
        MatInputModule,
        RouterModule.forChild(routes),
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        ProfabricComponentsModule
    ],
    providers: []
})
export class ConfiguracionModule {}
