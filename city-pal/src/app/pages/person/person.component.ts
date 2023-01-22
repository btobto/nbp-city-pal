import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Person, Review } from 'src/app/models';
import { PersonsService } from 'src/app/services/persons.service';
import { ReviewsService } from 'src/app/services/reviews.service';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss'],
})
export class PersonComponent {
  person$: Observable<Person>;
  personsReviews$: Observable<Review[]>;

  user$: Observable<Person | null>;
  usersFriends$: Observable<Person[]>;

  constructor(
    private personsService: PersonsService,
    private reviewsService: ReviewsService,
    private route: ActivatedRoute
  ) {
    const id: string = this.route.snapshot.paramMap.get('id')!;

    this.person$ = this.personsService.getPerson(id);
    this.person$ = <Observable<Person>>this.personsService.person$.asObservable();
    this.personsReviews$ = this.reviewsService.reviewsFromPerson(id);

    this.user$ = this.personsService.user$;
    this.usersFriends$ = this.personsService.usersFriends$;
  }

  isFriend(id: string, friends: Person[]): boolean {
    return friends.some((person) => person.id === id);
  }

  addFriend(userId: string, personId: string) {
    this.personsService.addFriend(userId, personId).subscribe();
  }

  removeFriend(userId: string, personId: string) {
    this.personsService.removeFriend(userId, personId).subscribe();
  }
}
