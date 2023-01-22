import { PlaceType, Point } from '../data-types';

export interface Place {
  $type: PlaceType;
  id: string;
  name: string;
  address: string;
  rating: number;
  location: Point;
  cityName: string;
  openingHours: string[7];
  closingHours: string[7];
  distance: number;
}
