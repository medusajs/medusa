import {
  FilterQuery as MikroFilterQuery,
  FindOptions as MikroOptions,
  LoadStrategy,
  RequiredEntityData,
} from "@mikro-orm/core"
import { ProductTag } from "@models"
import {
  Context,
  CreateProductTagDTO,
  DAL,
  UpdateProductTagDTO,
  UpsertProductTagDTO,
} from "@medusajs/types"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import {
  DALUtils,
  InjectTransactionManager,
  MedusaContext,
  MedusaError,
} from "@medusajs/utils"

export class ProductTagRepository extends DALUtils.MikroOrmBaseRepository {
  protected readonly manager_: SqlEntityManager

  constructor({ manager }: { manager: SqlEntityManager }) {
    // @ts-ignore
    super(...arguments)
    this.manager_ = manager
  }

  async find(
    findOptions: DAL.FindOptions<ProductTag> = { where: {} },
    context: Context = {}
  ): Promise<ProductTag[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)
    const findOptions_ = { ...findOptions }

    findOptions_.options ??= {}

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await manager.find(
      ProductTag,
      findOptions_.where as MikroFilterQuery<ProductTag>,
      findOptions_.options as MikroOptions<ProductTag>
    )
  }

  async findAndCount(
    findOptions: DAL.FindOptions<ProductTag> = { where: {} },
    context: Context = {}
  ): Promise<[ProductTag[], number]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await manager.findAndCount(
      ProductTag,
      findOptions_.where as MikroFilterQuery<ProductTag>,
      findOptions_.options as MikroOptions<ProductTag>
    )
  }

  @InjectTransactionManager()
  async create(
    data: CreateProductTagDTO[],
    @MedusaContext()
    context: Context = {}
  ): Promise<ProductTag[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const productTags = data.map((tagData) => {
      return manager.create(ProductTag, tagData)
    })

    await manager.persist(productTags)

    return productTags
  }

  @InjectTransactionManager()
  async update(
    data: UpdateProductTagDTO[],
    @MedusaContext()
    context: Context = {}
  ): Promise<ProductTag[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)
    const tagIds = data.map((tagData) => tagData.id)
    const existingTags = await this.find(
      {
        where: {
          id: {
            $in: tagIds,
          },
        },
      },
      context
    )

    const existingTagsMap = new Map(
      existingTags.map<[string, ProductTag]>((tag) => [tag.id, tag])
    )

    const productTags = data.map((tagData) => {
      const existingTag = existingTagsMap.get(tagData.id)

      if (!existingTag) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `ProductTag with id "${tagData.id}" not found`
        )
      }

      return manager.assign(existingTag, tagData)
    })

    await manager.persist(productTags)

    return productTags
  }

  @InjectTransactionManager()
  async upsert(
    tags: UpsertProductTagDTO[],
    @MedusaContext()
    context: Context = {}
  ): Promise<ProductTag[]> {
    const { transactionManager: manager } = context
    const tagsValues = tags.map((tag) => tag.value)
    const existingTags = await this.find(
      {
        where: {
          value: {
            $in: tagsValues,
          },
        },
      },
      context
    )

    const existingTagsMap = new Map(
      existingTags.map<[string, ProductTag]>((tag) => [tag.value, tag])
    )

    const upsertedTags: ProductTag[] = []
    const tagsToCreate: RequiredEntityData<ProductTag>[] = []

    tags.forEach((tag) => {
      const aTag = existingTagsMap.get(tag.value)
      if (aTag) {
        upsertedTags.push(aTag)
      } else {
        const newTag = (manager as SqlEntityManager).create(ProductTag, tag)
        tagsToCreate.push(newTag)
      }
    })

    if (tagsToCreate.length) {
      const newTags: ProductTag[] = []
      tagsToCreate.forEach((tag) => {
        newTags.push((manager as SqlEntityManager).create(ProductTag, tag))
      })

      await (manager as SqlEntityManager).persist(newTags)
      upsertedTags.push(...newTags)
    }

    return upsertedTags
  }

  @InjectTransactionManager()
  async delete(
    ids: string[],
    @MedusaContext()
    context: Context = {}
  ): Promise<void> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    await manager.nativeDelete(ProductTag, { id: { $in: ids } }, {})
  }
}
