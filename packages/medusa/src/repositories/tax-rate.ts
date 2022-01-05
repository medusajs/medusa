import { unionBy } from "lodash"
import { EntityRepository, Repository } from "typeorm"
import { TaxRate } from "../models/tax-rate"
import { ProductTaxRate } from "../models/product-tax-rate"
import { ProductTypeTaxRate } from "../models/product-type-tax-rate"
import { ShippingTaxRate } from "../models/shipping-tax-rate"
import { Product } from "../models/product"
import { ShippingMethod } from "../models/shipping-method"
import { TaxRateListByConfig } from "../types/tax-rate"

@EntityRepository(TaxRate)
export class TaxRateRepository extends Repository<TaxRate> {
  async addToProduct(
    id: string,
    productIds: string[]
  ): Promise<ProductTaxRate[]> {
    const toInsert = productIds.map((pId) => ({ rate_id: id, product_id: pId }))
    const insertResult = await this.createQueryBuilder()
      .insert()
      .into(ProductTaxRate)
      .values(toInsert)
      .execute()

    return this.createQueryBuilder()
      .select()
      .from(ProductTaxRate, "ptr")
      .where(insertResult.identifiers)
      .getMany()
  }

  async addToProductType(
    id: string,
    productTypeIds: string[]
  ): Promise<ProductTypeTaxRate[]> {
    const toInsert = productTypeIds.map((pId) => ({
      rate_id: id,
      product_type_id: pId,
    }))
    const insertResult = await this.createQueryBuilder()
      .insert()
      .into(ProductTypeTaxRate)
      .values(toInsert)
      .execute()

    return this.createQueryBuilder()
      .select()
      .from(ProductTypeTaxRate, "ptr")
      .where(insertResult.identifiers)
      .getMany()
  }

  async addToShippingOption(
    id: string,
    optionIds: string[]
  ): Promise<ShippingTaxRate[]> {
    const toInsert = optionIds.map((pId) => ({
      rate_id: id,
      shipping_option_id: pId,
    }))
    const insertResult = await this.createQueryBuilder()
      .insert()
      .into(ShippingTaxRate)
      .values(toInsert)
      .execute()

    return this.createQueryBuilder()
      .select()
      .from(ShippingTaxRate, "str")
      .where(insertResult.identifiers)
      .getMany()
  }

  async listByProduct(productId: string, config: TaxRateListByConfig) {
    let productRates = this.createQueryBuilder("txr")
      .leftJoin(ProductTaxRate, "ptr", "ptr.rate_id = txr.id")
      .leftJoin(Product, "prod", "prod.id = ptr.product_id")
      .where("prod.id = :productId", { productId })

    let typeRates = this.createQueryBuilder("txr")
      .leftJoin(ProductTypeTaxRate, "pttr", "pttr.rate_id = txr.id")
      .leftJoin(Product, "prod", "prod.type_id = pttr.product_type_id")
      .where("prod.id = :productId", { productId })

    if (typeof config.region_id !== "undefined") {
      productRates.andWhere("txr.region_id = :regionId", {
        regionId: config.region_id,
      })
      typeRates.andWhere("txr.region_id = :regionId", {
        regionId: config.region_id,
      })
    }

    const results = await Promise.all([
      productRates.getMany(),
      typeRates.getMany(),
    ])

    // Only return unique rates by joining the two arrays from typeRates and
    // productRates matching based on the id
    return unionBy(...results, (txr) => txr.id)
  }

  async listByShippingOption(optionId: string, config: TaxRateListByConfig) {
    let rates = this.createQueryBuilder("txr")
      .leftJoin(ShippingTaxRate, "ptr", "ptr.rate_id = txr.id")
      .leftJoin(
        ShippingMethod,
        "sm",
        "sm.shipping_option_id = ptr.shipping_option_id"
      )
      .where("sm.shipping_option_id = :optionId", { optionId })

    if (typeof config.region_id !== "undefined") {
      rates.andWhere("txr.region_id = :regionId", {
        regionId: config.region_id,
      })
    }
    return await rates.getMany()
  }
}
