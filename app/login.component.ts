import {Component, OnInit, ViewEncapsulation, Compiler } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { AuthenticationService } from './_services/authentication.service';
import 'rxjs/add/operator/map';

@Component({
    moduleId: module.id,
    selector: 'body',
    templateUrl: `./templates/login.component.html`,
    styleUrls: ['./../css/login.css'],
    //encapsulation: ViewEncapsulation.None,
})
export class LoginComponent  implements OnInit  {
    returnUrl: string;

    constructor(
        private activeRoute: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        // private _compiler: Compiler
    ) {}

    ngOnInit() {
        //this._compiler.clearCache();
        //this.authenticationService.logout();
        this.returnUrl = this.activeRoute.snapshot.queryParams['returnUrl'] || '/';

        this.activeRoute.queryParams.subscribe(
            params =>{
                let code = params['code'];
                if(!localStorage.getItem('access_token') && code){
                    this.authenticationService.requestAccessToken(code).subscribe(
                            response => {
                                this.router.navigate([this.returnUrl]);
                            },
                            error => {
                                console.log(JSON.stringify(error.json()));
                                this.router.navigate([this.returnUrl]);
                            },
                            () => {
                                console.log("the subscription is completed");
                            }
                        );
                }else{
                    /** TODO: NEED add error Alerts*/
                    console.error('NEED add Alerts');
                }
            }
        );
    }
}
