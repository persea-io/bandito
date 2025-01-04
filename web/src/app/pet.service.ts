import {Injectable} from '@angular/core';
import {ApiService, Pet} from './api/api.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PetService {

  constructor(private readonly apiService: ApiService) { }

  getPets(ownerId: string): Observable<Pet[]> {
    return this.apiService.getPetsForOwner(ownerId)
  }
}
