import { unionBy } from "lodash"
import {
  SelectQueryBuilder,
  EntityRepository,
  FindManyOptions,
  FindOptionsUtils,
  Repository,
} from "typeorm"
import { TaxRate } from "../models/tax-rate"
import { ProductTaxRate } from "../models/product-tax-rate"
import { ProductTypeTaxRate } from "../models/product-type-tax-rate"
import { ShippingTaxRate } from "../models/shipping-tax-rate"
import { Product } from "../models/product"
import { ShippingMethod } from "../models/shipping-method"
import { TaxRateListByConfig } from "../types/tax-rate"

const resolveableFields = [
  "product_count",
  "product_type_count",
  "shipping_option_count",
]

@EntityRepository(TaxRate)
export class TaxRateRepository extends Repository<TaxRate> {
  getFindQueryBuilder(findOptions: FindManyOptions<TaxRate>) {
    let qb = this.createQueryBuilder("tr")
    const cleanOptions = findOptions

    const resolverFields: string[] = []
    if (typeof findOptions.select !== "undefined") {
      let selectableCols: (keyof TaxRate)[] = []
      for (const k of findOptions.select) {
        if (!resolveableFields.includes(k)) {
          selectableCols.push(k)
        } else {
          resolverFields.push(k)
        }
      }
      cleanOptions.select = selectableCols
    }

    FindOptionsUtils.applyFindManyOptionsOrConditionsToQueryBuilder(
      qb,
      cleanOptions
    )

    if (resolverFields.length > 0) {
      this.applyResolutionsToQueryBuilder(qb, resolverFields)
    }

    return qb
  }

  async findWithResolution(findOptions: FindManyOptions<TaxRate>) {
    const qb = this.getFindQueryBuilder(findOptions)
    return await qb.getMany()
  }

  async findOneWithResolution(findOptions: FindManyOptions<TaxRate>) {
    const qb = this.getFindQueryBuilder(findOptions)
    return await qb.getOne()
  }

  async findAndCountWithResolution(findOptions: FindManyOptions<TaxRate>) {
    const qb = this.getFindQueryBuilder(findOptions)
    return await qb.getManyAndCount()
  }

  applyResolutionsToQueryBuilder(
    qb: SelectQueryBuilder<TaxRate>,
    resolverFields: string[]
  ): SelectQueryBuilder<TaxRate> {
    for (const k of resolverFields) {
      switch (k) {
        case "product_count":
          qb.loadRelationCountAndMap(
            `${qb.alias}.product_count`,
            `${qb.alias}.products`
          )
          break
        case "product_type_count":
          qb.loadRelationCountAndMap(
            `${qb.alias}.product_type_count`,
            `${qb.alias}.product_types`
          )
          break
        case "shipping_option_count":
          qb.loadRelationCountAndMap(
            `${qb.alias}.shipping_option_count`,
            `${qb.alias}.shipping_options`
          )
          break
        default:
          break
      }
    }

    return qb
  }

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

    return await this.manager
      .createQueryBuilder(ProductTaxRate, "ptr")
      .select()
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

    return await this.manager
      .createQueryBuilder(ProductTypeTaxRate, "ptr")
      .select()
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

    return await this.manager
      .createQueryBuilder(ShippingTaxRate, "str")
      .select()
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
