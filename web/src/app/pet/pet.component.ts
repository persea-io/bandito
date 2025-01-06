import {Component, OnDestroy, OnInit} from '@angular/core';
import {Pet, Time} from '../api/api.service';
import {PetService} from '../pet.service';
import {ActivatedRoute, Router} from '@angular/router';
import {retry, Subject, switchMap, takeUntil, timer} from 'rxjs';


@Component({
  selector: 'bandito-pet',
  templateUrl: './pet.component.html',
  styleUrl: './pet.component.css'
})
export class PetComponent implements OnInit, OnDestroy {
  readonly pollIntervalMillis = 5 * 60 * 1000

  protected pet: Pet | undefined

  protected nextFeedTime: {time: Time, tomorrow: boolean} | undefined

  private stopPolling = new Subject<void>()

  constructor(
    public readonly petService: PetService,
    private readonly router: Router,
    private readonly route: ActivatedRoute) {
  }

  ngOnInit(): void {
    const petId = this.route.snapshot.paramMap.get('petId');

    if (petId) {
      timer(0, this.pollIntervalMillis)
        .pipe(switchMap(() => this.petService.getPet(petId, true)),
          retry(),
          takeUntil(this.stopPolling))
        .subscribe(pet => pet && this.updatePet(pet))
    }
  }

  before(t1: Time, t2: Time) {
    return (t1.hour < t2.hour) || ((t1.hour == t2.hour) && (t2.minute < t2.minute))
  }

  updatePet(pet: Pet) {
    this.pet = pet

    if (this.pet.events?.length) {
      const lastFed = new Date(this.pet.events[0].timestamp)
    }
    const nowDate = new Date()

    if (pet.feedTimes?.length) {
      const now: Time = {
        hour: nowDate.getHours(),
        minute: nowDate.getMinutes(),
      }

      this.nextFeedTime = {
        time: pet.feedTimes[0],
        tomorrow: !this.before(now, pet.feedTimes[0])
      }
    }
  }

  ngOnDestroy() {
    this.stopPolling.next()
  }
}
