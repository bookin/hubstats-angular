"use strict";
var router_1 = require("@angular/router");
var login_component_1 = require("./login.component");
var logout_component_1 = require("./logout.component");
var dashboard_component_1 = require("./dashboard.component");
var auth_guard_1 = require("./auth.guard");
var routes = [
    { path: '', component: dashboard_component_1.DashboardComponent, canActivate: [auth_guard_1.AuthGuard] },
    { path: 'login', component: login_component_1.LoginComponent },
    { path: 'logout', component: logout_component_1.LogoutComponent }
];
exports.Routing = router_1.RouterModule.forRoot(routes);
//# sourceMappingURL=app.routing.js.map