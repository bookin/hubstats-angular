import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import {Router} from '@angular/router';
import {AppConfig} from '../app.config';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthenticationService {
    constructor(private http: Http, private router: Router) { }

    isGuest(){
        return !localStorage.getItem('access_token');
    }

    getAccessToken(){
        return localStorage.getItem('access_token');
    }

    getAuthLink(){
        return `https://github.com/login/oauth/authorize?client_id=${AppConfig.GITHUB_CLIENT_ID}&redirect_uri=${AppConfig.BACKEND_URL}/login&scope=repo,repo:status`;
    }

    requestAccessToken(code: string){
        if(!localStorage.getItem('access_token') && code){
            return this.http.get(`${AppConfig.BACKEND_URL}/token/`+code).map(response => {
                let token = response.json();
                if(token && token.access_token){
                    localStorage.setItem('access_token', token.access_token);
                }
            });
        }
    }

    logout() {
        localStorage.removeItem('access_token');
    }
}