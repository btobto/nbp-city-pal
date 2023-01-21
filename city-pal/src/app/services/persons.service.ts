import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Person } from '../models';

import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PersonsService {
  constructor(private http: HttpClient) {}

  search(text: string): Observable<Person[]> {
    return this.http.get<Person[]>(environment.API_URL + '/search' + text.trim().toLowerCase());
  }

  create(name: string, email: string): Observable<Person> {
    return this.http.post<Person>(
      environment.API_URL + '/Persons/Search/' + name.trim() + '/' + email.trim(),
      {},
      environment.HTTP_OPTIONS
    );
  }

  addFriend(idFirst: string, idSecond: string) {
    return this.http.post(
      environment.API_URL + '/Persons/Friends/' + idFirst + '/' + idSecond,
      {},
      environment.HTTP_OPTIONS
    );
  }

  removeFriend(idFirst: string, idSecond: string) {
    return this.http.delete(environment.API_URL + '/Persons/Friends/' + idFirst + '/' + idSecond);
  }
}
