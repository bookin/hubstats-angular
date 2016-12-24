import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './_services/authentication.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-logout',
    template: ``
})
export class LogoutComponent implements OnInit {

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) {}

    ngOnInit() {
        this.authenticationService.logout();
        this.router.navigate(['/']);
    }
}