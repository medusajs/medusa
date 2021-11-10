import { Address } from '../address';
import { Order } from '../order';

export interface Customer {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  billing_address_id?: string;
  billing_address?: Address;
  shipping_addresses?: Address[];
  password_hash?: string;
  phone?: string;
  has_account: boolean;
  orders?: Order[];
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
  metadata?: JSON;
}

export interface CustomerResetPasswordResource {
  email: string;
  password: string;
}

export interface CustomerGeneratePasswordTokenResource {
  email: string;
}

export interface CustomerCreateResource {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  phone?: string;
}

export interface CustomerUpdateResource {
  billing_address?: Address;
  first_name?: string;
  last_name?: string;
  password?: string;
  phone?: string;
  metadata?: JSON;
}

export interface AuthCreateSessionResource {
  email: string;
  password: string;
}
