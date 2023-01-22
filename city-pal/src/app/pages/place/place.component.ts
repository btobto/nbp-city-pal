import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Person, Place, Review } from 'src/app/models';
import { PersonsService } from 'src/app/services/persons.service';
import { PlacesService } from 'src/app/services/places.service';
import { ReviewsService } from 'src/app/services/reviews.service';

@Component({
  selector: 'app-place',
  templateUrl: './place.component.html',
  styleUrls: ['./place.component.scss'],
})
export class PlaceComponent {
  place$: Observable<Place>;
  placesReviews$: Observable<Review[]>;

  user$: Observable<Person | null>;

  constructor(
    private placesService: PlacesService,
    private reviewsService: ReviewsService,
    private personsService: PersonsService,
    private route: ActivatedRoute
  ) {
    const id: string = this.route.snapshot.paramMap.get('id')!;

    this.place$ = this.placesService.getPlace(id);
    this.placesReviews$ = this.reviewsService.reviewsForPlace(id);

    this.user$ = this.personsService.user$;
  }
}
