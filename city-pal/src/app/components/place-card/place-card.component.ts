import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Place } from 'src/app/models';

@Component({
  selector: 'app-place-card',
  templateUrl: './place-card.component.html',
  styleUrls: ['./place-card.component.scss'],
})
export class PlaceCardComponent implements OnInit {
  @Input() place!: Place;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  redirectToPlace(id: string) {
    this.router.navigate(['/place/' + id]);
  }
}
