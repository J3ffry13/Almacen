import { OnInit } from '@angular/core';
import { CurrentUser } from '@/Models/auth/auth.model';
import {Component} from '@angular/core';
import { LoginService } from '@services/auth/login.service';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent  implements OnInit{

    private user: CurrentUser;

    constructor(
        private loginService: LoginService,
        private permissionsService: NgxPermissionsService
    ) {}

    ngOnInit() {
        // // this.user = this.loginService.getTokenDecoded();
        // this.loginService
        //     .getPermissions({user: this.user.idUsuario})
        //     .subscribe(
        //         (result) => {
        //             let data = [];
        //             result.forEach((x) => {
        //                 data.push(x.accesoName);
        //             });
        //             this.permissionsService.loadPermissions(data);
        //         },
        //         (error) => {
        //             console.log(error);
        //         }
        //     );
    }
    
}
