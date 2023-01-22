import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';
import { Person } from '../models';

import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { RegisterModel } from '../transfer-models';

@Injectable({
  providedIn: 'root',
})
export class PersonsService {
  public user$ = new BehaviorSubject<Person | null>(null);
  public usersFriends$ = new BehaviorSubject<Person[]>([]);

  public person$ = new BehaviorSubject<Person | null>(null);

  constructor(private http: HttpClient) {
    const user = window.localStorage.getItem('user');
    if (user !== null) {
      this.user$.next(JSON.parse(user));
    }

    this.user$.subscribe((user) => {
      if (user) {
        window.localStorage.setItem('user', JSON.stringify(user));

        this.personsFriends(user.id).subscribe((f) => this.usersFriends$.next(f));
      }
    });
  }

  getPerson(id: string): Observable<Person> {
    return this.http.get<Person>(environment.API_URL + '/Persons/' + id).pipe(
      tap((person) => {
        this.person$.next(person);
      })
    );
  }

  search(text: string): Observable<Person[]> {
    return this.http.get<Person[]>(
      environment.API_URL + '/Persons/Search/' + text.trim().toLowerCase()
    );
  }

  addFriend(idFirst: string, idSecond: string) {
    return this.http
      .post(
        environment.API_URL + '/Persons/Friends/' + idFirst + '/' + idSecond,
        {},
        environment.HTTP_OPTIONS
      )
      .pipe(tap(() => this.personsFriends(idFirst).subscribe((f) => this.usersFriends$.next(f))));
  }

  removeFriend(idFirst: string, idSecond: string) {
    return this.http
      .delete(environment.API_URL + '/Persons/Friends/' + idFirst + '/' + idSecond)
      .pipe(tap(() => this.personsFriends(idFirst).subscribe((f) => this.usersFriends$.next(f))));
  }

  personsFriends(id: string): Observable<Person[]> {
    return this.http.get<Person[]>(environment.API_URL + '/Persons/Friends/' + id);
  }

  login(email: string): Observable<Person> {
    return this.http
      .get<Person>(environment.API_URL + '/Persons/Login/' + email)
      .pipe(tap((user) => this.user$.next(user)));
  }

  register(registerModel: RegisterModel): Observable<Person> {
    return this.http
      .post<Person>(
        `${environment.API_URL}/Persons/Register`,
        registerModel,
        environment.HTTP_OPTIONS
      )
      .pipe(tap((user) => this.user$.next(user)));
  }
}
