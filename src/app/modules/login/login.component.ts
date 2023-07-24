import {
    Component,
    OnInit,
    OnDestroy,
    Renderer2,
    HostBinding
} from '@angular/core';
import {UntypedFormGroup, UntypedFormControl, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {CurrentUser} from '@/Models/auth/auth.model';
import {NgxPermissionsService} from 'ngx-permissions';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {FirebaseCodeErrorService} from '@services/firebase-code-error.service';
import { LoginService } from '@services/auth/login.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
    // @HostBinding('class') class = 'login-box';
    public loginForm: UntypedFormGroup;
    public isAuthLoading = false;
    private user: CurrentUser;

    constructor(
        private toastr: ToastrService,
        private router: Router,
        private loginService: LoginService,
        private permissionsService: NgxPermissionsService,
        private afAuth: AngularFireAuth,
        private firebaseError: FirebaseCodeErrorService
    ) {}

    ngOnInit() {
        this.loginForm = new UntypedFormGroup({
            email: new UntypedFormControl(null, Validators.required),
            password: new UntypedFormControl(null, Validators.required)
        });
    }

    loginByAuth() {
        this.isAuthLoading = true;
        var usuario = {
            user: '',
            password: ''
        };
        usuario.user = this.loginForm.value.email;
        usuario.password = this.loginForm.value.password;

        //ENVIO DATOS A FIREBASE
        this.afAuth
            .signInWithEmailAndPassword(usuario.user, usuario.password)
            .then((user) => {
                if (user.user?.emailVerified) {
                    localStorage.setItem('user', usuario.user);
                    this.router.navigate(['/configuracion/trabajadores']);
                } else {
                    //   this.router.navigate(['/verificar-correo']);
                    this.toastr.warning('Le falta verificar su correo', 'Advertencia');
                }
                this.isAuthLoading = false;
            })
            .catch((error) => {
                this.isAuthLoading = false;
                this.toastr.error(
                    this.firebaseError.codeError(error.code),
                    'Error'
                );
            });
    }

    ngOnDestroy() {
    }
}
