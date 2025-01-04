import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {domainServiceRoot, handleError} from './api-utils';
import {catchError, Observable} from 'rxjs';

export interface Pet {
    name: string,
    type: string,
    birthday: string,
}

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    readonly baseUrl = `${domainServiceRoot()}`

    constructor(private http: HttpClient) {
    }

    getPetsForOwner(ownerId: string): Observable<Pet[]> {
        return this.http.get<Pet[]>(`${this.baseUrl}/owners/${ownerId}/pets`, {})
            .pipe(catchError(handleError))
    }
}
