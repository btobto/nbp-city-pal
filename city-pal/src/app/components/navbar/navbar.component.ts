import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Person } from 'src/app/models';
import { PersonsService } from 'src/app/services/persons.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  user$: Observable<Person | null>;

  constructor(private personsService: PersonsService, private router: Router) {
    this.user$ = this.personsService.user$;
  }

  redirectToProfile(id: string) {
    this.router.navigate(['/person/' + id]);
  }

  redirectHome() {
    this.router.navigate(['/home']);
  }
}
