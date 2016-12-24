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
var http_1 = require("@angular/http");
var router_1 = require("@angular/router");
var app_config_1 = require("../app.config");
require("rxjs/add/operator/map");
var AuthenticationService = (function () {
    function AuthenticationService(http, router) {
        this.http = http;
        this.router = router;
    }
    AuthenticationService.prototype.isGuest = function () {
        return !localStorage.getItem('access_token');
    };
    AuthenticationService.prototype.getAccessToken = function () {
        return localStorage.getItem('access_token');
    };
    AuthenticationService.prototype.getAuthLink = function () {
        return 'https://github.com/login/oauth/authorize?client_id=3ec3571980c809699211&redirect_uri=http://hubstat.loc/login&scope=repo';
    };
    AuthenticationService.prototype.requestAccessToken = function (code) {
        if (!localStorage.getItem('access_token') && code) {
            return this.http.get(app_config_1.AppConfig.BACKEND_URL + "/token/" + code).map(function (response) {
                var token = response.json();
                if (token && token.access_token) {
                    localStorage.setItem('access_token', token.access_token);
                }
            });
        }
    };
    AuthenticationService.prototype.logout = function () {
        localStorage.removeItem('access_token');
    };
    return AuthenticationService;
}());
AuthenticationService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http, router_1.Router])
], AuthenticationService);
exports.AuthenticationService = AuthenticationService;
//# sourceMappingURL=authentication.service.js.map