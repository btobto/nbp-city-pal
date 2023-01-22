import { Component, Input, OnInit } from '@angular/core';
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

  constructor(
    private reviewsService: ReviewsService,
    private placeService: PlacesService,
    private personService: PersonsService
  ) {
    if (this.place === null) {
      placeService.getPlace(this.review.placeId).subscribe((p) => (this.place = p));
    }
    if (this.person === null) {
      personService.getPerson(this.review.personId).subscribe((p) => (this.person = p));
    }
  }

  ngOnInit(): void {}

  editReview(rating: number, text: string) {
    this.review.rating = rating;
    this.review.comment = text;
    this.reviewsService.updateReview(this.review);
  }

  deleteReview() {
    this.reviewsService.deleteReview(this.review.personId, this.review.placeId);
  }
}
