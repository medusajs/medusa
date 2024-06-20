import { FindConfig } from "../common"
import { RestoreReturn, SoftDeleteReturn } from "../dal"
import { IModuleService } from "../modules-sdk"
import { Context } from "../shared-context"
import {
  CampaignDTO,
  ComputeActionContext,
  ComputeActions,
  CreatePromotionDTO,
  CreatePromotionRuleDTO,
  FilterableCampaignProps,
  FilterablePromotionProps,
  FilterablePromotionRuleProps,
  PromotionDTO,
  PromotionRuleDTO,
  UpdatePromotionDTO,
  UpdatePromotionRuleDTO,
} from "./common"
import {
  AddPromotionsToCampaignDTO,
  CreateCampaignDTO,
  RemovePromotionsFromCampaignDTO,
  UpdateCampaignDTO,
} from "./mutations"

/**
 * The main service interface for the Promotion Module.
 */
export interface IPromotionModuleService extends IModuleService {
  /**
   * This method adjusts the budget for each campaign associated with the promotions' specified computed actions.
   * It adjusts the `used` property of a `CampaignBudget` to account for the adjustment amounts in the specified associated
   * computed actions.
   *
   * @param {ComputeActions[]} computedActions - The computed actions to adjust their promotion's campaign budget.
   * @returns {Promise<void>} Resolves when the campaign budgets have been adjusted successfully.
   *
   * @example
   * await promotionModuleService.registerUsage([
   *   {
   *     action: "addItemAdjustment",
   *     item_id: "cali_123",
   *     amount: 50,
   *     code: "50OFF",
   *   },
   *   {
   *     action: "addShippingMethodAdjustment",
   *     shipping_method_id: "casm_123",
   *     amount: 5000,
   *     code: "FREESHIPPING",
   *   },
   * ])
   */
  registerUsage(computedActions: ComputeActions[]): Promise<void>

  /**
   * This method provides the actions to perform on a cart based on the specified promotions
   * and context.
   *
   * @param {string[]} promotionCodesToApply - The promotion codes to be applied on the cart.
   * @param {ComputeActionContext} applicationContext - The items and shipping methods of the cart.
   * @param {Record<string, any>} options - Any relevant options that may change how the actions are computed.
   * @returns {Promise<ComputeActions[]>} The list of computed actions to be applied on the cart.
   *
   * @example
   * const actions = await promotionModuleService.computeActions(
   *   ["50OFF"],
   *   {
   *     items: [
   *       {
   *         id: "cali_123",
   *         quantity: 2,
   *         subtotal: 1000,
   *       },
   *     ],
   *     shipping_methods: [
   *       {
   *         id: "casm_123",
   *         subtotal: 0,
   *         adjustments: [
   *           {
   *             id: "adj_123",
   *             code: "FREESHIPPING",
   *           },
   *         ],
   *       },
   *     ],
   *   }
   * )
   */
  computeActions(
    promotionCodesToApply: string[],
    applicationContext: ComputeActionContext,
    options?: Record<string, any>
  ): Promise<ComputeActions[]>

  /**
   * This method creates promotions.
   *
   * @param {CreatePromotionDTO[]} data - The promotions to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PromotionDTO[]>} The created promotions.
   *
   * @example
   * const promotions = await promotionModuleService.createPromotions([
   *   {
   *     code: "50OFF",
   *     type: "standard",
   *     application_method: {
   *       type: "percentage",
   *       target_type: "items",
   *       value: 50,
   *     },
   *   },
   *   {
   *     code: "FREESHIPPING",
   *     type: "standard",
   *     application_method: {
   *       type: "percentage",
   *       target_type: "shipping_methods",
   *       value: 100,
   *     },
   *   },
   *   {
   *     code: "BUY2GET1",
   *     type: "buyget",
   *     application_method: {
   *       type: "fixed",
   *       target_type: "items",
   *       buy_rules_min_quantity: 2,
   *       apply_to_quantity: 1,
   *       buy_rules: [
   *         {
   *           attribute: "SKU",
   *           operator: "eq",
   *           values: ["SHIRT"],
   *         },
   *       ],
   *     },
   *   },
   * ])
   */
  createPromotions(
    data: CreatePromotionDTO[],
    sharedContext?: Context
  ): Promise<PromotionDTO[]>

