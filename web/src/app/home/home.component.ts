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

  protected pet: Pet | undefined

  constructor(
    public readonly authService: AuthService,
    public readonly petService: PetService,
    private readonly router: Router)  {}

  ngOnInit(): void {
    if (this.authService.user) {
      this.petService.getPetsForCurrentUser().subscribe(pets => {
        this.pet = pets.length > 0 ? pets[0] : undefined
      })
    }
  }
}
