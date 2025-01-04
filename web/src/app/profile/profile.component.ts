import {Component, OnInit} from '@angular/core';
import {AuthService, UserDetails} from '../auth.serivce';
import {PetService} from '../pet.service';
import {Pet} from '../api/api.service';
import {first} from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  public userDetails: UserDetails | undefined

  protected pets: Pet[] = []

  constructor(
    private readonly authService: AuthService,
    private readonly petService: PetService) {}

  public async ngOnInit() {
    this.userDetails = this.authService.user

    if (this.userDetails) {
      this.petService.getPets(this.userDetails.id).pipe(first()).subscribe(pets => {
        this.pets = pets
      })
    }
  }

}