  /**
   * This method creates a promotion.
   *
   * @param {CreatePromotionDTO} data - The promotion to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PromotionDTO>} The created promotion.
   *
   * @example
   * const promotionA = await promotionModuleService.createPromotions({
   *   code: "50OFF",
   *   type: "standard",
   *   application_method: {
   *     type: "percentage",
   *     target_type: "items",
   *     value: 50,
   *   },
   * })
   *
   * const promotionB = await promotionModuleService.createPromotions({
   *   code: "FREESHIPPING",
   *   type: "standard",
   *   application_method: {
   *     type: "percentage",
   *     target_type: "shipping_methods",
   *     value: 100,
   *   },
   * })
   *
   * const promotionC = await promotionModuleService.createPromotions({
   *   code: "BUY2GET1",
   *   type: "buyget",
   *   application_method: {
   *     type: "fixed",
   *     target_type: "items",
   *     buy_rules_min_quantity: 2,
   *     apply_to_quantity: 1,
   *     buy_rules: [
   *       {
   *         attribute: "SKU",
   *         operator: "eq",
   *         values: ["SHIRT"],
   *       },
   *     ],
   *   },
   * })
   */
  createPromotions(
    data: CreatePromotionDTO,
    sharedContext?: Context
  ): Promise<PromotionDTO>

  /**
   * This method updates existing promotions.
   *
   * @param {UpdatePromotionDTO[]} data - The attributes to update in the promotions.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PromotionDTO[]>} The updated promotions.
   *
   * @example
   * const promotions = await promotionModuleService.updatePromotions([
   *   {
   *     id: "promo_123",
   *     is_automatic: true,
   *   },
   * ])
   */
  updatePromotions(
    data: UpdatePromotionDTO[],
    sharedContext?: Context
  ): Promise<PromotionDTO[]>

  /**
   * This method updates an existing promotion.
   *
   * @param {UpdatePromotionDTO} data - The attributes to update in the promotion.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PromotionDTO>} The updated promotion.
   *
   * @example
   * const promotion = await promotionModuleService.updatePromotions({
   *   id: "promo_123",
   *   is_automatic: true,
   * })
   */
  updatePromotions(
    data: UpdatePromotionDTO,
    sharedContext?: Context
  ): Promise<PromotionDTO>

  /**
   * This method retrieves a paginated list of promotions based on optional filters and configuration.
   *
   * @param {FilterablePromotionProps} filters - The filters to apply on the retrieved promotions.
   * @param {FindConfig<PromotionDTO>} config - The configurations determining how the promotion is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a promotion.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PromotionDTO[]>} The list of promotions.
   *
   * @example
   * To retrieve a list of promotions using their IDs:
   *
   * ```ts
   * const promotions = await promotionModuleService.listPromotions({
   *   id: ["promo_123", "promo_321"],
   * })
   * ```
   *
   * To specify relations that should be retrieved within the promotions:
   *
   * ```ts
   * const promotions = await promotionModuleService.listPromotions(
   *   {
   *     id: ["promo_123", "promo_321"],
   *   },
   *   {
   *     relations: ["application_method"],
   *   }
   * )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const promotions = await promotionModuleService.listPromotions(
   *   {
   *     id: ["promo_123", "promo_321"],
   *   },
   *   {
   *     relations: ["application_method"],
   *     take: 20,
   *     skip: 2,
   *   }
   * )
   * ```
   */
  listPromotions(
    filters?: FilterablePromotionProps,
    config?: FindConfig<PromotionDTO>,
    sharedContext?: Context
  ): Promise<PromotionDTO[]>

