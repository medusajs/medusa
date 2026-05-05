import {
  AdminCustomer,
  AdminOrderLineItem,
  BaseFilterable,
  FindParams,
  OperatorMap,
  PaginatedResponse,
  SelectParams,
  StoreCustomer,
  StoreOrderLineItem,
} from "@medusajs/framework/types";
import {
  GiftCardStatus,
  ModuleCreateGiftCard,
  ModuleGiftCard,
  ModuleUpdateGiftCard,
} from "../loyalty";

export interface AdminGetGiftCardsParams
  extends FindParams,
    BaseFilterable<AdminGetGiftCardsParams> {
  id?: string | string[];
  customer_id?: string | string[];
  created_at?: OperatorMap<string>;
  updated_at?: OperatorMap<string>;
}

export interface AdminCreateGiftCardParams extends ModuleCreateGiftCard {}
export interface AdminUpdateGiftCardParams
  extends Omit<ModuleUpdateGiftCard, "id"> {}

export interface AdminGiftCard
  extends Omit<ModuleGiftCard, "customer" | "line_item"> {
  line_item: AdminOrderLineItem;
  customer: AdminCustomer;
}

export interface AdminGiftCardResponse {
  gift_card: AdminGiftCard;
}

export interface AdminGiftCardsResponse
  extends PaginatedResponse<{
    gift_cards: AdminGiftCard[];
  }> {}

export interface StoreAddGiftCardToCart {
  code: string;
}

export interface StoreRemoveGiftCardFromCart {
  code: string;
}

export interface StoreGiftCard
  extends Omit<ModuleGiftCard, "customer" | "line_item"> {
  customer: StoreCustomer;
  line_item: StoreOrderLineItem;
}

export interface StoreGiftCardResponse {
  gift_card: StoreGiftCard;
}

export interface StoreGetGiftCardsParams
  extends FindParams,
    BaseFilterable<AdminGetGiftCardsParams> {
  id?: string | string[];
  status?: GiftCardStatus | GiftCardStatus[];
}

export interface StoreGetGiftCardParams extends SelectParams {}
