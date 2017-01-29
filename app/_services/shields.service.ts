/**
 * http://shields.io/
 */
import {Injectable} from '@angular/core';
import { Http } from '@angular/http';
import {Observable} from "rxjs/Rx";

@Injectable()
export class ShieldsService {
    static badges:Array<string> = [
        'https://img.shields.io/packagist/dm/', //download month
        'https://img.shields.io/packagist/dd/', //download day
        'https://img.shields.io/packagist/dt/', //download total
    ];

    static includes:Array<string> = [
        'https://img.shields.io/github/stars/', //Github Stars
        'https://img.shields.io/github/forks/', //Github Forks
        'https://img.shields.io/github/issues/', //Github Forks
    ];

    constructor(
        private http: Http
    ){}

    getBadges(repo: string, callback: (badges:Array<string>) => any){
        let badges = ShieldsService.badges;
        let requests = [];
        for(let i in badges){
            let url = badges[i]+repo+'.json';
            requests.push(this.http.get(url).map(response => response.json()));
        }

        // https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md
        Observable.forkJoin(requests).subscribe(
            responses => {
                let includes:Array<string> = ShieldsService.includes.slice(0);
                for(let i=0; i<responses.length; i++){
                    let response = responses[i];
                    if(response.value != "invalid" && parseInt(response.value) != 0){
                        includes.push(badges[i]);
                    }
                }
                includes = includes.map(function(s) {
                    return s+repo+'.svg';
                });
                callback(includes);
            }
        );
    }

}