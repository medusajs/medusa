import { Region } from '../region';

export interface GiftCard {
  id: string;
  code: string;
  value: number;
  balance: number;
  region_id: string;
  region?: Region;
}
