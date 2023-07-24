import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {Gatekeeper} from 'gatekeeper-client-sdk';

@Injectable({
    providedIn: 'root'
})
export class AppService {
    public user: any = null;

    constructor(private router: Router, private toastr: ToastrService) {}

    // async loginByAuth({email, password}) {
    //     try {
    //         const token = await Gatekeeper.loginByAuth(email, password);
    //         localStorage.setItem('token', token);
    //         await this.getProfile();
    //         this.router.navigate(['/']);
    //         this.toastr.success('Login success');
    //     } catch (error) {
    //         this.toastr.error(error.message);
    //     }
    // }

    // async registerByAuth({email, password}) {
    //     try {
    //         const token = await Gatekeeper.registerByAuth(email, password);
    //         localStorage.setItem('token', token);
    //         await this.getProfile();
    //         this.router.navigate(['/']);
    //         this.toastr.success('Register success');
    //     } catch (error) {
    //         this.toastr.error(error.message);
    //     }
    // }


    // async getProfile() {
    //     try {
    //         this.user = await Gatekeeper.getProfile();
    //     } catch (error) {
    //         this.logout();
    //         throw error;
    //     }
    // }

    // logout() {
    //     localStorage.removeItem('token');
    //     localStorage.removeItem('gatekeeper_token');
    //     this.user = null;
    //     this.router.navigate(['/login']);
    // }
}
