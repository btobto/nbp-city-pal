import { Component } from '@angular/core';
import { Router } from '@angular/router';
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
      this.personsService.login(this.email).subscribe((person) => {
        this.router.navigate(['/home']);
      });
    }
  }

  redirectToRegister() {
    this.router.navigate(['/register']);
  }
}
