"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var authentication_service_1 = require("./_services/authentication.service");
require("rxjs/add/operator/map");
var LoginComponent = (function () {
    function LoginComponent(activeRoute, router, authenticationService) {
        this.activeRoute = activeRoute;
        this.router = router;
        this.authenticationService = authenticationService;
    }
    LoginComponent.prototype.ngOnInit = function () {
        var _this = this;
        //this._compiler.clearCache();
        //this.authenticationService.logout();
        this.returnUrl = this.activeRoute.snapshot.queryParams['returnUrl'] || '/';
        this.activeRoute.queryParams.subscribe(function (params) {
            var code = params['code'];
            if (!localStorage.getItem('access_token') && code) {
                _this.authenticationService.requestAccessToken(code).subscribe(function (response) {
                    _this.router.navigate([_this.returnUrl]);
                }, function (error) {
                    console.log(JSON.stringify(error.json()));
                    _this.router.navigate([_this.returnUrl]);
                }, function () {
                    console.log("the subscription is completed");
                });
            }
            else {
                /** TODO: NEED add error Alerts*/
                console.error('NEED add Alerts');
            }
        });
    };
    return LoginComponent;
}());
LoginComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'body',
        templateUrl: "./templates/login.component.html",
        styleUrls: ['./../css/login.css'],
    }),
    __metadata("design:paramtypes", [router_1.ActivatedRoute,
        router_1.Router,
        authentication_service_1.AuthenticationService])
], LoginComponent);
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.component.js.map