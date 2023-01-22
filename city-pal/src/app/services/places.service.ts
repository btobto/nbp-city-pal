import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Point } from '../data-types';
import { Location, Place } from '../models';
import { SearchParams } from '../transfer-models';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  constructor(private http: HttpClient) {}

  getPlace(id: string): Observable<Place> {
    return this.http.get<Place>(environment.API_URL + '/Places/' + id);
  }

  search(name: string, searchParams: SearchParams): Observable<Place[]> {
    return this.http.post<Place[]>(
      environment.API_URL + '/Places/Search/' + name,
      searchParams,
      environment.HTTP_OPTIONS
    );
  }

  recommended(personId: string, location: Point): Observable<Place[]> {
    return this.http.post<Place[]>(
      environment.API_URL + '/Places/Recommended/' + personId,
      location,
      environment.HTTP_OPTIONS
    );
  }
}
