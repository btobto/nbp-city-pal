import { Component, OnDestroy } from '@angular/core';
import { GeolocationService } from '@ng-web-apis/geolocation';
import { BehaviorSubject, filter, Subscription, take, tap } from 'rxjs';
import { Place } from 'src/app/models';
import { PersonsService } from 'src/app/services/persons.service';
import { PlacesService } from 'src/app/services/places.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnDestroy {
  user$ = this.personsService.user$;
  recommendedPlaces$ = new BehaviorSubject<Place[]>([]);

  subscriptions: Subscription[] = [];

  constructor(
    private personsService: PersonsService,
    private placesService: PlacesService,
    public geolocation$: GeolocationService
  ) {
    const sub = this.user$.pipe(filter((user) => !!user)).subscribe((user) => {
      this.geolocation$.pipe(take(1)).subscribe((position) => {
        const point = {
          srId: 4326,
          x: position.coords.latitude,
          y: position.coords.longitude,
        };

        console.log(point);

        this.placesService
          .recommended(user!.id, point)
          .subscribe((places) => this.recommendedPlaces$.next(places));
      });
    });

    this.subscriptions.push(sub);
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }
}
