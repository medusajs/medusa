import { BaseService } from "medusa-interfaces"
import { EntityManager } from "typeorm"
import { MedusaError } from "medusa-core-utils"
import { TaxRate } from "../models/tax-rate"
import { ShippingTaxRate } from "../models/shipping-tax-rate"
import { ProductTaxRate } from "../models/product-tax-rate"
import { ProductTypeTaxRate } from "../models/product-type-tax-rate"
import { TaxRateRepository } from "../repositories/tax-rate"
import { ShippingOptionRepository } from "../repositories/shipping-option"
import { FindConfig } from "../types/common"
import {
  CreateTaxRateInput,
  UpdateTaxRateInput,
  TaxRateListByConfig,
  FilterableTaxRateProps,
} from "../types/tax-rate"

class TaxRateService extends BaseService {
  private manager_: EntityManager
  private taxRateRepository_: typeof TaxRateRepository
  private shippingOptionRepository_: typeof ShippingOptionRepository

  constructor({ manager, taxRateRepository, shippingOptionRepository }) {
    super()

    this.manager_ = manager
    this.taxRateRepository_ = taxRateRepository
    this.shippingOptionRepository_ = shippingOptionRepository
  }

  withTransaction(transactionManager: EntityManager): TaxRateService {
    if (!transactionManager) {
      return this
    }

    const cloned = new TaxRateService({
      manager: transactionManager,
      taxRateRepository: this.taxRateRepository_,
      shippingOptionRepository: this.shippingOptionRepository_,
    })

    cloned.transactionManager_ = transactionManager
    cloned.manager_ = transactionManager

    return cloned
  }

  async list(
    selector: FilterableTaxRateProps,
    config: FindConfig<TaxRate> = {}
  ): Promise<TaxRate[]> {
    const taxRateRepo = this.manager_.getCustomRepository(
      this.taxRateRepository_
    )
    const query = this.buildQuery_(selector, config)
    return await taxRateRepo.findWithResolution(query)
  }

  async listAndCount(
    selector: FilterableTaxRateProps,
    config: FindConfig<TaxRate> = {}
  ): Promise<[TaxRate[], number]> {
    const taxRateRepo = this.manager_.getCustomRepository(
      this.taxRateRepository_
    )
    const query = this.buildQuery_(selector, config)
    return await taxRateRepo.findAndCountWithResolution(query)
  }

  async retrieve(
    id: string,
    config: FindConfig<TaxRate> = {}
  ): Promise<TaxRate> {
    return await this.atomicPhase_(async (manager: EntityManager) => {
      const taxRateRepo = manager.getCustomRepository(this.taxRateRepository_)
      const query = this.buildQuery_({ id }, config)

      const taxRate = await taxRateRepo.findOneWithResolution(query)
      if (!taxRate) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `TaxRate with ${id} was not found`
        )
      }

      return taxRate
    })
  }

  async create(data: CreateTaxRateInput): Promise<TaxRate> {
    return await this.atomicPhase_(async (manager: EntityManager) => {
      const taxRateRepo = manager.getCustomRepository(this.taxRateRepository_)

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
      const taxRateRepo = manager.getCustomRepository(this.taxRateRepository_)
      const taxRate = await this.retrieve(id)

      for (const [k, v] of Object.entries(data)) {
        if (typeof v !== "undefined") {
          taxRate[k] = v
        }
      }

      return await taxRateRepo.save(taxRate)
    })
  }

  async delete(id: string | string[]): Promise<void> {
    return await this.atomicPhase_(async (manager: EntityManager) => {
      const taxRateRepo = manager.getCustomRepository(this.taxRateRepository_)
      const query = this.buildQuery_({ id })
      await taxRateRepo.delete(query.where)
    })
  }

  async addToProduct(
    id: string,
    productIds: string | string[]
  ): Promise<ProductTaxRate | ProductTaxRate[]> {
    return await this.atomicPhase_(async (manager: EntityManager) => {
      const taxRateRepo = manager.getCustomRepository(this.taxRateRepository_)

      let ids: string[]
      if (typeof productIds === "string") {
        ids = [productIds]
      } else {
        ids = productIds
      }

      return await taxRateRepo.addToProduct(id, ids)
    })
  }

  async addToProductType(
    id: string,
    productTypeIds: string | string[]
  ): Promise<ProductTypeTaxRate[]> {
    return await this.atomicPhase_(async (manager: EntityManager) => {
      const taxRateRepo = manager.getCustomRepository(this.taxRateRepository_)

      let ids: string[]
      if (typeof productTypeIds === "string") {
        ids = [productTypeIds]
      } else {
        ids = productTypeIds
      }

      return await taxRateRepo.addToProductType(id, ids)
    })
  }

  async addToShippingOption(
    id: string,
    optionIds: string | string[]
  ): Promise<ShippingTaxRate> {
    return await this.atomicPhase_(async (manager: EntityManager) => {
      const taxRateRepo = manager.getCustomRepository(this.taxRateRepository_)
      const shippingOptionRepo = manager.getCustomRepository(
        this.shippingOptionRepository_
      )

      let ids: string[]
      if (typeof optionIds === "string") {
        ids = [optionIds]
      } else {
        ids = optionIds
      }

      const taxRate = await this.retrieve(id, { select: ["id", "region_id"] })
      const query = this.buildQuery_(
        { id: ids },
        { select: ["id", "region_id"] }
      )
      const options = await shippingOptionRepo.find(query)
      for (const o of options) {
        if (o.region_id !== taxRate.region_id) {
          throw new MedusaError(
            MedusaError.Types.NOT_ALLOWED,
            `Shipping Option and Tax Rate must belong to the same Region to be associated. Shipping Option with id: ${o.id} belongs to Region with id: ${o.region_id} and Tax Rate with id: ${taxRate.id} belongs to Region with id: ${taxRate.region_id}`
          )
        }
      }

      return await taxRateRepo.addToShippingOption(id, ids)
    })
  }

  async listByProduct(
    productId: string,
    config: TaxRateListByConfig
  ): Promise<TaxRate[]> {
    // Check both ProductTaxRate + ProductTypeTaxRate
    return await this.atomicPhase_(async (manager: EntityManager) => {
      const taxRateRepo = manager.getCustomRepository(this.taxRateRepository_)
      return await taxRateRepo.listByProduct(productId, config)
    })
  }

  async listByShippingOption(
    shippingOptionId: string,
    config: TaxRateListByConfig
  ): Promise<TaxRate[]> {
    return await this.atomicPhase_(async (manager: EntityManager) => {
      const taxRateRepo = manager.getCustomRepository(this.taxRateRepository_)
      return await taxRateRepo.listByShippingOption(shippingOptionId, config)
    })
  }
}

export default TaxRateService
