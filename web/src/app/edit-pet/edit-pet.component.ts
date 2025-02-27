import {Component, output} from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
import {PetService} from '../pet.service';
import {Pet} from '../api/api.service';
import {Router} from '@angular/router';

@Component({
  selector: 'bandito-edit-pet',
  templateUrl: './edit-pet.component.html',
  styleUrl: './edit-pet.component.css'
})
export class EditPetComponent {

  onPetUpdated = output<Pet>()

  twoFeedingTimes = false
  timeValidationError: string | null = null;

  constructor(
    private readonly petService: PetService,
    private readonly router: Router
  )  {}

  validateFeedTimes = (control: AbstractControl<NgbTimeStruct | null>): ValidationErrors | null => {
    if (this.twoFeedingTimes) {
      const t1 = this.addPetForm.controls.feedTimes.at(0).value!;
      const t2 = this.addPetForm.controls.feedTimes.at(1).value!;
      this.timeValidationError = ((t2.hour < t1.hour) || ((t2.hour === t1.hour) && (t2.minute <= t1.minute))) ?
        "Second feeding time must be after the first" : null
    }
    return this.timeValidationError ? { invalid: true } : null
  }

  protected addPetForm = new FormGroup({
    name: new FormControl(null, Validators.required),
    type: new FormControl(null),
    feedTimes: new FormArray([new FormControl<NgbTimeStruct | null>({hour: 6, minute:0, second:0}, this.validateFeedTimes)])
  })

  addFeedTime() {
    const firstFeedingTime = this.addPetForm.controls.feedTimes.at(0)
    let hour = firstFeedingTime.value?.hour ?? 0
    if (hour < 12) {
      hour += 12
    } else if (hour < 23) {
      hour += 1
    }
    const newTime = {
      hour: hour,
      minute: firstFeedingTime.value!.minute,
      second: 0
    }
    this.addPetForm.controls.feedTimes.insert(1, new FormControl(newTime, this.validateFeedTimes))
    this.twoFeedingTimes = true
  }

  removeFeedTime() {
    this.addPetForm.controls.feedTimes.removeAt(1)
    this.twoFeedingTimes = false
    this.timeValidationError = null
  }

  submit() {
    const formValues = this.addPetForm.getRawValue()
    const pet : Pet = {
      name: formValues.name!,
      type: formValues.type,
      feedTimes: formValues.feedTimes.map(ft => {
        return {hour: ft!.hour, minute: ft!.minute}
      })
    }
    this.onPetUpdated.emit(pet)
  }
}
