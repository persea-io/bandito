import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {HomeComponent} from './home/home.component';
import {PetComponent} from './pet/pet.component';
import {authGuard} from './auth.serivce';
import {AddPetComponent} from './add-pet/add-pet.component';

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "login", component: LoginComponent },
  { path: "addPet", component: AddPetComponent, canActivate: [authGuard] },
  { path: "pet/:petId", component: PetComponent, canActivate: [authGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}
