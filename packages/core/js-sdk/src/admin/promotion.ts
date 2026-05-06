import { HttpTypes } from "@medusajs/types"
import { Client } from "../client.js"
import { ClientHeaders } from "../types.js"

export class Promotion {
  /**
   * @ignore
   */
  private client: Client
  /**
   * @ignore
   */
  constructor(client: Client) {
    this.client = client
  }

  /**
   * This method retrieves a promotion by its ID. It sends a request to the
   * [Retrieve Promotion](https://docs.medusajs.com/api/admin#promotions_getpromotionsid)
   * API route.
   *
   * @param id - The promotion's ID.
   * @param query - Configure the fields to retrieve in the promotion.
   * @param headers - Headers to pass in the request.
   * @returns The promotion's details.
   *
   * @example
   * To retrieve a promotion by its ID:
   *
   * ```ts
   * sdk.admin.promotion.retrieve("promo_123")
   * .then(({ promotion }) => {
   *   console.log(promotion)
   * })
   * ```
   *
   * To specify the fields and relations to retrieve:
   *
   * ```ts
   * sdk.admin.promotion.retrieve("promo_123", {
   *   fields: "id,*application_method"
   * })
   * .then(({ promotion }) => {
   *   console.log(promotion)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/admin#select-fields-and-relations).
   */
  async retrieve(
    id: string,
    query?: HttpTypes.AdminGetPromotionParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminPromotionResponse>(
      `/admin/promotions/${id}`,
      {
        headers,
        query,
      }
    )
  }

  /**
   * This method retrieves a list of promotions. It sends a request to the
   * [List Promotions](https://docs.medusajs.com/api/admin#promotions_getpromotions)
   * API route.
   *
   * @param query - Filters and pagination configurations.
   * @param headers - Headers to pass in the request.
   * @returns The list of promotions.
   *
   * @example
   * To retrieve the list of promotions:
   *
   * ```ts
   * sdk.admin.promotion.list()
   * .then(({ promotions, count, limit, offset }) => {
   *   console.log(promotions)
   * })
   * ```
   *
   * To configure the pagination, pass the `limit` and `offset` query parameters.
   *
   * For example, to retrieve only 10 items and skip 10 items:
   *
   * ```ts
   * sdk.admin.promotion.list({
   *   limit: 10,
   *   offset: 10
   * })
   * .then(({ promotions, count, limit, offset }) => {
   *   console.log(promotions)
   * })
   * ```
   *
   * Using the `fields` query parameter, you can specify the fields and relations to retrieve
   * in each promotion:
   *
   * ```ts
   * sdk.admin.promotion.list({
   *   fields: "id,*application_method"
   * })
   * .then(({ promotions, count, limit, offset }) => {
   *   console.log(promotions)
   * })
   * ```
   *
   * Learn more about the `fields` property in the [API reference](https://docs.medusajs.com/api/admin#select-fields-and-relations).
   */
  async list(
    query?: HttpTypes.AdminGetPromotionsParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminPromotionListResponse>(
      `/admin/promotions`,
      {
        headers,
        query,
      }
    )
  }

  /**
   * This method creates a new promotion. It sends a request to the
   * [Create Promotion](https://docs.medusajs.com/api/admin#promotions_postpromotions)
   * API route.
   *
   * @param payload - The promotion to create.
   * @param headers - Headers to pass in the request.
   * @returns The promotion's details.
   *
   * @example
   * sdk.admin.promotion.create({
   *   name: "My Promotion",
   *   description: "This is a test promotion",
   *   code: "PROMO123",
   *   starts_at: "2021-01-01",
   *   ends_at: "2021-01-01",
   * })
   * .then(({ promotion }) => {
   *   console.log(promotion)
   * })
   */
  async create(
    payload: HttpTypes.AdminCreatePromotion,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminPromotionResponse>(
      `/admin/promotions`,
      {
        method: "POST",
        headers,
        body: payload,
      }
    )
  }

  /**
   * This method updates a promotion. It sends a request to the
   * [Update Promotion](https://docs.medusajs.com/api/admin#promotions_postpromotionsid)
   * API route.
   *
   * @param id - The promotion's ID.
   * @param payload - The details to update in the promotion.
   * @param headers - Headers to pass in the request.
   * @returns The promotion's details.
   *
   * @example
   * sdk.admin.promotion.update("promo_123", {
   *   code: "PROMO123",
   * })
   * .then(({ promotion }) => {
   *   console.log(promotion)
   * })
   */
  async update(
    id: string,
    payload: HttpTypes.AdminUpdatePromotion,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminPromotionResponse>(
      `/admin/promotions/${id}`,
      {
        method: "POST",
        headers,
        body: payload,
      }
    )
  }

