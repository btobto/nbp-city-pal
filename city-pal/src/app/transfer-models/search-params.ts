import { PlaceType, Point } from '../data-types';

export interface SearchParams {
  placeTypes: PlaceType[];
  location: Point;
}
