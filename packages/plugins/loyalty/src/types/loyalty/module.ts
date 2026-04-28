import { CustomerDTO } from "@medusajs/framework/types";

/**
 * The status of a gift card.
 */
export enum GiftCardStatus {
  PENDING = "pending",
  REDEEMED = "redeemed",
}

/**
 * A union of the possible gift card status string values.
 */
export type GiftCardStatusValues = "pending" | "redeemed";

/**
 * Represents a gift card in the Loyalty module.
 */
export type ModuleGiftCard = {
  /**
   * The gift card's ID.
   */
  id: string;
  /**
   * The unique redemption code for the gift card.
   */
  code: string;
  /**
   * The current status of the gift card.
   */
  status: GiftCardStatus;
  /**
   * The monetary value of the gift card.
   */
  value: number;
  /**
   * The three-letter ISO currency code of the gift card's value.
   */
  currency_code: string;
  /**
   * The ID of the customer who owns this gift card.
   */
  customer_id: string;
  /**
   * The customer who owns this gift card.
   */
  customer: CustomerDTO;
  /**
   * The ID of the resource this gift card was created from (e.g. an order ID).
   */
  reference_id: string | null;
  /**
   * An optional note about the gift card.
   */
  note: string | null;
  /**
   * The resource type this gift card references (e.g. "order").
   */
  reference: string | null;
  /**
   * The date the gift card expires, or null if it does not expire.
   */
  expires_at: string | null;
  /**
   * The date the gift card was created.
   */
  created_at: string;
  /**
   * The date the gift card was last updated.
   */
  updated_at: string;
};

/**
 * The data required to create a gift card.
 */
export type ModuleCreateGiftCard = {
  /**
   * The unique redemption code for the gift card. If not provided, one is auto-generated.
   */
  code: string;
  /**
   * The monetary value of the gift card.
   */
  value: number;
  /**
   * The three-letter ISO currency code for the gift card's value.
   * 
   * @example usd
   */
  currency_code: string;
  /**
   * The expiration date of the gift card, or null if it does not expire.
   */
  expires_at: string | null;
  /**
   * The ID of the resource this gift card is associated with.
   */
  reference_id: string | null;
  /**
   * The resource type this gift card is associated with (e.g. "order").
   */
  reference: string | null;
  /**
   * The ID of the line item this gift card was purchased as.
   */
  line_item_id: string;
  /**
   * The ID of the customer to associate with the gift card.
   */
  customer_id: string | null;
  /**
   * Custom key-value pairs to attach to the gift card.
   */
  metadata: Record<string, unknown>;
};

/**
 * The data required to update a gift card.
 */
export type ModuleUpdateGiftCard = {
  /**
   * The ID of the gift card to update.
   */
  id: string;
  /**
   * The updated monetary value of the gift card.
   */
  value?: number;
  /**
   * The updated status of the gift card.
   */
  status?: GiftCardStatus;
  /**
   * An updated note about the gift card.
   */
  note?: string | null;
  /**
   * The updated three-letter ISO currency code.
   * 
   * @example usd
   */
  currency_code?: string;
  /**
   * The updated expiration date, or null to remove the expiration.
   */
  expires_at?: string | null;
  /**
   * The updated ID of the customer associated with the gift card.
   */
  customer_id?: string;
  /**
   * Updated custom key-value pairs attached to the gift card.
   */
  metadata?: Record<string, unknown>;
};