  /**
   * This method deletes a promotion. It sends a request to the
   * [Delete Promotion](https://docs.medusajs.com/api/admin#promotions_deletepromotionsid)
   * API route.
   *
   * @param id - The promotion's ID.
   * @param headers - Headers to pass in the request.
   * @returns The deleted promotion's details.
   *
   * @example
   * sdk.admin.promotion.delete("promo_123")
   * .then(({ promotion }) => {
   *   console.log(promotion)
   * })
   */
  async delete(id: string, headers?: ClientHeaders) {
    return await this.client.fetch<HttpTypes.DeleteResponse<"promotion">>(
      `/admin/promotions/${id}`,
      {
        method: "DELETE",
        headers,
      }
    )
  }

  /**
   * This method creates and adds rules to a promotion. It can be the promotion's rules,
   * or its application method's buy or target rules. That depends on the rule type
   * you specify as a parameter.
   *
   * - If you set the `ruleType` to `rules`, the method sends a request to the
   * [Manage Promotion's Rules API Route](https://docs.medusajs.com/api/admin#promotions_postpromotionsidrulesbatch).
   * - If you set the `ruleType` to `buy-rules`, the method sends a request to the
   * [Manage Promotion's Buy Rules API Route](https://docs.medusajs.com/api/admin#promotions_postpromotionsidbuyrulesbatch).
   * - If you set the `ruleType` to `target-rules`, the method sends a request to the
   * [Manage Promotion's Target Rules API Route](https://docs.medusajs.com/api/admin#promotions_postpromotionsidtargetrulesbatch).
   *
   * @param id - The promotion's ID.
   * @param ruleType - The type of rules to create.
   * @param payload - The rules to create.
   * @param headers - Headers to pass in the request.
   * @returns The promotion's details.
   *
   * @example
   * sdk.admin.promotion.addRules("promo_123", "rules", {
   *   rules: [
   *     {
   *       operator: "eq",
   *       attribute: "product_id",
   *       values: ["prod_123"]
   *     }
   *   ]
   * })
   * .then(({ promotion }) => {
   *   console.log(promotion)
   * })
   */
  async addRules(
    id: string,
    ruleType: string,
    payload: HttpTypes.BatchAddPromotionRulesReq,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminPromotionResponse>(
      `/admin/promotions/${id}/${ruleType}/batch`,
      {
        method: "POST",
        headers,
        body: { create: payload.rules },
      }
    )
  }

  /**
   * This method updates the rules of a promotion. It can be the promotion's rules,
   * or its application method's buy or target rules. That depends on the rule type
   * you specify as a parameter.
   *
   * - If you set the `ruleType` to `rules`, the method sends a request to the
   * [Manage Promotion's Rules API Route](https://docs.medusajs.com/api/admin#promotions_postpromotionsidrulesbatch).
   * - If you set the `ruleType` to `buy-rules`, the method sends a request to the
   * [Manage Promotion's Buy Rules API Route](https://docs.medusajs.com/api/admin#promotions_postpromotionsidbuyrulesbatch).
   * - If you set the `ruleType` to `target-rules`, the method sends a request to the
   * [Manage Promotion's Target Rules API Route](https://docs.medusajs.com/api/admin#promotions_postpromotionsidtargetrulesbatch).
   *
   * @param id - The promotion's ID.
   * @param ruleType - The type of rules to update.
   * @param payload - The rules to update.
   * @param headers - Headers to pass in the request.
   * @returns The promotion's details.
   *
   * @example
   * sdk.admin.promotion.updateRules("promo_123", "rules", {
   *   rules: [
   *     {
   *       id: "rule_123",
   *       operator: "ne",
   *     }
   *   ]
   * })
   * .then(({ promotion }) => {
   *   console.log(promotion)
   * })
   */
  async updateRules(
    id: string,
    ruleType: string,
    payload: HttpTypes.BatchUpdatePromotionRulesReq,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminPromotionResponse>(
      `/admin/promotions/${id}/${ruleType}/batch`,
      {
        method: "POST",
        headers,
        body: { update: payload.rules },
      }
    )
  }

  /**
   * This method removes rules from a promotion. It can be the promotion's rules,
   * or its application method's buy or target rules. That depends on the rule type
   * you specify as a parameter.
   *
   * - If you set the `ruleType` to `rules`, the method sends a request to the
   * [Manage Promotion's Rules API Route](https://docs.medusajs.com/api/admin#promotions_postpromotionsidrulesbatch).
   * - If you set the `ruleType` to `buy-rules`, the method sends a request to the
   * [Manage Promotion's Buy Rules API Route](https://docs.medusajs.com/api/admin#promotions_postpromotionsidbuyrulesbatch).
   * - If you set the `ruleType` to `target-rules`, the method sends a request to the
   * [Manage Promotion's Target Rules API Route](https://docs.medusajs.com/api/admin#promotions_postpromotionsidtargetrulesbatch).
   *
   * @param id - The promotion's ID.
   * @param ruleType - The type of rules to remove.
   * @param payload - The rules to remove.
   * @param headers - Headers to pass in the request.
   * @returns The promotion's details.
   *
   * @example
   * sdk.admin.promotion.removeRules("promo_123", "rules", {
   *   rule_ids: ["rule_123"]
   * })
   * .then(({ promotion }) => {
   *   console.log(promotion)
   * })
   */
  async removeRules(
    id: string,
    ruleType: string,
    payload: HttpTypes.BatchRemovePromotionRulesReq,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminPromotionResponse>(
      `/admin/promotions/${id}/${ruleType}/batch`,
      {
        method: "POST",
        headers,
        body: { delete: payload.rule_ids },
      }
    )
  }

