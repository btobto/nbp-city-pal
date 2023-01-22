import { PlaceType, Point } from '../data-types';

export interface Place {
  $type: PlaceType;
  id: string;
  name: string;
  address: string;
  rating: number;
  location: Point;
  cityName: string;
  workingHours: string[7];
}