  /**
   * This method retrieves a paginated list of promotions along with the total count of available promotions satisfying the provided filters.
   *
   * @param {FilterablePromotionProps} filters - The filters to apply on the retrieved promotions.
   * @param {FindConfig<PromotionDTO>} config - The configurations determining how the promotion is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a promotion.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[PromotionDTO[], number]>} The list of promotions along with their total count.
   *
   * @example
   * To retrieve a list of promotions using their IDs:
   *
   * ```ts
   * const [promotions, count] =
   *   await promotionModuleService.listAndCountPromotions({
   *     id: ["promo_123", "promo_321"],
   *   })
   * ```
   *
   * To specify relations that should be retrieved within the promotions:
   *
   * ```ts
   * const [promotions, count] =
   *   await promotionModuleService.listAndCountPromotions(
   *     {
   *       id: ["promo_123", "promo_321"],
   *     },
   *     {
   *       relations: ["application_method"],
   *     }
   *   )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const [promotions, count] =
   *   await promotionModuleService.listAndCountPromotions(
   *     {
   *       id: ["promo_123", "promo_321"],
   *     },
   *     {
   *       relations: ["application_method"],
   *       take: 20,
   *       skip: 2,
   *     }
   *   )
   * ```
   */
  listAndCountPromotions(
    filters?: FilterablePromotionProps,
    config?: FindConfig<PromotionDTO>,
    sharedContext?: Context
  ): Promise<[PromotionDTO[], number]>

  /**
   * This method retrieves a promotion by its ID.
   *
   * @param {string} id - The ID of the promotion.
   * @param {FindConfig<PromotionDTO>} config - The configurations determining how the promotion is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a promotion.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PromotionDTO>} The retrieved promotion.
   *
   * @example
   * A simple example that retrieves a promotion by its ID:
   *
   * ```ts
   * const promotion =
   *   await promotionModuleService.retrievePromotion("promo_123")
   * ```
   *
   * To specify relations that should be retrieved:
   *
   * ```ts
   * const promotion = await promotionModuleService.retrievePromotion(
   *   "promo_123",
   *   {
   *     relations: ["application_method"],
   *   }
   * )
   * ```
   */
  retrievePromotion(
    id: string,
    config?: FindConfig<PromotionDTO>,
    sharedContext?: Context
  ): Promise<PromotionDTO>

  /**
   * This method deletes promotions by their IDs.
   *
   * @param {string[]} ids - The IDs of the promotion.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the promotions are deleted.
   *
   * @example
   * await promotionModuleService.deletePromotions([
   *   "promo_123",
   *   "promo_321",
   * ])
   */
  deletePromotions(ids: string[], sharedContext?: Context): Promise<void>

  /**
   * This method deletes a promotion by its ID.
   *
   * @param {string} ids - The IDs of the promotion.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the promotion is deleted.
   *
   * @example
   * await promotionModuleService.deletePromotions("promo_123")
   */
  deletePromotions(ids: string, sharedContext?: Context): Promise<void>

