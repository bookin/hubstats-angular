import {Injectable} from '@angular/core';

@Injectable()
export class StorageService {

    EXPIRATION_KEY = '_expiration_time';

    constructor(
    ){}

    /**
     * @param key
     * @return {string|null}
     */
    getItem(key:string){
        return localStorage.getItem(key);
    }

    /**
     * @param key
     * @param data
     * @param expiration_time seconds
     */
    setItem(key:string, data:string, expiration_time?:number){
        localStorage.setItem(key, data);

        if(expiration_time){
            let now = new Date();
            now.setTime(now.getTime() + expiration_time);
            localStorage.setItem(key+this.EXPIRATION_KEY, now.getTime().toString());
        }
    }

    /**
     * @param key
     */
    removeItem(key:string){
        localStorage.removeItem(key);
    }

    isTimeExpiration(key:string):boolean{
        let expiration_time = parseInt(this.getItem(key+this.EXPIRATION_KEY));
        return !(expiration_time && (expiration_time > parseInt(new Date().getTime().toString())));
    }
}