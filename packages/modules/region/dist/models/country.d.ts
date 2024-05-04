import Region from "./region";
export default class Country {
    iso_2: string;
    iso_3: string;
    num_code: number;
    name: string;
    display_name: string;
    region_id?: string | null;
    region?: Region | null;
}
