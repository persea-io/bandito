import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {domainServiceRoot, handleError} from './api-utils';
import {catchError, Observable} from 'rxjs';

export interface FeedTime {
  hour: number,
  minute: number
}

export interface Pet {
  name: string,
  type?: string | null | undefined,
  birthday?: string,
  feedTimes: FeedTime[]
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  readonly baseUrl = `${domainServiceRoot()}`

  constructor(private http: HttpClient) {}

  getPetsForOwner(ownerId: string): Observable<Pet[]> {
    return this.http.get<Pet[]>(`${this.baseUrl}/owners/${ownerId}/pets`, {})
      .pipe(catchError(handleError))
  }

  addPet(ownerId: string, pet: Pet): Observable<Pet> {
    return this.http.post<Pet>(`${this.baseUrl}/owners/${ownerId}/pets`, pet)
      .pipe(catchError(handleError))
  }
}
