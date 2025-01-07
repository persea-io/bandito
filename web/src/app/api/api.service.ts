import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {domainServiceRoot, handleError} from './api-utils';
import {catchError, Observable} from 'rxjs';

export interface Time {
  hour: number,
  minute: number
}

export interface PetEvent {
  timestamp: number,
  type: string
}

export interface Pet {
  id?: string,
  name: string,
  type?: string | null | undefined,
  birthday?: string,
  feedTimes: Time[],
  events?: PetEvent[]
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

  getPet(petId: string, events: boolean = false) {
    return this.http.get<Pet>(`${this.baseUrl}/pets/${petId}?${events ? 'events' : ''}`)
      .pipe(catchError(handleError))
  }

  getEventsForPet(petId: string): Observable<PetEvent[]> {
    return this.http.get<PetEvent[]>(`${this.baseUrl}/${petId}/events`)
      .pipe(catchError(handleError))
  }

  addEventForPet(petId: string, event: PetEvent) {
    return this.http.post<PetEvent>(`${this.baseUrl}/pets/${petId}/events`, event)
      .pipe(catchError(handleError))
  }
}
