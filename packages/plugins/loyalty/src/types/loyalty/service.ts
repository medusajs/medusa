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

/**
 * The filters to apply when retrieving gift cards.
 */
export interface ModuleGiftCardFilters
  extends BaseFilterable<ModuleGiftCardFilters> {
  /**
   * A search term to filter gift cards by.
   */
  q?: string;
  /**
   * Filter by gift card ID(s).
   */
  id?: string | string[];
  /**
   * Filter by gift card code(s).
   */
  code?: string | string[];
  /**
   * Filter by reference resource ID(s).
   */
  reference_id?: string | string[];
  /**
   * Filter by reference resource type(s).
   */
  reference?: string | string[];
  /**
   * Filter by gift card status(es).
   */
  status?: string | string[];
  /**
   * Filter by currency code(s).
   */
  currency_code?: string | string[];
  /**
   * The field to order results by.
   */
  order?: string;
}

/**
 * The main service interface for the Loyalty Module.
 */
export interface ILoyaltyModuleService extends IModuleService {
  /* Entity: GiftCards */

  /**
   * This method creates a gift card.
   *
   * @param {ModuleCreateGiftCard} data - The gift card to create.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ModuleGiftCard>} The created gift card.
   *
   * @example
   * const giftCard = await loyaltyModuleService.createGiftCards({
   *   code: "UNIQUECODE123",
   *   value: 100,
   *   currency_code: "usd",
   *   line_item_id: "li_123",
   *   customer_id: "cust_123",
   *   expires_at: null,
   *   reference_id: "order_123",
   *   reference: "order",
   *   metadata: {},
   * })
   */
  createGiftCards(
    data: ModuleCreateGiftCard,
    sharedContext?: Context
  ): Promise<ModuleGiftCard>;

  /**
   * This method creates gift cards.
   *
   * @param {ModuleCreateGiftCard[]} data - The gift cards to create.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ModuleGiftCard[]>} The created gift cards.
   *
   * @example
   * const giftCards = await loyaltyModuleService.createGiftCards([
   *   {
   *     code: "UNIQUECODE123",
   *     value: 100,
   *     currency_code: "usd",
   *     line_item_id: "li_123",
   *     customer_id: "cust_123",
   *     expires_at: null,
   *     reference_id: "order_123",
   *     reference: "order",
   *     metadata: {},
   *   },
   * ])
   */
  createGiftCards(
    data: ModuleCreateGiftCard[],
    sharedContext?: Context
  ): Promise<ModuleGiftCard[]>;

  /**
   * This method updates a gift card.
   *
   * @param {ModuleUpdateGiftCard} data - The attributes to update in the gift card.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ModuleGiftCard>} The updated gift card.
   *
   * @example
   * const giftCard = await loyaltyModuleService.updateGiftCards({
   *   id: "gc_123",
   *   value: 200,
   * })
   */
  updateGiftCards(
    data: ModuleUpdateGiftCard,
    sharedContext?: Context
  ): Promise<ModuleGiftCard>;

  /**
   * This method updates gift cards.
   *
   * @param {ModuleUpdateGiftCard[]} data - The attributes to update in the gift cards.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ModuleGiftCard[]>} The updated gift cards.
   *
   * @example
   * const giftCards = await loyaltyModuleService.updateGiftCards([
   *   {
   *     id: "gc_123",
   *     value: 200,
   *   },
   * ])
   */
  updateGiftCards(
    data: ModuleUpdateGiftCard[],
    sharedContext?: Context
  ): Promise<ModuleGiftCard[]>;

  /**
   * This method retrieves a paginated list of gift cards based on optional filters and configuration.
   *
   * @param {ModuleGiftCardFilters} filters - The filters to apply on the retrieved gift cards.
   * @param {FindConfig<ModuleGiftCard>} config - The configurations determining how the gift cards are retrieved. Its properties, such as `select` or `relations`, accept the attributes or relations associated with a gift card.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ModuleGiftCard[]>} The list of gift cards.
   *
   * @example
   * To retrieve a list of gift cards using their IDs:
   *
   * ```ts
   * const giftCards = await loyaltyModuleService.listGiftCards({
   *   id: ["gc_123", "gc_456"],
   * })
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const giftCards = await loyaltyModuleService.listGiftCards(
   *   { id: ["gc_123", "gc_456"] },
   *   { take: 20, skip: 2 }
   * )
   * ```
   */
  listGiftCards(
    filters?: ModuleGiftCardFilters,
    config?: FindConfig<ModuleGiftCard>,
    sharedContext?: Context
  ): Promise<ModuleGiftCard[]>;

  /**
   * This method retrieves a gift card by its ID.
   *
   * @param {string} id - The ID of the gift card to retrieve.
   * @param {FindConfig<ModuleGiftCard>} config - The configurations determining how the gift card is retrieved. Its properties, such as `select` or `relations`, accept the attributes or relations associated with a gift card.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<ModuleGiftCard>} The retrieved gift card.
   *
   * @example
   * const giftCard = await loyaltyModuleService.retrieveGiftCard("gc_123")
   */
  retrieveGiftCard(
    id: string,
    config?: FindConfig<ModuleGiftCard>,
    sharedContext?: Context
  ): Promise<ModuleGiftCard>;

  /**
   * This method deletes gift cards by their IDs.
   *
   * @param {string[]} ids - The IDs of the gift cards to delete.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the gift cards are deleted successfully.
   *
   * @example
   * await loyaltyModuleService.deleteGiftCards(["gc_123", "gc_456"])
   */
  deleteGiftCards(ids: string[], sharedContext?: Context): Promise<void>;
}
