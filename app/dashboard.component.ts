/**
 * https://www.learnrxjs.io/operators/creation/of.html
 */
import {Component, OnInit} from '@angular/core';
import {GithubService} from './_services/github.service';
import {ShieldsService} from './_services/shields.service';
import {StorageService} from './_services/storage.service';
import {AuthenticationService} from './_services/authentication.service';
import {ActivatedRoute} from '@angular/router';
import {Observable} from "rxjs/Rx";

@Component({
    moduleId: module.id,
    templateUrl: `./templates/dashboard.component.html`
})

export class DashboardComponent  implements OnInit  {
    public login: string = '';
    public owner: Object;
    public repositories: Array<Object>;
    public languages: Array<any> = [];

    STORAGE_REPOSITORIES = 'repositories';
    STORAGE_OWNER = 'owner';
    STORAGE_TIME_LIVE = 60*30*1000; //milliseconds
    DEBUG = false;

    private repoPageNumber = 1;

    constructor(
        private githubService: GithubService,
        private shieldsService: ShieldsService,
        private authenticationService: AuthenticationService,
        private storage:StorageService,
        private activeRoute: ActivatedRoute
    ) {
        githubService.accessToken = authenticationService.getAccessToken();
    }

    ngOnInit() {
        this.activeRoute.params.subscribe(
            params =>{
                console.log(params['username']);
            }
        );

        if(this.login != ''){
            //load data from storage
        }else{
            //reload data
        }

        //this.storage.removeItem(this.STORAGE_REPOSITORIES);
        let localRepositories = this.storage.getItem(this.STORAGE_REPOSITORIES);

        if(!this.DEBUG && (localRepositories !== null && localRepositories !== "" && !this.storage.isTimeExpiration(this.STORAGE_REPOSITORIES))){
            this.repositories = JSON.parse(localRepositories);
            this.repositories['data']=this.sliceStringifyData(this.repositories['storage_data']);
            this.sortRepositories();
            this.owner = JSON.parse(this.storage.getItem(this.STORAGE_OWNER));
        }else{
            this.reloadData();
        }
    }

    loadFromStorage(){

    }

    reloadData(){
        this.githubService.getUserInfo().subscribe(
            user => {
                this.owner = user;
                let date_diff = new Date((<any>new Date()).getTime() - (<any>new Date(user.created_at)).getTime());
                this.owner['spent_years'] = date_diff.getUTCFullYear() - 1970;
                this.storage.removeItem(this.STORAGE_OWNER);
                this.storage.setItem(this.STORAGE_OWNER, JSON.stringify(this.owner));

                this.login = user.login;
                this.repositories = [];
                this.getRepositories(this.repoPageNumber);
            },
            error => {
                console.log(JSON.stringify(error.json()));
            },
            () => {
                console.log("the subscription is completed");
            }
        );
    }

    getRepositories(page: number){
        this.githubService.getOwnerRepositories(this.login, page).subscribe((result)=>this.processingRepositories(result));
    }

    processingRepositories(repositories:Array<any>){
        if(repositories.length){
            for(let i in repositories){
                if(this.DEBUG && (parseInt(i) > 5)){break;}

                Observable.forkJoin([
                    Observable.of({'name':repositories[i]['name']}),
                    this.githubService.getRepoTraffic(this.login, repositories[i]['name']),
                    this.githubService.getRepoReferrers(this.login, repositories[i]['name']),
                    this.githubService.getRepoLanguages(this.login, repositories[i]['name'])
                ]).subscribe(
                    response => {
                        let repoName = response[0].name;
                        let traffic = response[1];
                        let referrers = response[2];
                        let languages = response[3];

                        const sumValues = (obj: Object) => { return (<any>Object).values(obj).reduce((a: number, b:number) => a + b)};

                        if(Object.keys(languages).length){
                            let totalSum = sumValues(languages);
                            for(var lang in languages){
                                languages[lang] = {'name':lang, 'percent':((languages[lang]/totalSum)*100).toFixed(2)};
                                if(this.languages.indexOf(lang) == -1){
                                    this.languages.push(lang);
                                }
                            }
                            traffic['languages']=(<any>Object).values(languages);
                        }

                        traffic['name']=repoName;
                        traffic['owner']=this.login;
                        traffic['referrers']=referrers;

                        this.shieldsService.getBadges(`${traffic['owner']}/${traffic['name']}`, (badges)=>{
                            traffic['badges'] = badges;
                        });

                        let views = traffic['views'];
                        let data: Array<Object> = [];
                        if(views.length) {
                            traffic['firstDate'] = views[0]['timestamp'];
                            traffic['lastDate'] = views[views.length - 1]['timestamp'];
                            // let date_ago = new Date();
                            // date_ago.setDate(date_ago.getDate() - 7);
                            let dateRange = DashboardComponent.getDateRange(traffic['firstDate'], new Date().toString());
                            for (let v in views) {
                                let date = new Date(views[v]['timestamp']);
                                date.setHours(0,0,0,0);
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

                        traffic['storage_data']=data.length?data:'';
                        traffic['data']=this.sliceStringifyData(data);

                        this.repositories.push(traffic);
                        this.sortRepositories();

                        this.storage.removeItem(this.STORAGE_REPOSITORIES);
                        this.storage.setItem(this.STORAGE_REPOSITORIES, JSON.stringify(this.repositories), this.STORAGE_TIME_LIVE);
                    },
                    error => {
                        console.error(error);
                        //console.log(JSON.stringify(error.json()));
                    },
                    () => {
                        console.log("the all subscriptions is completed");
                    }
                );
            }
            this.repoPageNumber++;
            this.getRepositories(this.repoPageNumber);
        }
    }

    sliceStringifyData(storage_data:Array<any>):string{
        if(storage_data && storage_data.length){
            return JSON.stringify(storage_data.slice(Math.max(storage_data.length - 7, 0)));
        }else{
            return '';
        }
    }

    static getDateRange(start: string, end: string) {
        let dateArray: Object = {};

        let startDate = new Date(start);
        startDate.setDate(startDate.getDate() - 1);
        startDate.setHours(0,0,0,0);

        let endDate = new Date(end);
        endDate.setDate(endDate.getDate() + 1);
        endDate.setHours(0,0,0,0);

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
    }

    onRefreshData(event: any){
        event.preventDefault();
        this.reloadData();
    }
}