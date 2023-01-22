import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { alertErrors } from 'src/app/alert-errors';
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
      if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.email)) {
        alert('Email is not valid.');
        return;
      }

      if (this.name.length < 3) {
        alert('Name is not valid.');
        return;
      }

      this.personsService
        .register({ cityId: this.selectedCity.id, email: this.email, name: this.name })
        .subscribe({
          next: (person) => {
            this.router.navigate(['/home']);
          },
          error: alertErrors,
        });
    }
  }

  redirectToLogin() {
    this.router.navigate(['/login']);
  }
}
