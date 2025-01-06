import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AngularFireModule} from "@angular/fire/compat";
import {AngularFireAuthModule, USE_EMULATOR as USE_AUTH_EMULATOR} from "@angular/fire/compat/auth";
import {environment} from "../environments/environment";
import {LoginComponent} from './login/login.component';
import {ReactiveFormsModule} from '@angular/forms';
import {NgbModule, NgbTimepickerModule} from '@ng-bootstrap/ng-bootstrap';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {authInterceptor} from './api/api-utils';
import {HomeComponent} from './home/home.component';
import {EditPetComponent} from './edit-pet/edit-pet.component';
import {PetComponent} from './pet/pet.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    EditPetComponent,
    PetComponent
  ],
  imports: [
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebase),
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    NgbTimepickerModule
  ],
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])),
    {
      provide: USE_AUTH_EMULATOR,
      useValue: environment.useEmulators ? ['http://localhost:9099'] : undefined
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
