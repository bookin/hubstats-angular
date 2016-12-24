import {Injectable} from '@angular/core';
import { Http } from '@angular/http';
import {AppConfig} from '../app.config';

@Injectable()
export class GithubService {
    static apiUrl: String = 'https://api.github.com';
    public accessToken: String = '';


    constructor(
        private http: Http
    ){}

    getUserInfo(){
        return this.sendRequest('/user');
    }

    getOwnerRepositories(owner: string){
        return this.sendRequest('/users/'+owner+'/repos');
    }

    getRepoTraffic(owner: string, repo: string){
        //return this.sendRequest(`/repos/${owner}/${repo}/traffic/views`, {}, {'Accept':'application/vnd.github.spiderman-preview'});
        return this.http.get(`${AppConfig.BACKEND_URL}/github/getRepoTraffic/${this.accessToken}/${owner}/${repo}`).map(response => response.json());
    }

    getRepoReferrers(owner: string, repo: string){
        //return this.sendRequest('/repos/'+owner+'/'+repo+'/traffic/popular/referrers', {}, {'Accept':'application/vnd.github.spiderman-preview'});
        return this.http.get(`${AppConfig.BACKEND_URL}/github/getRepoReferrers/${this.accessToken}/${owner}/${repo}`).map(response => response.json());
    }

    sendRequest(method: string, data?: Object, headers?: Object){
        data = data || {};
        if(typeof data['access_token'] === "undefined"){
            data['access_token'] = this.accessToken;
        }
        let params = this.objectToParams(data);
console.info(GithubService.apiUrl+method+'?'+params);
        return this.http.get(GithubService.apiUrl+method+'?'+params).map(response => response.json(), { "headers":headers });
    }

    objectToParams(data: Object){
        return Object.keys(data).map(function(k) {
            return encodeURIComponent(k) + "=" + encodeURIComponent(data[k]);
        }).join('&');
    }
}