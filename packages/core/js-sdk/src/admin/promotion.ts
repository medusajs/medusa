import { HttpTypes } from "@medusajs/types"
import { Client } from "../client"
import { ClientHeaders } from "../types"

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

  async delete(id: string, headers?: ClientHeaders) {
    return await this.client.fetch<HttpTypes.DeleteResponse<"promotion">>(
      `/admin/promotions/${id}`,
      {
        method: "DELETE",
        headers,
      }
    )
  }

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

  async listRules(
    id: string | null,
    ruleType: string,
    query?: HttpTypes.AdminGetPromotionRuleParams,
    headers?: ClientHeaders
  ) {
    // eslint-disable-next-line max-len
    return await this.client.fetch<HttpTypes.AdminRuleAttributeOptionsListResponse>(
      `/admin/promotions/${id}/${ruleType}`,
      {
        headers,
        query,
      }
    )
  }

  async listRuleAttributes(
    ruleType: string,
    promotionType?: string,
    headers?: ClientHeaders
  ) {
    // eslint-disable-next-line max-len
    return await this.client.fetch<HttpTypes.AdminRuleAttributeOptionsListResponse>(
      `/admin/promotions/rule-attribute-options/${ruleType}`,
      {
        headers,
        query: { promotion_type: promotionType },
      }
    )
  }

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
