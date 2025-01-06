import {Injectable} from '@angular/core';
import {ApiService, Pet, PetEvent} from './api/api.service';
import {first, map, Observable} from 'rxjs';
import {AuthService} from './auth.serivce';

@Injectable({
  providedIn: 'root'
})
export class PetService {

  constructor(
    private readonly authService: AuthService,
    private readonly apiService: ApiService) { }

  private currentUser(): string { return this.authService.user!.id}

  getOnePetForCurrentUser(): Observable<Pet | undefined> {
    return this.getAllPetsForCurrentUser().pipe(
      map(pets => pets?.length ? pets[0] : undefined))
  }

  getAllPetsForCurrentUser(): Observable<Pet[]> {
    return this.getPets(this.currentUser()).pipe(first())
  }

  getPets(ownerId: string): Observable<Pet[]> {
    return this.apiService.getPetsForOwner(ownerId).pipe(first())
  }

  addPetForCurrentUser(pet: Pet): Observable<Pet> {
    return this.apiService.addPet(this.currentUser(), pet).pipe(first())
  }

  getPet(petId: string, events: boolean = false): Observable<Pet> {
    return this.apiService.getPet(petId, events).pipe(first())
  }

  getEventsForPet(petId: string): Observable<PetEvent[]> {
    return this.apiService.getEventsForPet(petId).pipe(first())
  }
}
