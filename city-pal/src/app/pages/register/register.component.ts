import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PersonsService } from 'src/app/services/persons.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  email: string | null = null;
  name: string | null = null;

  constructor(private personsService: PersonsService, private router: Router) {}

  register() {
    if (this.email && this.name) {
      this.personsService
        .register(this.email, this.name)
        .subscribe((person) => {
          this.router.navigate(['/home']);
        });
    }
  }
}
