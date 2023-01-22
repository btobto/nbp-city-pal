import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Console } from 'console';
import { Observable } from 'rxjs';
import { Person, Place, Review } from 'src/app/models';
import { PersonsService } from 'src/app/services/persons.service';
import { PlacesService } from 'src/app/services/places.service';
import { ReviewsService } from 'src/app/services/reviews.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss'],
})
export class ReviewComponent implements OnInit {
  @Input() review!: Review;
  @Input() place: Place | null = null;
  @Input() person: Person | null = null;
  @Input() viewer!: Person;

  isPressed: boolean = false;

  constructor(
    private router: Router,
    public reviewsService: ReviewsService,
    private placeService: PlacesService,
    private personService: PersonsService
  ) {}

  ngOnInit(): void {
    if (this.place === null) {
      this.placeService.getPlace(this.review.placeId).subscribe((p) => (this.place = p));
    }
    if (this.person === null) {
      this.personService.getPerson(this.review.personId).subscribe((p) => (this.person = p));
    }
  }

  editReview() {
    this.reviewsService.updateReview(this.review).subscribe((r) => (this.review = r));
    this.isPressed = false;
  }

  deleteReview(reviews: Review[]) {
    this.reviewsService.deleteReview(this.review.personId, this.review.placeId).subscribe(() => {
      this.reviewsService.reviews$.next(
        reviews.filter(
          (review) =>
            review.personId !== this.review.personId && review.placeId !== this.review.placeId
        )
      );
    });
  }

  redirectToProfile(id: string) {
    this.router.navigate(['/person/' + id]);
  }

  redirectToPlace(id: string) {
    this.router.navigate(['/place/' + id]);
  }
}
