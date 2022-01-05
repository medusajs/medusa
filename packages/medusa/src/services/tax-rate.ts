import { BaseService } from "medusa-interfaces"
import { EntityManager } from "typeorm"
import { MedusaError } from "medusa-core-utils"
import { TaxRate } from "../models/tax-rate"
import { ShippingTaxRate } from "../models/shipping-tax-rate"
import { ProductTaxRate } from "../models/product-tax-rate"
import { ProductTypeTaxRate } from "../models/product-type-tax-rate"
import { TaxRateRepository } from "../repositories/tax-rate"
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

  constructor({ manager, taxRateRepository }) {
    super()

    this.manager_ = manager
    this.taxRateRepository_ = taxRateRepository
  }

  withTransaction(transactionManager: EntityManager): TaxRateService {
    if (!transactionManager) {
      return this
    }

    const cloned = new TaxRateService({
      manager: transactionManager,
      taxRateRepository: this.taxRateRepository_,
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
    return await taxRateRepo.find(query)
  }

  async listAndCount(
    selector: FilterableTaxRateProps,
    config: FindConfig<TaxRate> = {}
  ): Promise<[TaxRate[], number]> {
    const taxRateRepo = this.manager_.getCustomRepository(
      this.taxRateRepository_
    )
    const query = this.buildQuery_(selector, config)
    return await taxRateRepo.findAndCount(query)
  }

  async retrieve(
    id: string,
    config: FindConfig<TaxRate> = {}
  ): Promise<TaxRate> {
    const taxRateRepo = this.manager_.getCustomRepository(
      this.taxRateRepository_
    )
    const query = this.buildQuery_({ id }, config)

    const taxRate = await taxRateRepo.findOne(query)
    if (!taxRate) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `TaxRate with ${id} was not found`
      )
    }

    return taxRate
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
      await taxRateRepo.delete(query)
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
  ): Promise<ProductTypeTaxRate> {
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

      let ids: string[]
      if (typeof optionIds === "string") {
        ids = [optionIds]
      } else {
        ids = optionIds
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
