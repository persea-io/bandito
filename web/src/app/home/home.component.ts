import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../auth.serivce';
import {PetService} from '../pet.service';
import {takeWhile} from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  constructor(
    private readonly authService: AuthService,
    private readonly petService: PetService,
    private readonly router: Router)  {}

  ngOnInit(): void {
    this.authService.isLoading
      .pipe(takeWhile(authIsLoading => authIsLoading, true))
      .subscribe(authIsLoading => {
      if (!authIsLoading) {
        if (this.authService.loggedIn) {
          this.petService.getOnePetForCurrentUser().subscribe(pet => {
            this.router.navigate(pet ? ['/pet', pet.id] : ['/addPet']).then()
          })
        } else {
          this.router.navigate(['/login']).then()
        }
      }
    })
  }
}
