import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlaceType } from 'src/app/data-types';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  personsSearchResults$ = this.searchService.personsSearchResults$;
  placesSearchResults$ = this.searchService.placesSearchResults$;

  filters: PlaceType[] = ['Bar', 'Gym', 'Cinema', 'Hotel', 'Restaurant'];

  searchFilters: PlaceType[] = [];

  constructor(private searchService: SearchService, private router: Router) {}

  addFilter(ev: any, filter: PlaceType) {
    const target = ev.target;

    if (target.checked) {
      this.searchFilters.push(filter);
      this.searchService.searchParams$.next(this.searchFilters);
    } else {
      this.searchFilters = this.searchFilters.filter((f) => f !== filter);
      this.searchService.searchParams$.next(this.searchFilters);
    }

    console.log(this.searchFilters);
  }

  redirectToPerson(id: string) {
    this.router.navigate(['/person/' + id]);
  }
}
