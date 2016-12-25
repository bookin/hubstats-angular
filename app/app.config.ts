import { Http } from '@angular/http';

export class AppConfig {
    static ENV:Object;
    static GITHUB_CLIENT_ID: string;
    static GITHUB_CLIENT_SECRET_: string;

    public static get BACKEND_URL(): string { return AppConfig.HOST_NAME; }
    public static get HOST_NAME(): string { return location.origin; }
    public static SET_ENV(http:Http) {
        http.get(`${AppConfig.BACKEND_URL}/env/config`).map(response => response.json()).subscribe(
            response => {
                AppConfig.ENV = response;
                AppConfig.GITHUB_CLIENT_ID = response.GITHUB_CLIENT_ID || '';
                AppConfig.GITHUB_CLIENT_SECRET_ = response.GITHUB_CLIENT_SECRET_ || '';
            }
        )
    }
}