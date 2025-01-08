import {Component} from '@angular/core';
import {Pet} from '../api/api.service';
import {PetService} from '../pet.service';
import {Router} from '@angular/router';

@Component({
  selector: 'bandito-add-pet',
  template: '<bandito-edit-pet (onPetUpdated)="petAdded($event)"></bandito-edit-pet>',
  styleUrl: './add-pet.component.css'
})
export class AddPetComponent {

  constructor(
    private readonly petService: PetService,
    private readonly router: Router) { }

  petAdded(pet: Pet) {
    this.petService.addPetForCurrentUser(pet)
      .subscribe(pet => this.router.navigate(['/pet', pet.id]).then())
  }
}
