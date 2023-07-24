import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { MainComponent } from '@modules/main/main.component';
import {BlankComponent} from '@pages/blank/blank.component';

const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () =>
            import('app/modules/auth.module').then((m) => m.AuthModule)
    },
    {
        path: '',
        component: MainComponent,
        // canActivate: [AuthGuard],
        children: [
            {
				path: 'configuracion',
				loadChildren: () => import('@/pages/Configuracion/configuracion.module').then(m => m.ConfiguracionModule),
			},
        ]
    },
    {path: 'home', component: BlankComponent},
    {path: '**', redirectTo: '/auth/login'}
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {})],
    exports: [RouterModule]
})
export class AppRoutingModule {}
