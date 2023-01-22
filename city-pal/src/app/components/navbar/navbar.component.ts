import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, filter, map, Observable, Subject } from 'rxjs';
import { Person } from 'src/app/models';
import { PersonsService } from 'src/app/services/persons.service';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  user$: Observable<Person | null>;

  @ViewChild('searchInput') input!: ElementRef;
  public subject = new Subject<string>();

  constructor(
    private router: Router,
    private personsService: PersonsService,
    private searchService: SearchService
  ) {
    this.user$ = this.personsService.user$;

    this.subject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter((text) => !!text),
        map((text) => text.trim())
      )
      .subscribe((query) => {
        console.log(query);

        this.router.navigate(['search']);

        this.searchService.search(query);
      });
  }

  redirectToProfile(id: string) {
    this.router.navigate(['/person/' + id]);
  }

  redirectHome() {
    this.router.navigate(['/home']);
  }

  redirectToSearch() {
    this.router.navigate(['/search']);
  }

  logout() {
    window.localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
