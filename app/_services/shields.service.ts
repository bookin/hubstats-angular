/**
 * http://shields.io/
 * FontAwesome png - https://github.com/encharm/Font-Awesome-SVG-PNG/tree/master/white/png/16
 * Convert to base64 - http://jsfiddle.net/handtrix/YvQ5y/
 */
import {Injectable} from '@angular/core';
import { Http } from '@angular/http';
import {Observable} from "rxjs/Rx";

@Injectable()
export class ShieldsService {
    static badges:Array<any> = [
        {'url':'https://img.shields.io/packagist/dm/', 'logo':''}, //download month
        {'url':'https://img.shields.io/packagist/dd/', 'logo':''}, //download day
        {'url':'https://img.shields.io/packagist/dt/', 'logo':''}, //download total
    ];

    static includes:Array<any> = [
        //Github Stars
        {'url':'https://img.shields.io/github/stars/', 'logo':'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABC0lEQVQ4T5WTPwtBURjGnU0ZGZBM5BMYmJR8DYuRrESJUMwymnwMgwwYfAIpg5SFVUzH7+iQP/dcx62n073P+/zOe99zr/C4XFJKH7YUQpxNZeIHYKh8AMW/AeweIrRVeRQDsneCGDsAMCBQ0qEBgLI1gHCU4jXy6tCFNQFk9wm5d0CgwJJEca2Ibv21XnKjXmOjtQI4egA6PKy7DdTBawNoPGdAFxWKepaQPuHq/YTeerSDNAm3HrmvU6CTBWbK0MmScPrVcwIcKAgaAAcAYSOA3f2Yxx9zCAA5Ob4CgAzGVJtz1hq6oi7K6ucZADMTII+hvr46RZOPAec0SH2VY+MQLY/xWeb6N9rAbmB7UhHq1zf9AAAAAElFTkSuQmCC'},
        //Github Forks
        {'url':'https://img.shields.io/github/forks/', 'logo':'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABB0lEQVQ4T6WTuw4BQRSGTeMdVAqhkCjQqEREpaClkHgAvUanoPAGRIFEFBo6HoJEr1O4lBSq9Z1kNtnd7DUm+TKbc87/z5nZGRX7cyin3jCMDLEi7JVS7yB/mwHiBIID7CCPQV0MiMeZqnAhdrOaOg1yJEfQgy3F0okYbJnuUIYK8Zdp4raFBckONCjca4OT7mDGPCR+9jPokxxDisKrNmgzL6UraBE3ohrUEBylM8QrzzPQq9k6YP9Z4mtIQxKDZ1iDIYWycgm+0EW8sYrl2+0QzQ4k/4A5TM3ziGIwoHiCUFb3HH6/sYlYLpTvCHWRQnfgdZVDG+jfKI+pAPKYPpG2EFTslv8BR+dsET5OO9sAAAAASUVORK5CYII='},
        //Github issues
        {'url':'https://img.shields.io/github/issues/', 'logo':'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAtUlEQVQ4T2NkAIL////zAalEIOYA8XGAy4yMjNvQ5RihBiQA6Vog3oNDczxQ/D0QbwfiFKBB/2DqYAakAQVcgBJh2AwAuvAdSB6IZwDxXSCOAar9C1JLigEmQPUfgHg3EF8AGpBMqgEgbz4FYiEgXgXEAUBDDhLrgvlADXZI3hMHsguBBswmygD0cAGGCcgFe4AGzBo1YFiFAaHMhJ4UQPmiGZgOFsDSATHZGdmQH0DOfKABnwBZYYsR6QLL2QAAAABJRU5ErkJggg=='},
    ];

    constructor(
        private http: Http
    ){}

    getBadges(repo: string, callback: (badges:Array<string>) => any){
        let badges = ShieldsService.badges;
        let requests = [];
        for(let i in badges){
            let url = badges[i].url+repo+'.json';
            requests.push(this.http.get(url).map(response => response.json()));
        }

        // https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md
        Observable.forkJoin(requests).subscribe(
            responses => {
                let includes:Array<string> = ShieldsService.includes.slice(0);
                for(let i=0; i<responses.length; i++){
                    let response = responses[i];
                    if(response.value != "invalid" && parseInt(response.value) != 0){
                        includes.push(this.makeUrlSVG(badges[i], repo));
                    }
                }
                let obj = this;
                includes = includes.map(function(s) {
                    if(typeof s == 'object'){
                        return obj.makeUrlSVG(s, repo);
                    }else{
                        return s;
                    }
                });
                callback(includes);
            }
        );
    }

    makeUrlSVG(obj:any, repo: string):string{
        let logo:string = null;
        if(obj.logo!=''){
            logo=encodeURIComponent(obj.logo);
        }
        return obj.url+repo+'.svg'+(logo?'?logo='+logo:'');
    }

}