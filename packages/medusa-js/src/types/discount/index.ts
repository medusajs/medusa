import { Product } from '../product';
import { Region } from '../region';

export interface Discount {
  id: string;
  code: string;
  is_dynamic: boolean;
  rule_id: string;
  rule: DiscountRule;
  is_disabled: boolean;
  parent_discount_id?: string;
  parent_discount?: Discount;
  starts_at: Date;
  ends_at?: Date;
  regions: Region[];
  usage_limit?: number;
  usage_count: number;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
  metadata?: JSON;
}

export enum DiscountRuleType {
  FIXED = 'fixed',
  PERCENTAGE = 'percentage',
  FREE_SHIPPING = 'free_shipping',
}

export enum AllocationType {
  TOTAL = 'total',
  ITEM = 'item',
}

export interface DiscountRule {
  id: string;
  description?: string;
  type: DiscountRuleType;
  value: number;
  allocation?: AllocationType;
  valid_for?: Product[];
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
  metadata?: JSON;
}
