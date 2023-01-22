import { Injectable } from '@angular/core';
import { GeolocationService } from '@ng-web-apis/geolocation';
import { BehaviorSubject, switchMap, tap } from 'rxjs';
import { PlaceType } from '../data-types';
import { Person, Place } from '../models';
import { PersonsService } from './persons.service';
import { PlacesService } from './places.service';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  public personsSearchResults$ = new BehaviorSubject<Person[]>([]);
  public placesSearchResults$ = new BehaviorSubject<Place[]>([]);

  public searchParams$ = new BehaviorSubject<PlaceType[]>([]);

  constructor(
    private geolocation$: GeolocationService,
    private personsService: PersonsService,
    private placesService: PlacesService
  ) {}

  search(query: string) {
    this.personsService.search(query).subscribe((res) => {
      this.personsSearchResults$.next(res);
    });

    this.geolocation$
      .pipe(
        switchMap((position) => {
          const point = {
            srId: 4326,
            x: position.coords.latitude,
            y: position.coords.longitude,
          };
          return this.searchParams$.pipe(
            switchMap((searchParams) => {
              return this.placesService
                .search(query, { location: point, placeTypes: searchParams })
                .pipe(
                  tap((res) => {
                    this.placesSearchResults$.next(res);
                  })
                );
            })
          );
        })
      )
      .subscribe();
  }
}
