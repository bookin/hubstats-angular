import {Component, OnInit, ElementRef} from '@angular/core';
import {GithubService} from './_services/github.service';
import {AuthenticationService} from './_services/authentication.service';
import {Observable} from "rxjs/Rx";

@Component({
    moduleId: module.id,
    templateUrl: `./templates/dashboard.component.html`
})

export class DashboardComponent  implements OnInit  {
    public owner: string = '';
    public repositories: Array<Object>;

    STORAGE_ID = 'repositories';
    STORAGE_TIMESTAMP = 'expiration_time';
    STORAGE_TIME_LIVE = 60*30*1000; //milliseconds

    constructor(
        private githubService: GithubService,
        private authenticationService: AuthenticationService
    ) {
        githubService.accessToken = authenticationService.getAccessToken();
    }

    ngOnInit() {
        //localStorage.removeItem(this.STORAGE_ID);
        let expiration_time = parseInt(localStorage.getItem(this.STORAGE_TIMESTAMP));
        let localRepositories = localStorage.getItem(this.STORAGE_ID);

        if( localRepositories !== null && localRepositories !== "" && (expiration_time && (expiration_time > parseInt(new Date().getTime().toString()))) ){
            this.repositories = JSON.parse(localRepositories);
            this.sortRepositories();
        }else{
            this.githubService.getUserInfo().subscribe(
                user => {
                    this.owner = user.login;
                    this.githubService.getOwnerRepositories(this.owner).subscribe(
                        repositories => {
                            this.repositories = [];
                            for(let i in repositories){
                                //if(parseInt(i) > 3){break;}

                                Observable.forkJoin([
                                    this.githubService.getRepoTraffic(this.owner, repositories[i]['name']),
                                    this.githubService.getRepoReferrers(this.owner, repositories[i]['name'])
                                ]).subscribe(
                                    response => {
                                        let traffic = response[0];
                                        let referrers = response[1];

                                        traffic['name']=repositories[i]['name'];
                                        traffic['owner']=this.owner;
                                        traffic['referrers']=referrers;

                                        let views = traffic['views'];
                                        let data: Array<Object> = [];
                                        if(views.length) {
                                            traffic['firstDate'] = views[0]['timestamp'];
                                            traffic['lastDate'] = views[views.length - 1]['timestamp'];
                                            let dateRange = DashboardComponent.getDateRange(traffic['firstDate'], traffic['lastDate']);
                                            for (let v in views) {
                                                let date = new Date(views[v]['timestamp']);
                                                let time = date.getTime();
                                                if (typeof dateRange[time] !== 'undefined') {
                                                    dateRange[time]['x'] = date;
                                                    dateRange[time]['count'] = views[v]['count'];
                                                    dateRange[time]['uniques'] = views[v]['uniques'];
                                                }
                                            }
                                            for (let d in dateRange) {
                                                if (typeof dateRange[d]['x'] === 'undefined') {
                                                    let date = new Date();
                                                    date.setTime(parseInt(d));
                                                    dateRange[d]['x'] = date;
                                                }
                                                data.push(dateRange[d]);
                                            }
                                        }
                                        traffic['data']=data.length?JSON.stringify(data):'';
                                        this.repositories.push(traffic);
                                        this.sortRepositories();

                                        let now = new Date();
                                        now.setTime(now.getTime() + this.STORAGE_TIME_LIVE);
                                        localStorage.setItem(this.STORAGE_TIMESTAMP, now.getTime().toString());
                                        localStorage.removeItem(this.STORAGE_ID);
                                        localStorage.setItem(this.STORAGE_ID, JSON.stringify(this.repositories));
                                    },
                                    error => {
                                        console.log(JSON.stringify(error.json()));
                                    },
                                    () => {
                                        console.log("the all subscriptions is completed");
                                    }
                                );

                                /*this.githubService.getRepoTraffic(this.owner, repositories[i]['name']).subscribe(t =>{
                                    let traffic = t;
                                    this.githubService.getRepoReferrers(this.owner, repositories[i]['name']).subscribe(r =>{

                                    });
                                });*/
                            }

                        }
                    );
                },
                error => {
                    console.log(JSON.stringify(error.json()));
                },
                () => {
                    console.log("the subscription is completed");
                }
            );
        }
    }

    static getDateRange(start: string, end: string) {
        let dateArray: Object = {};

        let startDate = new Date(start);
        startDate.setDate(startDate.getDate() - 1);

        let endDate = new Date(end);
        endDate.setDate(endDate.getDate() + 1);

        while (startDate <= endDate) {
            dateArray[startDate.getTime()]={'count':0, 'uniques':0};
            startDate.setDate(startDate.getDate() + 1);
        }

        return dateArray;
    }

    sortRepositories(){
        this.repositories.sort((a: Object, b: Object)=>{
            return b['count'] - a['count'];
        });

        /*this.repositories.sort((a: Object, b: Object)=>{
            return b['lastDate'] - a['lastDate'];
        });*/
    }
}