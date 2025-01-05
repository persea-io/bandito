import {Component, input} from '@angular/core';
import {Pet} from '../api/api.service';

@Component({
  selector: 'bandito-manage-pet',
  templateUrl: './manage-pet.component.html',
  styleUrl: './manage-pet.component.css'
})
export class ManagePetComponent {
  pet = input.required<Pet>()
}
