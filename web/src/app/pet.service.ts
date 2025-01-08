import {Injectable} from '@angular/core';
import {ApiService, Pet, Time} from './api/api.service';
import {first, map, mergeMap, Observable} from 'rxjs';
import {AuthService} from './auth.serivce';
import {endOfYesterday} from 'date-fns';

export interface NextFeeding {
  nextFeedingTime?: Time
  nextIsTomorrow?: boolean
  missedFeedingTime?: Time
}

@Injectable({
  providedIn: 'root'
})
export class PetService {
  constructor(
    private readonly authService: AuthService,
    private readonly apiService: ApiService) {
  }

  private before(t1: Time, t2: Time) {
    return (t1.hour < t2.hour) || ((t1.hour == t2.hour) && (t2.minute < t2.minute))
  }

  // Evaluate a feeding time based on the current time
  private evalFeedTime(feedTime: Time, now: Time): NextFeeding {
    if (this.before(now, feedTime)) {
      return { nextFeedingTime: feedTime}
    }
    // Late
    return { missedFeedingTime: feedTime }
  }

  // Determine the next feeding time and day
  evalNextFeeding(pet: Pet): NextFeeding {
    const nowDate = new Date()
    const now: Time = {
      hour: nowDate.getHours(),
      minute: nowDate.getMinutes(),
    }

    const events = pet.events ?? []

    if (!events.length) {
      // New pet registration, ignore feeding time if it already happened today
      // so that it doesn't evaluate to missed
      if (pet.feedTimes.length == 2) {
        if (this.before(now, pet.feedTimes[0])) {
          return { nextFeedingTime: pet.feedTimes[0] }
        }
        if (this.before(now, pet.feedTimes[1])) {
          return { nextFeedingTime: pet.feedTimes[1] }
        }
        return { nextFeedingTime: pet.feedTimes[0], nextIsTomorrow: true }
      }
      if (this.before(now, pet.feedTimes[0])) {
        return { nextFeedingTime: pet.feedTimes[0] }
      }
      return { nextFeedingTime: pet.feedTimes[0], nextIsTomorrow: true }
    }

    // Get the events that happened today
    const todayEvents = events.filter(e => new Date(e.timestamp) > endOfYesterday())

    if (pet.feedTimes.length == 2) {
      // Pet has two feeding times
      switch (todayEvents.length) {
        case 2:
          return {nextFeedingTime: pet.feedTimes[0], nextIsTomorrow: true}
        case 1:
          return this.evalFeedTime(pet.feedTimes[1], now)
        default:
          return this.evalFeedTime(pet.feedTimes[0], now)
      }
    }

    // Pet has one feeding time
    if (todayEvents.length > 0) {
      return {nextFeedingTime: pet.feedTimes[0], nextIsTomorrow: true}
    } else {
      return this.evalFeedTime(pet.feedTimes[0], now)
    }
  }

  getOnePetForCurrentUser(): Observable<Pet | undefined> {
    return this.getAllPetsForCurrentUser().pipe(
      map(pets => pets?.length ? pets[0] : undefined))
  }

  getAllPetsForCurrentUser(): Observable<Pet[]> {
    return this.getPets(this.authService.userId).pipe(first())
  }

  getPets(ownerId: string): Observable<Pet[]> {
    return this.apiService.getPetsForOwner(ownerId).pipe(first())
  }

  addPetForCurrentUser(pet: Pet): Observable<Pet> {
    return this.apiService.addPet(this.authService.userId, pet).pipe(first())
  }

  getPet(petId: string, events: boolean = false): Observable<Pet> {
    return this.apiService.getPet(petId, events).pipe(first())
  }

  feed(petId: string): Observable<Pet> {
    return this.apiService.addEventForPet(petId, {
        timestamp: Date.now(),
        type: 'feed',
      }
    ).pipe(
      mergeMap(() => this.getPet(petId, true)),
      first())
  }
}
