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
var platform_browser_1 = require("@angular/platform-browser");
var http_1 = require("@angular/http");
var app_component_1 = require("./app.component");
var login_component_1 = require("./login.component");
var logout_component_1 = require("./logout.component");
var dashboard_component_1 = require("./dashboard.component");
var authentication_service_1 = require("./_services/authentication.service");
var github_service_1 = require("./_services/github.service");
var morris_area_directive_1 = require("./_directives/morris-area.directive");
var auth_guard_1 = require("./auth.guard");
var app_routing_1 = require("./app.routing");
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        imports: [
            platform_browser_1.BrowserModule,
            app_routing_1.Routing,
            http_1.HttpModule
        ],
        declarations: [
            app_component_1.AppComponent,
            login_component_1.LoginComponent,
            logout_component_1.LogoutComponent,
            dashboard_component_1.DashboardComponent,
            morris_area_directive_1.MorrisAreaDirective
        ],
        providers: [
            authentication_service_1.AuthenticationService,
            auth_guard_1.AuthGuard,
            github_service_1.GithubService
        ],
        bootstrap: [
            app_component_1.AppComponent
        ]
    }),
    __metadata("design:paramtypes", [])
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map