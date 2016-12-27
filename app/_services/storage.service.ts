import {Injectable} from '@angular/core';

@Injectable()
export class StorageService {

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
     */
    setItem(key:string, data:string){
        localStorage.setItem(key, data);
    }

    /**
     * @param key
     */
    removeItem(key:string){
        localStorage.removeItem(key);
    }
}