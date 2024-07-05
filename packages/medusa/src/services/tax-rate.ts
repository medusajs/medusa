import { promiseAll } from "@medusajs/utils"
import { isDefined, MedusaError } from "medusa-core-utils"
import { EntityManager, ILike, In } from "typeorm"
import { TransactionBaseService } from "../interfaces"
import {
  ProductTaxRate,
  ProductTypeTaxRate,
  ShippingTaxRate,
  TaxRate,
} from "../models"
import { TaxRateRepository } from "../repositories/tax-rate"
import ProductService from "../services/product"
import ProductTypeService from "../services/product-type"
import ShippingOptionService from "../services/shipping-option"
import { FindConfig } from "../types/common"
import {
  CreateTaxRateInput,
  FilterableTaxRateProps,
  TaxRateListByConfig,
  UpdateTaxRateInput,
} from "../types/tax-rate"
import { buildQuery, PostgresError } from "../utils"

class TaxRateService extends TransactionBaseService {
  protected readonly productService_: ProductService
  protected readonly productTypeService_: ProductTypeService
  protected readonly shippingOptionService_: ShippingOptionService
  protected readonly taxRateRepository_: typeof TaxRateRepository

  constructor({
    productService,
    productTypeService,
    shippingOptionService,
    taxRateRepository,
  }) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])

    this.taxRateRepository_ = taxRateRepository
    this.productService_ = productService
    this.productTypeService_ = productTypeService
    this.shippingOptionService_ = shippingOptionService
  }

  async list(
    selector: FilterableTaxRateProps,
    config: FindConfig<TaxRate> = {}
  ): Promise<TaxRate[]> {
    const taxRateRepo = this.activeManager_.withRepository(
      this.taxRateRepository_
    )

    let q: string | undefined

    if (selector.q) {
      q = selector.q
      delete selector.q
    }

    const query = buildQuery(selector, config)

    if (q) {
      query.where["name"] = ILike(`%${q}%`)
    }

    return await taxRateRepo.findWithResolution(query)
  }

  async listAndCount(
    selector: FilterableTaxRateProps,
    config: FindConfig<TaxRate> = {}
  ): Promise<[TaxRate[], number]> {
    const taxRateRepo = this.activeManager_.withRepository(
      this.taxRateRepository_
    )

    let q: string | undefined

    if (selector.q) {
      q = selector.q
      delete selector.q
    }

    const query = buildQuery(selector, config)

    if (q) {
      query.where["name"] = ILike(`%${q}%`)
    }

    return await taxRateRepo.findAndCountWithResolution(query)
  }

  async retrieve(
    taxRateId: string,
    config: FindConfig<TaxRate> = {}
  ): Promise<TaxRate> {
    if (!isDefined(taxRateId)) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `"taxRateId" must be defined`
      )
    }

    const taxRateRepo = this.activeManager_.withRepository(
      this.taxRateRepository_
    )
    const query = buildQuery({ id: taxRateId }, config)

    const taxRate = await taxRateRepo.findOneWithResolution(query)
    if (!taxRate) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `TaxRate with ${taxRateId} was not found`
      )
    }

    return taxRate
  }

  async create(data: CreateTaxRateInput): Promise<TaxRate> {
    return await this.atomicPhase_(async (manager: EntityManager) => {
      const taxRateRepo = manager.withRepository(this.taxRateRepository_)

      if (typeof data.region_id === "undefined") {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "TaxRates must belong to a Region"
        )
      }

      const taxRate = taxRateRepo.create(data)
      return await taxRateRepo.save(taxRate)
    })
  }

  async update(id: string, data: UpdateTaxRateInput): Promise<TaxRate> {
    return await this.atomicPhase_(async (manager: EntityManager) => {
      const taxRateRepo = manager.withRepository(this.taxRateRepository_)
      const taxRate = await this.retrieve(id)

      for (const [k, v] of Object.entries(data)) {
        if (isDefined(v)) {
          taxRate[k] = v
        }
      }

      return await taxRateRepo.save(taxRate)
    })
  }

  async delete(id: string | string[]): Promise<void> {
    return await this.atomicPhase_(async (manager: EntityManager) => {
      const taxRateRepo = manager.withRepository(this.taxRateRepository_)
      const query = buildQuery({ id })
      if (Array.isArray(id)) {
        await taxRateRepo.delete({ id: In(id) })
      } else {
        await taxRateRepo.delete({ id: id })
      }
    })
  }

  async removeFromProduct(
    id: string,
    productIds: string | string[]
  ): Promise<void> {
    return await this.atomicPhase_(async (manager: EntityManager) => {
      const taxRateRepo = manager.withRepository(this.taxRateRepository_)

      let ids: string[]
      if (typeof productIds === "string") {
        ids = [productIds]
      } else {
        ids = productIds
      }

      await taxRateRepo.removeFromProduct(id, ids)
    })
  }

  async removeFromProductType(
    id: string,
    typeIds: string | string[]
  ): Promise<void> {
    return await this.atomicPhase_(async (manager: EntityManager) => {
      const taxRateRepo = manager.withRepository(this.taxRateRepository_)

      let ids: string[]
      if (typeof typeIds === "string") {
        ids = [typeIds]
      } else {
        ids = typeIds
      }

      await taxRateRepo.removeFromProductType(id, ids)
    })
  }

  async removeFromShippingOption(
    id: string,
    optionIds: string | string[]
  ): Promise<void> {
    return await this.atomicPhase_(async (manager: EntityManager) => {
      const taxRateRepo = manager.withRepository(this.taxRateRepository_)

      let ids: string[]
      if (typeof optionIds === "string") {
        ids = [optionIds]
      } else {
        ids = optionIds
      }

      await taxRateRepo.removeFromShippingOption(id, ids)
    })
  }

  async addToProduct(
    id: string,
    productIds: string | string[],
    replace = false
  ): Promise<ProductTaxRate | ProductTaxRate[]> {
    let ids: string[]
    if (typeof productIds === "string") {
      ids = [productIds]
    } else {
      ids = productIds
    }

    const result = await this.atomicPhase_(
      async (manager: EntityManager) => {
        const taxRateRepo = manager.withRepository(this.taxRateRepository_)
        return await taxRateRepo.addToProduct(id, ids, replace)
      },
      // eslint-disable-next-line
      async (err: any) => {
        if (err.code === PostgresError.FOREIGN_KEY_ERROR) {
          // A foreign key constraint failed meaning some thing doesn't exist
          // either it is a product or the tax rate itself. Using promiseAll
          // will try to retrieve all of the resources and will fail when
          // something is not found.
          await promiseAll([
            this.retrieve(id, { select: ["id"] }),
            ...ids.map(async (pId) =>
              this.productService_.retrieve(pId, { select: ["id"] })
            ),
          ])
        }
      }
    )
    return result
  }

  async addToProductType(
    id: string,
    productTypeIds: string | string[],
    replace = false
  ): Promise<ProductTypeTaxRate[]> {
    let ids: string[]
    if (typeof productTypeIds === "string") {
      ids = [productTypeIds]
    } else {
      ids = productTypeIds
    }

    return await this.atomicPhase_(
      async (manager: EntityManager) => {
        const taxRateRepo = manager.withRepository(this.taxRateRepository_)
        return await taxRateRepo.addToProductType(id, ids, replace)
      },
      // eslint-disable-next-line
      async (err: any) => {
        if (err.code === PostgresError.FOREIGN_KEY_ERROR) {
          // A foreign key constraint failed meaning some thing doesn't exist
          // either it is a product or the tax rate itself. Using promiseAll
          // will try to retrieve all of the resources and will fail when
          // something is not found.
          await promiseAll([
            this.retrieve(id, {
              select: ["id"],
            }) as Promise<unknown>,
            ...ids.map(
              async (pId) =>
                this.productTypeService_.retrieve(pId, {
                  select: ["id"],
                }) as Promise<unknown>
            ),
          ])
        }
      }
    )
  }

  async addToShippingOption(
    id: string,
    optionIds: string | string[],
    replace = false
  ): Promise<ShippingTaxRate[]> {
    let ids: string[]
    if (typeof optionIds === "string") {
      ids = [optionIds]
    } else {
      ids = optionIds
    }

    return await this.atomicPhase_(
      async (manager: EntityManager) => {
        const taxRateRepo = manager.withRepository(this.taxRateRepository_)
        const taxRate = await this.retrieve(id, { select: ["id", "region_id"] })
        const options = await this.shippingOptionService_.list(
          { id: ids },
          { select: ["id", "region_id"] }
        )
        for (const o of options) {
          if (o.region_id !== taxRate.region_id) {
            throw new MedusaError(
              MedusaError.Types.NOT_ALLOWED,
              `Shipping Option and Tax Rate must belong to the same Region to be associated. Shipping Option with id: ${o.id} belongs to Region with id: ${o.region_id} and Tax Rate with id: ${taxRate.id} belongs to Region with id: ${taxRate.region_id}`
            )
          }
        }
        return await taxRateRepo.addToShippingOption(id, ids, replace)
      },
      // eslint-disable-next-line
      async (err: any) => {
        if (err.code === PostgresError.FOREIGN_KEY_ERROR) {
          // A foreign key constraint failed meaning some thing doesn't exist
          // either it is a product or the tax rate itself. Using promiseAll
          // will try to retrieve all of the resources and will fail when
          // something is not found.
          await promiseAll([
            this.retrieve(id, { select: ["id"] }),
            ...ids.map(async (sId) =>
              this.shippingOptionService_.retrieve(sId, { select: ["id"] })
            ),
          ])
        }
      }
    )
  }

  async listByProduct(
    productId: string,
    config: TaxRateListByConfig
  ): Promise<TaxRate[]> {
    // Check both ProductTaxRate + ProductTypeTaxRate
    const taxRateRepo = this.activeManager_.withRepository(
      this.taxRateRepository_
    )
    return await taxRateRepo.listByProduct(productId, config)
  }

  async listByShippingOption(shippingOptionId: string): Promise<TaxRate[]> {
    const taxRateRepo = this.activeManager_.withRepository(
      this.taxRateRepository_
    )
    return await taxRateRepo.listByShippingOption(shippingOptionId)
  }
}

export default TaxRateService
