import {Injectable} from '@angular/core';
import {ApiService, Pet} from './api/api.service';
import {first, Observable} from 'rxjs';
import {AuthService} from './auth.serivce';

@Injectable({
  providedIn: 'root'
})
export class PetService {

  constructor(
    private readonly authService: AuthService,
    private readonly apiService: ApiService) { }

  private currentUser(): string { return this.authService.user!.id}

  getPetsForCurrentUser(): Observable<Pet[]> {
    return this.getPets(this.currentUser()).pipe(first())
  }

  getPets(ownerId: string): Observable<Pet[]> {
    return this.apiService.getPetsForOwner(ownerId)
  }

  addPetForCurrentUser(pet: Pet): Observable<Pet> {
    return this.apiService.addPet(this.currentUser(), pet).pipe(first())
  }
}
