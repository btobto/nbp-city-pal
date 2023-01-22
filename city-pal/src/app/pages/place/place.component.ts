import { Component } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, tap } from 'rxjs';
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
  place$ = new Observable<Place>();
  placesReviews$ = new Observable<Review[]>();

  user$ = new Observable<Person | null>();

  constructor(
    private placesService: PlacesService,
    private reviewsService: ReviewsService,
    private personsService: PersonsService,
    private route: ActivatedRoute
  ) {
    this.route.paramMap.subscribe((paramMap) => {
      const id: string = paramMap.get('id')!;

      this.place$ = this.placesService.getPlace(id);
      this.placesReviews$ = this.reviewsService.reviewsForPlace(id);

      this.user$ = this.personsService.user$;
    });
  }

  hasReview(reviews: Review[], user: Person): boolean {
    return reviews.map((r) => r.personId).includes(user.id);
  }
}
