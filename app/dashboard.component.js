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
var github_service_1 = require("./_services/github.service");
var authentication_service_1 = require("./_services/authentication.service");
var Rx_1 = require("rxjs/Rx");
var DashboardComponent = DashboardComponent_1 = (function () {
    function DashboardComponent(githubService, authenticationService) {
        this.githubService = githubService;
        this.authenticationService = authenticationService;
        this.owner = '';
        this.STORAGE_ID = 'repositories';
        this.STORAGE_TIMESTAMP = 'expiration_time';
        this.STORAGE_TIME_LIVE = 60 * 30 * 1000; //milliseconds
        githubService.accessToken = authenticationService.getAccessToken();
    }
    DashboardComponent.prototype.ngOnInit = function () {
        var _this = this;
        //localStorage.removeItem(this.STORAGE_ID);
        var expiration_time = parseInt(localStorage.getItem(this.STORAGE_TIMESTAMP));
        var localRepositories = localStorage.getItem(this.STORAGE_ID);
        if (localRepositories !== null && localRepositories !== "" && (expiration_time && (expiration_time > parseInt(new Date().getTime().toString())))) {
            this.repositories = JSON.parse(localRepositories);
            this.sortRepositories();
        }
        else {
            this.githubService.getUserInfo().subscribe(function (user) {
                _this.owner = user.login;
                _this.githubService.getOwnerRepositories(_this.owner).subscribe(function (repositories) {
                    _this.repositories = [];
                    var _loop_1 = function (i) {
                        //if(parseInt(i) > 3){break;}
                        Rx_1.Observable.forkJoin([
                            _this.githubService.getRepoTraffic(_this.owner, repositories[i]['name']),
                            _this.githubService.getRepoReferrers(_this.owner, repositories[i]['name'])
                        ]).subscribe(function (response) {
                            var traffic = response[0];
                            var referrers = response[1];
                            traffic['name'] = repositories[i]['name'];
                            traffic['owner'] = _this.owner;
                            traffic['referrers'] = referrers;
                            var views = traffic['views'];
                            var data = [];
                            if (views.length) {
                                traffic['firstDate'] = views[0]['timestamp'];
                                traffic['lastDate'] = views[views.length - 1]['timestamp'];
                                var dateRange = DashboardComponent_1.getDateRange(traffic['firstDate'], traffic['lastDate']);
                                for (var v in views) {
                                    var date = new Date(views[v]['timestamp']);
                                    var time = date.getTime();
                                    if (typeof dateRange[time] !== 'undefined') {
                                        dateRange[time]['x'] = date;
                                        dateRange[time]['count'] = views[v]['count'];
                                        dateRange[time]['uniques'] = views[v]['uniques'];
                                    }
                                }
                                for (var d in dateRange) {
                                    if (typeof dateRange[d]['x'] === 'undefined') {
                                        var date = new Date();
                                        date.setTime(parseInt(d));
                                        dateRange[d]['x'] = date;
                                    }
                                    data.push(dateRange[d]);
                                }
                            }
                            traffic['data'] = data.length ? JSON.stringify(data) : '';
                            _this.repositories.push(traffic);
                            _this.sortRepositories();
                            var now = new Date();
                            now.setTime(now.getTime() + _this.STORAGE_TIME_LIVE);
                            localStorage.setItem(_this.STORAGE_TIMESTAMP, now.getTime().toString());
                            localStorage.removeItem(_this.STORAGE_ID);
                            localStorage.setItem(_this.STORAGE_ID, JSON.stringify(_this.repositories));
                        }, function (error) {
                            console.log(JSON.stringify(error.json()));
                        }, function () {
                            console.log("the all subscriptions is completed");
                        });
                        /*this.githubService.getRepoTraffic(this.owner, repositories[i]['name']).subscribe(t =>{
                            let traffic = t;
                            this.githubService.getRepoReferrers(this.owner, repositories[i]['name']).subscribe(r =>{

                            });
                        });*/
                    };
                    for (var i in repositories) {
                        _loop_1(i);
                    }
                });
            }, function (error) {
                console.log(JSON.stringify(error.json()));
            }, function () {
                console.log("the subscription is completed");
            });
        }
    };
    DashboardComponent.getDateRange = function (start, end) {
        var dateArray = {};
        var startDate = new Date(start);
        startDate.setDate(startDate.getDate() - 1);
        var endDate = new Date(end);
        endDate.setDate(endDate.getDate() + 1);
        while (startDate <= endDate) {
            dateArray[startDate.getTime()] = { 'count': 0, 'uniques': 0 };
            startDate.setDate(startDate.getDate() + 1);
        }
        return dateArray;
    };
    DashboardComponent.prototype.sortRepositories = function () {
        this.repositories.sort(function (a, b) {
            return b['count'] - a['count'];
        });
        /*this.repositories.sort((a: Object, b: Object)=>{
            return b['lastDate'] - a['lastDate'];
        });*/
    };
    return DashboardComponent;
}());
DashboardComponent = DashboardComponent_1 = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: "./templates/dashboard.component.html"
    }),
    __metadata("design:paramtypes", [github_service_1.GithubService,
        authentication_service_1.AuthenticationService])
], DashboardComponent);
exports.DashboardComponent = DashboardComponent;
var DashboardComponent_1;
//# sourceMappingURL=dashboard.component.js.map