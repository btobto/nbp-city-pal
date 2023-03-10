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
  person$ = new Observable<Person>();
  personsReviews$ = new Observable<Review[]>();

  user$ = new Observable<Person | null>();
  usersFriends$ = new Observable<Person[]>();

  constructor(
    private personsService: PersonsService,
    private reviewsService: ReviewsService,
    private route: ActivatedRoute
  ) {
    this.route.paramMap.subscribe((paramMap) => {
      const id: string = paramMap.get('id')!;

      this.personsService.getPerson(id).subscribe();
      this.person$ = <Observable<Person>>this.personsService.person$.asObservable();

      this.reviewsService.reviewsFromPerson(id).subscribe();
      this.personsReviews$ = this.reviewsService.reviews$.asObservable();

      this.user$ = this.personsService.user$;
      this.usersFriends$ = this.personsService.usersFriends$;
    });
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