  /**
   * This method retrieves the rules of a promotion. It can be the promotion's rules,
   * or its application method's buy or target rules. That depends on the rule type
   * you specify as a parameter.
   *
   * This method sends a request to the
   * [List Rules of a Promotion API Route](https://docs.medusajs.com/api/admin#promotions_getpromotionsidrule_type)
   *
   * @param id - The promotion's ID.
   * @param ruleType - The type of rules to retrieve. Can be `rules`, `buy-rules`, or `target-rules`.
   * @param query - Configure the fields to retrieve in the rules.
   * @param headers - Headers to pass in the request.
   * @returns The promotion's rules.
   *
   * @example
   * sdk.admin.promotion.listRules("promo_123", "rules")
   * .then(({ rules }) => {
   *   console.log(rules)
   * })
   */
  async listRules(
    id: string | null,
    ruleType: string,
    query?: HttpTypes.AdminGetPromotionRuleParams,
    headers?: ClientHeaders
  ) {
    // eslint-disable-next-line max-len
    return await this.client.fetch<HttpTypes.AdminPromotionRuleListResponse>(
      `/admin/promotions/${id}/${ruleType}`,
      {
        headers,
        query,
      }
    )
  }

  /**
   * Retrieve a list of potential rule attributes for the promotion and application method types specified in the query parameters. Only the attributes of the rule type specified in the path parameter are retrieved:
   *
   * - If `rule_type` is `rules`, the attributes of the promotion's type are retrieved.
   * - If `rule_type` is `target-rules`, the target rules' attributes of the application method's type are retrieved.
   * - If `rule_type` is `buy-rules`, the buy rules' attributes of the application method's type are retrieved.
   *
   * This method sends a request to the
   * [List Rule Attribute Options API Route](https://docs.medusajs.com/api/admin#promotions_getpromotionsruleattributeoptionsrule_type)
   *
   * @param ruleType - The type of rules to retrieve the attributes for. Can be `rules`, `buy-rules`, or `target-rules`.
   * @param promotionType - The type of promotion to retrieve the attributes for. It can be `standard` or `buyget`.
   * @param applicationMethodTargetType - The type of application method to retrieve the attributes for. It can be `order`, `items` (default) or `shipping_methods`.
   * @param headers - Headers to pass in the request.
   * @returns The list of rule attributes.
   *
   * @example
   * sdk.admin.promotion.listRuleAttributes("rules", "standard")
   * .then(({ attributes }) => {
   *   console.log(attributes)
   * })
   */
  async listRuleAttributes(
    ruleType: string,
    promotionType?: string,
    applicationMethodTargetType?: string,
    headers?: ClientHeaders
  ) {
    // eslint-disable-next-line max-len
    return await this.client.fetch<HttpTypes.AdminRuleAttributeOptionsListResponse>(
      `/admin/promotions/rule-attribute-options/${ruleType}`,
      {
        headers,
        query: {
          promotion_type: promotionType,
          application_method_target_type: applicationMethodTargetType,
        },
      }
    )
  }

  /**
   * Retrieve all potential values for promotion rules and target and buy rules based on the specified rule attribute and type.
   * For example, if you provide the ID of the `currency_code` rule attribute, and set `rule_type` to rules,
   * a list of currencies are retrieved in label-value pairs.
   *
   * This method sends a request to the
   * [List Rule Values API Route](https://docs.medusajs.com/api/admin#promotions_getpromotionsrulevalueoptionsrule_typerule_attribute_id)
   *
   * @param ruleType - The type of rules to retrieve the values for. Can be `rules`, `buy-rules`, or `target-rules`.
   * @param ruleValue - The ID of the rule attribute to retrieve the values for.
   * @param query - Configure the fields to retrieve in the rule values.
   * @param headers - Headers to pass in the request.
   * @returns The list of rule values.
   *
   * @example
   * sdk.admin.promotion.listRuleValues("rules", "attr_123")
   * .then(({ values }) => {
   *   console.log(values)
   * })
   */
  async listRuleValues(
    ruleType: string,
    ruleValue: string,
    query?: HttpTypes.AdminGetPromotionsRuleValueParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminRuleValueOptionsListResponse>(
      `/admin/promotions/rule-value-options/${ruleType}/${ruleValue}`,
      {
        headers,
        query,
      }
    )
  }
}
