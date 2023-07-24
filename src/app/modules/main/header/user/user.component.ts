import {Component, OnInit} from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { LoginService } from '@services/auth/login.service';
import {DateTime} from 'luxon';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
    public user;

    constructor(private afAuth: AngularFireAuth,
        private router: Router) {}

    ngOnInit(): void {
        this.user = 'admin'//this.loginService.getTokenDecoded();
    }

    logout() {
        localStorage.removeItem('user');
        this.afAuth.signOut().then(() => this.router.navigate(['/auth/login']));
    }

    formatDate(date) {
        return DateTime.fromISO(date).toFormat('dd LLL yyyy');
    }
}