  /**
   * This method soft deletes a promotion by its IDs.
   *
   * @param {string | string[]} promotionIds - The list of promotions to soft delete.
   * @param {SoftDeleteReturn<TReturnableLinkableKeys>} config - An object that is used to specify an entity's related entities that should be soft-deleted when the main entity is soft-deleted.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<string, string[]>>} An object that includes the IDs of related records that were also soft deleted, such as the ID of the associated application method.
   * The object's keys are the ID attribute names of the promotion entity's relations, such as `application_method_id`, and its value is an array of strings, each being the ID of a record associated
   * with the promotion through this relation, such as the IDs of associated application method.
   *
   * If there are no related records, the promise resolves to `void`.
   *
   * @example
   * await promotionModuleService.softDeletePromotions("promo_123")
   */
  softDeletePromotions<TReturnableLinkableKeys extends string = string>(
    promotionIds: string | string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  /**
   * This method restores soft deleted promotions by their IDs.
   *
   * @param {string | string[]} promotionIds - The promotions' IDs.
   * @param {RestoreReturn<TReturnableLinkableKeys>} config - Configurations determining which relations to restore along with each of the promotion. You can pass to its `returnLinkableKeys`
   * property any of the promotion's relation attribute names, such as `application_method_id`.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<string, string[]>>} An object that includes the IDs of related records that were restored, such as the ID of associated application method.
   * The object's keys are the ID attribute names of the promotion entity's relations, such as `application_method_id`,
   * and its value is an array of strings, each being the ID of the record associated with the promotion through this relation,
   * such as the IDs of associated application method.
   *
   * If there are no related records restored, the promise resolves to `void`.
   *
   * @example
   * await promotionModuleService.restorePromotions("promo_123")
   */
  restorePromotions<TReturnableLinkableKeys extends string = string>(
    promotionIds: string | string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  /**
   * This method adds promotion rules to a promotion.
   *
   * @param {string} promotionId - The promotion's ID.
   * @param {CreatePromotionRuleDTO[]} rulesData - The promotion rules to be created and added to the promotion.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PromotionRuleDTO[]>} The promotion rules created.
   *
   * @example
   * const promotionRules =
   *   await promotionModuleService.addPromotionRules(
   *     "promo_123",
   *     [
   *       {
   *         attribute: "customer_group_id",
   *         operator: "in",
   *         values: ["VIP", "VVIP"],
   *       },
   *     ]
   *   )
   */
  addPromotionRules(
    promotionId: string,
    rulesData: CreatePromotionRuleDTO[],
    sharedContext?: Context
  ): Promise<PromotionRuleDTO[]>

  /**
   * This method adds target promotion rules to a promotion's application method.
   *
   * @param {string} promotionId - The promotion's ID.
   * @param {CreatePromotionRuleDTO[]} rulesData - The promotion rules to be created and added as target rules to the promotion's application method.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PromotionRuleDTO[]>} The created promotion rules.
   *
   * @example
   * const targetPromotionRules =
   *   await promotionModuleService.addPromotionTargetRules(
   *     "promo_123",
   *     [
   *       {
   *         attribute: "SKU",
   *         operator: "eq",
   *         values: "SHIRT",
   *       },
   *     ]
   *   )
   */
  addPromotionTargetRules(
    promotionId: string,
    rulesData: CreatePromotionRuleDTO[],
    sharedContext?: Context
  ): Promise<PromotionRuleDTO[]>

  /**
   * This method adds buy promotion rules to a promotion's application method.
   *
   * @param {string} promotionId - The promotion's ID.
   * @param {CreatePromotionRuleDTO[]} rulesData - The promotion rules to be created and added as buy rules to the promotion's applicatio method.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PromotionRuleDTO[]>} The created promotion rules.
   *
   * @example
   * const buyPromotionRules =
   *   await promotionModuleService.addPromotionBuyRules(
   *     "promo_123",
   *     [
   *       {
   *         attribute: "SKU",
   *         operator: "eq",
   *         values: "SHIRT",
   *       },
   *     ]
   *   )
   */
  addPromotionBuyRules(
    promotionId: string,
    rulesData: CreatePromotionRuleDTO[],
    sharedContext?: Context
  ): Promise<PromotionRuleDTO[]>

  /**
   * This method removes promotion rules from a promotion.
   *
   * @param {string} promotionId - The promotion's ID.
   * @param {string[]} ruleIds - The promotion rules' IDs.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the promotion rules are deleted successfully.
   *
   * @example
   * await promotionModuleService.removePromotionRules(
   *   "promo_123",
   *   ["prorul_123", "prorul_321"]
   * )
   */
  removePromotionRules(
    promotionId: string,
    ruleIds: string[],
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method removes target promotion rules from a promotion's application method.
   *
   * @param {string} promotionId - The promotion's ID.
   * @param {string[]} ruleIds - The target promotion rules' IDs.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the target promotion rules are deleted.
   *
   * @example
   * await promotionModuleService.removePromotionTargetRules(
   *   "promo_123",
   *   ["prorul_123", "prorul_321"]
   * )
   */
  removePromotionTargetRules(
    promotionId: string,
    ruleIds: string[],
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method removes buy promotion rules from a promotion's application method.
   *
   * @param {string} promotionId - The promotion's ID.
   * @param {string[]} ruleIds - The buy promotion rules' IDs.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the buy promotion rules are deleted.
   *
   * @example
   * await promotionModuleService.removePromotionBuyRules(
   *   "promo_123",
   *   ["prorul_123", "prorul_321"]
   * )
   */
  removePromotionBuyRules(
    promotionId: string,
    ruleIds: string[],
    sharedContext?: Context
  ): Promise<void>

  /**
   * This method creates a campaign.
   *
   * @param {CreateCampaignDTO} data - The campaign to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CampaignDTO>} The created campaign.
   *
   * @example
   * const campaign = await promotionModuleService.createCampaigns(
   *   {
   *     name: "Summer discounts",
   *     campaign_identifier: "G-123456",
   *     starts_at: new Date("2025-06-01"),
   *     ends_at: new Date("2025-09-01"),
   *     budget: {
   *       type: "usage",
   *       limit: 10,
   *     },
   *   }
   * )
   */
  createCampaigns(
    data: CreateCampaignDTO,
    sharedContext?: Context
  ): Promise<CampaignDTO>

  /**
   * This method creates campaigns.
   *
   * @param {CreateCampaignDTO[]} data - The campaigns to be created.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CampaignDTO[]>} The created campaigns.
   *
   * @example
   * const campaigns =
   *   await promotionModuleService.createCampaigns([
   *     {
   *       name: "Summer discounts",
   *       campaign_identifier: "G-123456",
   *       starts_at: new Date("2025-06-01"),
   *       ends_at: new Date("2025-09-01"),
   *       budget: {
   *         type: "usage",
   *         limit: 10,
   *       },
   *     },
   *   ])
   */
  createCampaigns(
    data: CreateCampaignDTO[],
    sharedContext?: Context
  ): Promise<CampaignDTO[]>

  /**
   * This method updates existing campaigns.
   *
   * @param {UpdateCampaignDTO[]} data - The attributes to update in the campaigns.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CampaignDTO[]>} The updated campaigns.
   *
   * @example
   * const campaigns =
   *   await promotionModuleService.updateCampaigns([
   *     {
   *       id: "procamp_123",
   *       name: "Summer Sales",
   *     },
   *   ])
   */
  updateCampaigns(
    data: UpdateCampaignDTO[],
    sharedContext?: Context
  ): Promise<CampaignDTO[]>

  /**
   * This method updates an existing campaign.
   *
   * @param {UpdateCampaignDTO} data - The attributes to update in the campaign.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CampaignDTO>} The updated campaign.
   *
   * @example
   * const campaigns =
   *   await promotionModuleService.updateCampaigns({
   *     id: "procamp_123",
   *     name: "Summer Sales",
   *   })
   */
  updateCampaigns(
    data: UpdateCampaignDTO,
    sharedContext?: Context
  ): Promise<CampaignDTO>

  /**
   * This method retrieves a paginated list of promotion rules based on optional filters and configuration.
   *
   * @param {FilterablePromotionRuleProps} filters - The filters to apply on the retrieved promotion rules.
   * @param {FindConfig<PromotionRuleDTO>} config - The configurations determining how the promotion rule is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a promotion rule.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PromotionRuleDTO[]>} The list of promotion rules.
   *
   * @example
   * To retrieve a list of promotion rules using their IDs:
   *
   * ```ts
   * const promotionRules =
   *   await promotionModuleService.listPromotionRules({
   *     id: ["prorul_123", "prorul_321"],
   *   })
   * ```
   *
   * To specify relations that should be retrieved within the promotion rules:
   *
   * ```ts
   * const promotionRules =
   *   await promotionModuleService.listPromotionRules(
   *     {
   *       id: ["prorul_123", "prorul_321"],
   *     },
   *     {
   *       relations: ["promotions"],
   *     }
   *   )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const promotionRules =
   *   await promotionModuleService.listPromotionRules(
   *     {
   *       id: ["prorul_123", "prorul_321"],
   *     },
   *     {
   *       relations: ["promotions"],
   *       take: 20,
   *       skip: 2,
   *     }
   *   )
   * ```
   */
  listPromotionRules(
    filters?: FilterablePromotionRuleProps,
    config?: FindConfig<PromotionRuleDTO>,
    sharedContext?: Context
  ): Promise<PromotionRuleDTO[]>

  /**
   * This method updates existing promotion rules.
   *
   * @param {UpdatePromotionRuleDTO[]} data - The attributes to update in the promotion rules.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<PromotionRuleDTO[]>} The updated promotion rules.
   *
   * @example
   * const promotionRules =
   *   await promotionModuleService.updatePromotionRules([
   *     {
   *       id: "prorul_123",
   *       description: "Only allow VIP customers",
   *     },
   *   ])
   */
  updatePromotionRules(
    data: UpdatePromotionRuleDTO[],
    sharedContext?: Context
  ): Promise<PromotionRuleDTO[]>

  /**
   * This method retrieves a paginated list of campaigns based on optional filters and configuration.
   *
   * @param {FilterableCampaignProps} filters - The filters to apply on the retrieved campaigns.
   * @param {FindConfig<CampaignDTO>} config - The configurations determining how the campaign is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a campaign.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CampaignDTO[]>} The list of campaigns.
   *
   * @example
   * To retrieve a list of campaigns using their IDs:
   *
   * ```ts
   * const campaigns = await promotionModuleService.listCampaigns({
   *   id: ["procamp_123"],
   * })
   * ```
   *
   * To specify relations that should be retrieved within the campaigns:
   *
   * ```ts
   * const campaigns = await promotionModuleService.listCampaigns(
   *   {
   *     id: ["procamp_123"],
   *   },
   *   {
   *     relations: ["promotions"],
   *   }
   * )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const campaigns = await promotionModuleService.listCampaigns(
   *   {
   *     id: ["procamp_123"],
   *   },
   *   {
   *     relations: ["promotions"],
   *     take: 20,
   *     skip: 2,
   *   }
   * )
   * ```
   */
  listCampaigns(
    filters?: FilterableCampaignProps,
    config?: FindConfig<CampaignDTO>,
    sharedContext?: Context
  ): Promise<CampaignDTO[]>

  /**
   * This method retrieves a paginated list of campaigns along with the total count of available campaigns satisfying the provided filters.
   *
   * @param {FilterableCampaignProps} filters - The filters to apply on the retrieved campaigns.
   * @param {FindConfig<CampaignDTO>} config - The configurations determining how the campaign is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a campaign.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<[CampaignDTO[], number]>} The list of campaigns along with their total count.
   *
   * @example
   * To retrieve a list of campaigns using their IDs:
   *
   * ```ts
   * const [campaigns, count] =
   *   await promotionModuleService.listAndCountCampaigns({
   *     id: ["procamp_123"],
   *   })
   * ```
   *
   * To specify relations that should be retrieved within the campaigns:
   *
   * ```ts
   * const [campaigns, count] =
   *   await promotionModuleService.listAndCountCampaigns(
   *     {
   *       id: ["procamp_123"],
   *     },
   *     {
   *       relations: ["promotions"],
   *     }
   *   )
   * ```
   *
   * By default, only the first `15` records are retrieved. You can control pagination by specifying the `skip` and `take` properties of the `config` parameter:
   *
   * ```ts
   * const [campaigns, count] =
   *   await promotionModuleService.listAndCountCampaigns(
   *     {
   *       id: ["procamp_123"],
   *     },
   *     {
   *       relations: ["promotions"],
   *       take: 20,
   *       skip: 2,
   *     }
   *   )
   * ```
   */
  listAndCountCampaigns(
    filters?: FilterableCampaignProps,
    config?: FindConfig<CampaignDTO>,
    sharedContext?: Context
  ): Promise<[CampaignDTO[], number]>

  /**
   * This method retrieves a campaigns by its ID.
   *
   * @param {string} id - The ID of the campaigns.
   * @param {FindConfig<CampaignDTO>} config - The configurations determining how the campaign is retrieved. Its properties, such as `select` or `relations`, accept the
   * attributes or relations associated with a campaign.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<CampaignDTO>} The retrieved campaigns.
   *
   * @example
   * A simple example that retrieves a promotion by its ID:
   *
   * ```ts
   * const campaign =
   *   await promotionModuleService.retrieveCampaign("procamp_123")
   * ```
   *
   * To specify relations that should be retrieved:
   *
   * ```ts
   * const campaign =
   *   await promotionModuleService.retrieveCampaign(
   *     "procamp_123",
   *     {
   *       relations: ["promotions"],
   *     }
   *   )
   * ```
   */
  retrieveCampaign(
    id: string,
    config?: FindConfig<CampaignDTO>,
    sharedContext?: Context
  ): Promise<CampaignDTO>

  /**
   * This method deletes campaigns by their IDs.
   *
   * @param {string[]} ids - The IDs of the campaigns.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the campaigns are deleted successfully.
   *
   * @example
   * await promotionModuleService.deleteCampaigns(["procamp_123"])
   */
  deleteCampaigns(ids: string[], sharedContext?: Context): Promise<void>

  /**
   * This method deletes a campaign by its ID.
   *
   * @param {string} ids - The IDs of the campaign.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void>} Resolves when the campaign is deleted successfully.
   *
   * @example
   * await promotionModuleService.deleteCampaigns("procamp_123")
   */
  deleteCampaigns(ids: string, sharedContext?: Context): Promise<void>

  /**
   * This method soft deletes campaigns by their IDs.
   *
   * @param {string | string[]} campaignIds - The IDs of the campaigns.
   * @param {SoftDeleteReturn<TReturnableLinkableKeys>} config - An object that is used to specify an entity's related entities that should be soft-deleted when the main entity is soft-deleted.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<string, string[]>>} An object that includes the IDs of related records that were also soft deleted, such as the ID of the associated campaign budget.
   * The object's keys are the ID attribute names of the campaign entity's relations, such as `budget_id`, and its value is an array of strings, each being the ID of a record associated
   * with the campaign through this relation, such as the IDs of associated campaign budget.
   *
   * If there are no related records, the promise resolves to `void`.
   *
   * @example
   * await promotionModuleService.softDeleteCampaigns(
   *   "procamp_123",
   *   {
   *     returnLinkableKeys: ["budget_id"],
   *   }
   * )
   */
  softDeleteCampaigns<TReturnableLinkableKeys extends string = string>(
    campaignIds: string | string[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  /**
   * This method restores soft deleted campaigns by their IDs.
   *
   * @param {string | string[]} campaignIds - The IDs of the campaigns
   * @param {RestoreReturn<TReturnableLinkableKeys>} config - Configurations determining which relations to restore along with each of the campaigns. You can pass to its `returnLinkableKeys`
   * property any of the campaign's relation attribute names, such as `budget_id`.
   * @param {Context} sharedContext - A context used to share resources, such as transaction manager, between the application and the module.
   * @returns {Promise<void | Record<string, string[]>>} An object that includes the IDs of related records that were restored, such as the ID of associated campaign budget.
   * The object's keys are the ID attribute names of the campaign entity's relations, such as `budget_id`,
   * and its value is an array of strings, each being the ID of the record associated with the campaign through this relation,
   * such as the IDs of associated campaign budget.
   *
   * If there are no related records restored, the promise resolves to `void`.
   *
   * @example
   * await promotionModuleService.restoreCampaigns("procamp_123", {
   *   returnLinkableKeys: ["budget_id"],
   * })
   */
  restoreCampaigns<TReturnableLinkableKeys extends string = string>(
    campaignIds: string | string[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  addPromotionsToCampaign(
    data: AddPromotionsToCampaignDTO,
    sharedContext?: Context
  ): Promise<{ ids: string[] }>

  removePromotionsFromCampaign(
    data: RemovePromotionsFromCampaignDTO,
    sharedContext?: Context
  ): Promise<{ ids: string[] }>
}
