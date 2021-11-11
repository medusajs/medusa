import { Country } from '../country';
import { Customer } from '../customer';

export interface Address {
  id: string;
  customer_id?: string;
  customer?: Customer;
  company?: string;
  first_name?: string;
  last_name?: string;
  address_1?: string;
  address_2?: string;
  city?: string;
  country_code?: string;
  country?: Country;
  province?: string;
  postal_code?: number;
  phone?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  metadata?: JSON;
}
