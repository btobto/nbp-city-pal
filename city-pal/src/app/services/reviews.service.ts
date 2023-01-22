import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Review } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ReviewsService {
  reviews$: BehaviorSubject<Review[]> = new BehaviorSubject<Review[]>([]);

  constructor(private http: HttpClient) {}

  reviewsFromPerson(personId: string): Observable<Review[]> {
    return this.http.get<Review[]>(environment.API_URL + '/Reviews/Persons/' + personId).pipe(
      switchMap((r) => {
        this.reviews$.next(r);
        return this.reviews$;
      })
    );
  }

  reviewsForPlace(placeId: string): Observable<Review[]> {
    return this.http.get<Review[]>(environment.API_URL + '/Reviews/Places/' + placeId).pipe(
      switchMap((r) => {
        this.reviews$.next(r);
        return this.reviews$;
      })
    );
  }

  createReview(review: Review): Observable<Review> {
    return this.http.post<Review>(
      environment.API_URL + '/Reviews/Places/',
      review,
      environment.HTTP_OPTIONS
    );
  }

  updateReview(review: Review): Observable<Review> {
    return this.http.put<Review>(
      environment.API_URL + '/Reviews/Places/',
      review,
      environment.HTTP_OPTIONS
    );
  }

  deleteReview(personId: string, placeId: string): Observable<Review> {
    return this.http.delete<Review>(
      environment.API_URL + '/Reviews/Places/' + personId + '/' + placeId
    );
  }
}
