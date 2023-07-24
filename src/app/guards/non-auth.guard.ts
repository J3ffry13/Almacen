// import {Injectable} from '@angular/core';
// import {
//     CanActivate,
//     CanActivateChild,
//     Route,
//     ActivatedRouteSnapshot,
//     RouterStateSnapshot,
//     UrlTree,
//     Router
// } from '@angular/router';
// import { LoginService } from '@services/login.service';
// import {Observable} from 'rxjs';

// @Injectable({
//     providedIn: 'root'
// })
// export class NonAuthGuard implements CanActivate, CanActivateChild {
//     constructor(private router: Router, private loginService: LoginService) {}

//     canActivate(
//         next: ActivatedRouteSnapshot,
//         state: RouterStateSnapshot
//     ):
//         | Observable<boolean | UrlTree>
//         | Promise<boolean | UrlTree>
//         | boolean
//         | UrlTree {
//             console.log('no autorizado : ', localStorage.getItem('token'));
//         if (this.loginService.getToken() == null) {
//             console.log('entro aqui');
//             return true;
//         }
//         this.router.navigate(['/login']);
//         return false;
//     }
//     canActivateChild(
//         next: ActivatedRouteSnapshot,
//         state: RouterStateSnapshot
//     ):
//         | Observable<boolean | UrlTree>
//         | Promise<boolean | UrlTree>
//         | boolean
//         | UrlTree {
//         return this.canActivate(next, state);
//     }
// }
