import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Person } from 'src/app/models';
import { PersonsService } from 'src/app/services/persons.service';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss'],
})
export class PersonComponent implements OnInit {
  private person: Observable<Person>;

  constructor(private personService: PersonsService) {
    // this.person = personService.
  }

  ngOnInit(): void {}
}
