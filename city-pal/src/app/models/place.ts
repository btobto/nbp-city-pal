import { PlaceType, Point } from '../data-types';

export interface Place {
  $discriminator: PlaceType;
  id: string;
  name: string;
  address: string;
  rating: number;
  location: Point;
  workingHours: string[7];
}
