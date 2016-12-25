import { Component} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import { AuthenticationService } from './_services/authentication.service';

import {AppConfig} from './app.config';
import { Http } from '@angular/http';


@Component({
    moduleId: module.id,
    selector: 'app',
    templateUrl: `./templates/app.component.html`
})
export class AppComponent {
    name = 'Angular';
    isGuest = !localStorage.getItem('access_token');

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private http: Http
    ) {
        AppConfig.SET_ENV(http);

        router.events.subscribe((val) => {
            if (val instanceof NavigationEnd) {
                this.NavigationEnd();
            }
        });
    }

    NavigationEnd() {
        this.isGuest = !localStorage.getItem('access_token');
    }
}
