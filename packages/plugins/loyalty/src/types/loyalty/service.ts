import {
  BaseFilterable,
  Context,
  FindConfig,
  IModuleService,
} from "@medusajs/types";
import {
  ModuleCreateGiftCard,
  ModuleGiftCard,
  ModuleUpdateGiftCard,
} from "./module";

export interface ModuleGiftCardFilters
  extends BaseFilterable<ModuleGiftCardFilters> {
  q?: string;
  id?: string | string[];
  code?: string | string[];
  reference_id?: string | string[];
  reference?: string | string[];
  status?: string | string[];
  currency_code?: string | string[];
  order?: string;
}

/**
 * The main service interface for the Loyalty Module.
 */
export interface ILoyaltyModuleService extends IModuleService {
  /* Entity: GiftCards */
  createGiftCards(
    data: ModuleCreateGiftCard,
    sharedContext?: Context
  ): Promise<ModuleGiftCard>;

  createGiftCards(
    data: ModuleCreateGiftCard[],
    sharedContext?: Context
  ): Promise<ModuleGiftCard[]>;

  updateGiftCards(
    data: ModuleUpdateGiftCard,
    sharedContext?: Context
  ): Promise<ModuleGiftCard>;

  updateGiftCards(
    data: ModuleUpdateGiftCard[],
    sharedContext?: Context
  ): Promise<ModuleGiftCard[]>;

  listGiftCards(
    filters?: ModuleGiftCardFilters,
    config?: FindConfig<ModuleGiftCard>,
    sharedContext?: Context
  ): Promise<ModuleGiftCard[]>;

  retrieveGiftCard(
    id: string,
    config?: FindConfig<ModuleGiftCard>,
    sharedContext?: Context
  ): Promise<ModuleGiftCard>;

  deleteGiftCards(ids: string[], sharedContext?: Context): Promise<void>;
}
