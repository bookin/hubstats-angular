import { NgModule }      from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { AppComponent }  from './app.component';
import { LoginComponent } from './login.component';
import { LogoutComponent } from './logout.component';
import { DashboardComponent } from './dashboard.component';

import { AuthenticationService } from './_services/authentication.service';
import { GithubService } from './_services/github.service';
import { StorageService } from './_services/storage.service';

import { MorrisAreaDirective } from './_directives/morris-area.directive';


import { AuthGuard } from './auth.guard';
import { Routing } from './app.routing';



@NgModule({
    imports:      [
        BrowserModule,
        Routing,
        HttpModule
    ],
    declarations: [
        AppComponent,
        LoginComponent,
        LogoutComponent,
        DashboardComponent,
        MorrisAreaDirective
    ],
    providers: [
        AuthenticationService,
        AuthGuard,
        GithubService,
        StorageService
    ],
    bootstrap:    [
        AppComponent
    ]
})
export class AppModule { }
