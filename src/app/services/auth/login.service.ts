import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from 'environments/environment';
import {JwtHelperService} from '@auth0/angular-jwt';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {Router} from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    myAppUrl: string;
    myApiUrl: string;

    constructor(private afAuth: AngularFireAuth, private router: Router) {}

    // getPermissions(usuario: any): Observable<any> {
    //   return this.http.post(this.myAppUrl + this.myApiUrl + 'obtenerPermisos', usuario);
    // }

    // async getUser() {
    //     const usuario = localStorage.getItem('user');
    //     this.afAuth.currentUser
    //         .then((user) => {
    //             if (
    //                 (user && user.emailVerified) ||
    //                 usuario !== undefined ||
    //                 usuario !== null
    //             ) {
    //                 console.log('retirn');
    //                 return usuario;
    //             } else {
    //                 this.router.navigate(['/auth/login']);
    //                 return ;
    //             }
    //         })
    //         .catch((error) => {
    //             console.log(error);
    //             return ;
    //         });
    // }

    async getUser(): Promise<string | null> {
        const usuario = localStorage.getItem('user');
        try {
          const user = await this.afAuth.currentUser;
          if ((user && user.emailVerified) || usuario !== undefined || usuario !== null) {
            return usuario;
          } else {
            this.router.navigate(['/auth/login']);
            return null;
          }
        } catch (error) {
          console.log(error);
          return null;
        }
      }
      
      
      
}
