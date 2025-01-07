import {Component, OnDestroy, OnInit} from '@angular/core';
import {Pet, Time} from '../api/api.service';
import {NextFeeding, PetService} from '../pet.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject, switchMap, takeUntil, timer} from 'rxjs';
import {isYesterday} from 'date-fns';


@Component({
  selector: 'bandito-pet',
  templateUrl: './pet.component.html',
  styleUrl: './pet.component.css'
})
export class PetComponent implements OnInit, OnDestroy {
  readonly pollIntervalMillis = 5 * 60 * 1000

  protected pet: Pet | undefined

  protected lastFeeding: Date | undefined
  protected nextFeeding: NextFeeding | undefined

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
          takeUntil(this.stopPolling))
        .subscribe(pet => pet && this.updatePet(pet))
    }
  }

  ngOnDestroy() {
    this.stopPolling.next()
  }

  protected updatePet(pet: Pet) {
    this.pet = pet
    this.nextFeeding = this.petService.evalNextFeeding(pet)
    this.lastFeeding = (pet.events?.length) ? new Date(pet.events[0].timestamp): undefined
  }

  protected formatTime(time: Time | undefined) {
    return (!time) ? '' :
      (time.hour > 12) ?
        `${time.hour - 12}:${String(time.minute).padStart(2, '0')} PM` :
        `${time.hour}:${String(time.minute).padStart(2, '0')} AM`
  }

  protected durationBefore(time: Time | undefined): string {
    if (!time) {
      return ''
    }
    const now = new Date()
    const nowHour = now.getHours()
    const nowMinute = now.getMinutes()

    let result: string = ''
    if (nowHour < time.hour-2) {
      result += String(time.hour - nowHour) + ' hours, '
    } else if (nowHour < time.hour-1) {
      result += '1 hour, '
    }

    let minDiff = time.minute - nowMinute
    if (time.minute === 0) {
      minDiff += 60
    }
    result += String(minDiff) + ' minutes'

    return result
  }

  protected feed() {
    if (this.pet?.id) {
      this.petService.feed(this.pet.id).subscribe(pet => this.updatePet(pet))
    }
  }

  protected readonly isYesterday = isYesterday;
}
