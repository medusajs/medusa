import { CustomerDTO } from "@medusajs/framework/types";

export enum GiftCardStatus {
  PENDING = "pending",
  REDEEMED = "redeemed",
}

export type GiftCardStatusValues = "pending" | "redeemed";

export type ModuleGiftCard = {
  id: string;
  code: string;
  status: GiftCardStatus;
  value: number;
  currency_code: string;
  customer_id: string;
  customer: CustomerDTO;
  reference_id: string | null;
  note: string | null;
  reference: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ModuleCreateGiftCard = {
  code: string;
  value: number;
  currency_code: string;
  expires_at: string | null;
  reference_id: string | null;
  reference: string | null;
  line_item_id: string;
  customer_id: string | null;
  metadata: Record<string, unknown>;
};

export type ModuleUpdateGiftCard = {
  id: string;
  value?: number;
  status?: GiftCardStatus;
  note?: string | null;
  currency_code?: string;
  expires_at?: string | null;
  customer_id?: string;
  metadata?: Record<string, unknown>;
};
