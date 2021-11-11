import { Country } from '../country';
import { Currency } from '../product-variant';

export interface Region {
  id: string;
  name: string;
  currency_code: string;
  currency: Currency;
  tax_rate: number;
  tax_code?: string;
  countries: Country[];
  payment_providers: PaymentProvider[];
  fulfillment_providers: FulfillmentProvider[];
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
  metadata?: JSON;
}

export interface PaymentProvider {
  id: string;
  is_installed: boolean;
}

export interface FulfillmentProvider {
  id: string;
  is_installed: boolean;
}
