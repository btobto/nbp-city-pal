import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Place } from '../models';
import { PlaceTypes } from '../transfer-models/';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  constructor(private http: HttpClient) {}

  search(name: string, searchParams: PlaceTypes) {
    return this.http.post<Place[]>(
      environment.API_URL + '/Places/Search/' + name,
      searchParams,
      environment.HTTP_OPTIONS
    );
  }

  recommended(personId: string): Observable<Place[]> {
    return this.http.get<Place[]>(environment.API_URL + '/Places/Recommended/' + personId);
  }
}
