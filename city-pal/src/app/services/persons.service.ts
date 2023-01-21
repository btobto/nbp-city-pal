import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { Person } from '../models';

import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PersonsService {
  public user$: BehaviorSubject<Person>;

  constructor(private http: HttpClient) {
    const user = window.localStorage.getItem('user');
    if (user !== null) {
      this.user$.next(JSON.parse(user));
    }

    this.user$.subscribe((user: Person) => {
      window.localStorage.setItem('user', JSON.stringify(user));
    });
  }

  search(text: string): Observable<Person[]> {
    return this.http.get<Person[]>(
      environment.API_URL + '/Search/' + text.trim().toLowerCase()
    );
  }

  create(name: string, email: string): Observable<Person> {
    return this.http.post<Person>(
      environment.API_URL +
        '/Persons/Search/' +
        name.trim() +
        '/' +
        email.trim(),
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
    return this.http.delete(
      environment.API_URL + '/Persons/Friends/' + idFirst + '/' + idSecond
    );
  }

  login(email: string) {
    this.http
      .get<Person>(environment.API_URL + '/Persons/Login/' + email)
      .subscribe(this.user$);
  }

  register(email: string, name: string) {
    this.http
      .get<Person>(`${environment.API_URL}/Persons/Register/${name}/${email}`)
      .subscribe(this.user$);
  }
}
