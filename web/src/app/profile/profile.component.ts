import {Component, OnInit} from '@angular/core';
import {AuthService, UserDetails} from '../auth.serivce';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  public userDetails: UserDetails | undefined

  constructor(private readonly authService: AuthService) {}

  public async ngOnInit() {
    this.userDetails = this.authService.user
  }

}
