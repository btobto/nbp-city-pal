import { Place } from '.';

export interface Restaurant extends Place {
  hasTakeout: boolean;
  foodTypes: string[];
}
