import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { City } from 'src/app/models';
import { PersonsService } from 'src/app/services/persons.service';
import { PlacesService } from 'src/app/services/places.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  email: string | null = null;
  name: string | null = null;

  selectedCity!: City;

  cities$: Observable<City[]>;

  constructor(
    private personsService: PersonsService,
    private placesService: PlacesService,
    private router: Router
  ) {
    this.cities$ = this.placesService
      .getCities()
      .pipe(tap((cities) => (this.selectedCity = cities[0])));
  }

  register() {
    if (this.email && this.name) {
      this.personsService
        .register({ cityId: this.selectedCity.id, email: this.email, name: this.name })
        .subscribe((person) => {
          this.router.navigate(['/home']);
        });
    }
  }

  redirectToLogin() {
    this.router.navigate(['/login']);
  }
}
