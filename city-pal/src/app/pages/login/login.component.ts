import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  email: string | null = null;
  password: string | null = null;

  constructor() {}

  ngOnInit(): void {}

  login() {
    throw new Error('Method not implemented.');
  }
}
