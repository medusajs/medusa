import { MedusaError } from "medusa-core-utils"
import { FindOptionsWhere, ILike } from "typeorm"
import { ProductType } from "../models"
import { ProductTypeRepository } from "../repositories/product-type"
import { ExtendedFindConfig, FindConfig, Selector } from "../types/common"
import { TransactionBaseService } from "../interfaces"
import { buildQuery, isString, setMetadata } from "../utils"
import { CreateProductType, UpdateProductType } from "../types/product-type"
import { formatException } from "../utils"
import ImageRepository from "../repositories/image"

class ProductTypeService extends TransactionBaseService {
  protected readonly typeRepository_: typeof ProductTypeRepository
  protected readonly imageRepository_: typeof ImageRepository

  constructor({ productTypeRepository, imageRepository }) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])

    this.typeRepository_ = productTypeRepository
    this.imageRepository_ = imageRepository
  }

  /**
   * Gets a product type by id.
   * Throws in case of DB Error and if product was not found.
   * @param id - id of the product to get.
   * @param config - object that defines what should be included in the
   *   query response
   * @return the result of the find one operation.
   */
  async retrieve(
    id: string,
    config: FindConfig<ProductType> = {}
  ): Promise<ProductType> {
    const typeRepo = this.activeManager_.withRepository(this.typeRepository_)

    const query = buildQuery({ id }, config)
    const type = await typeRepo.findOne(query)

    if (!type) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Product type with id: ${id} was not found`
      )
    }

    return type
  }

  /**
   * Creates a product type
   * @param productType - the product type to create
   * @return created product type
   */
  async create(productType: CreateProductType): Promise<ProductType> {
    return await this.atomicPhase_(async (manager) => {
      const typeRepository = this.activeManager_.withRepository(
        this.typeRepository_
      )
      const imageRepo = this.activeManager_.withRepository(
        this.imageRepository_
      )

      const { images, ...rest } = productType
      if (!rest.thumbnail && images && images.length) {
        rest.thumbnail = images[0]
      }

      try {
        const result = typeRepository.create(rest)

        if (images?.length) {
          result.images = await imageRepo.upsertImages(images)
        }

        await typeRepository.save(result)

        return await this.retrieve(result.id)
      } catch (error) {
        throw formatException(error)
      }
    })
  }

  /**
   * Lists product types
   * @param selector - the query object for find
   * @param config - the config to be used for find
   * @return the result of the find operation
   */
  async list(
    selector: Selector<ProductType> & {
      q?: string
      discount_condition_id?: string
    } = {},
    config: FindConfig<ProductType> = { skip: 0, take: 20 }
  ): Promise<ProductType[]> {
    const [productTypes] = await this.listAndCount(selector, config)
    return productTypes
  }

  /**
   * Lists product types and adds count.
   * @param selector - the query object for find
   * @param config - the config to be used for find
   * @return the result of the find operation
   */
  async listAndCount(
    selector: Selector<ProductType> & {
      q?: string
      discount_condition_id?: string
    } = {},
    config: FindConfig<ProductType> = { skip: 0, take: 20 }
  ): Promise<[ProductType[], number]> {
    const typeRepo = this.activeManager_.withRepository(this.typeRepository_)

    let q
    if (isString(selector.q)) {
      q = selector.q
      delete selector.q
    }

    const query = buildQuery(
      selector,
      config
    ) as ExtendedFindConfig<ProductType> & {
      where: FindOptionsWhere<ProductType> & { discount_condition_id?: string }
    }

    if (q) {
      query.where.value = ILike(`%${q}%`)
    }

    if (query.where.discount_condition_id) {
      const discountConditionId = query.where.discount_condition_id as string
      delete query.where.discount_condition_id
      return await typeRepo.findAndCountByDiscountConditionId(
        discountConditionId,
        query
      )
    }

    return await typeRepo.findAndCount(query)
  }

  /**
   * Deletes a product type idempotently
   * @param productTypeId - id of product type to delete
   * @return empty promise
   */
  async delete(productTypeId: string): Promise<void> {
    return await this.atomicPhase_(async (manager) => {
      const typeRepo = this.activeManager_.withRepository(this.typeRepository_)
      const productType = await this.retrieve(productTypeId)

      if (!productType) {
        return Promise.resolve()
      }

      await typeRepo.softRemove(productType)
      return Promise.resolve()
    })
  }

  /**
   * Updates a product type
   * @param productTypeId - id of product type to update
   * @param update - update object
   * @return update product type
   */
  async update(
    productTypeId: string,
    update: UpdateProductType
  ): Promise<ProductType> {
    return await this.atomicPhase_(async (manager) => {
      const typeRepo = this.activeManager_.withRepository(this.typeRepository_)
      const imageRepo = this.activeManager_.withRepository(
        this.imageRepository_
      )

      const productType = await this.retrieve(productTypeId, {
        relations: ["images"],
      })

      const { metadata, images, ...rest } = update
      if (!productType.thumbnail && !update.thumbnail && images?.length) {
        productType.thumbnail = images[0]
      }

      if (images) {
        productType.images = await imageRepo.upsertImages(images)
      }

      if (metadata) {
        productType.metadata = setMetadata(productType, metadata)
      }

      for (const [key, value] of Object.entries(rest)) {
        productType[key] = value
      }
      return typeRepo.save(productType)
    })
  }
}

export default ProductTypeService
