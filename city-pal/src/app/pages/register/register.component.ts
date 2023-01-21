import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  email: string | null = null;
  name: string | null = null;

  constructor() {}

  ngOnInit(): void {}

  register() {
    throw new Error('Method not implemented.');
  }
}
