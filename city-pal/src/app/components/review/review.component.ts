import { Component, Input, OnInit, Output } from '@angular/core';
import { Console } from 'console';
import { Observable } from 'rxjs';
import { Person, Place, Review } from 'src/app/models';
import { PersonsService } from 'src/app/services/persons.service';
import { PlacesService } from 'src/app/services/places.service';
import { ReviewsService } from 'src/app/services/reviews.service';
import { EventEmitter } from 'stream';

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

  @Output() deleteReviewEmitter = new EventEmitter();

  isPressed: boolean = false;

  constructor(
    private reviewsService: ReviewsService,
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

  deleteReview() {
    this.reviewsService.deleteReview(this.review.personId, this.review.placeId).subscribe(() => {});
  }
}
