import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Person, Place, Review } from 'src/app/models';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss'],
})
export class ReviewsComponent implements OnInit {
  @Input() place: Place | null = null;
  @Input() person: Person | null = null;
  @Input() viewer!: Person;
  @Input() reviews!: Review[];

  constructor() {}

  ngOnInit(): void {}
}
