import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../auth.serivce';
import {Pet} from '../api/api.service';
import {PetService} from '../pet.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  constructor(
    public readonly authService: AuthService,
    public readonly petService: PetService,
    private readonly router: Router)  {}

  navToPetPage(pet: Pet) {
    this.router.navigate(['/pet', pet.id]).then()
  }

  ngOnInit(): void {
    if (this.authService.user) {
      this.petService.getOnePetForCurrentUser().subscribe(pet => {
        if (pet) {
          this.navToPetPage(pet)
        }
      })
    }
  }

  petAdded(pet: Pet) {
    this.petService.addPetForCurrentUser(pet)
      .subscribe(pet => this.navToPetPage(pet))
  }
}
