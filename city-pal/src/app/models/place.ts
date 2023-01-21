import { Point } from '../data-types';

export interface Place {
  id: string;
  name: string;
  address: string;
  rating: number;
  location: Point;
  workingHours: string[7];
}
