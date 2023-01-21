import { Point } from '../data-types';

type PlaceType = 'Bar' | 'Cinema' | 'Hotel' | 'Location' | 'Person' | 'Place' | 'Restaurant';

export interface SearchParams {
  placeTypes: PlaceType[];
  location: Point;
}
