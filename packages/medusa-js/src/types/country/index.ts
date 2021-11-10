import { Region } from '../region';

export interface Country {
  id: number;
  iso_2: string;
  iso_3: string;
  num_code: string;
  name: string;
  display_name: string;
  region_id?: string;
  region: Region;
}
