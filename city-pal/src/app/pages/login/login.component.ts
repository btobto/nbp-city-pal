import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';
import { alertErrors } from 'src/app/alert-errors';
import { PersonsService } from 'src/app/services/persons.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  email: string | null = null;

  constructor(private personsService: PersonsService, private router: Router) {}

  login() {
    if (this.email) {
      if (!(this.email && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.email))) {
        alert('Email is not valid.');

        return;
      }

      this.personsService.login(this.email).subscribe({
        next: (person) => {
          this.router.navigate(['/home']);
        },
        error: alertErrors,
      });
    }
  }

  redirectToRegister() {
    this.router.navigate(['/register']);
  }
}
