import { Context, ProductTypes } from "@medusajs/types"
import { DALUtils } from "@medusajs/utils"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { ProductOption } from "@models"

// eslint-disable-next-line max-len
export class ProductOptionRepository extends DALUtils.mikroOrmBaseRepositoryFactory<
  ProductOption,
  {
    update: ProductTypes.UpdateProductOptionDTO
  }
>(ProductOption) {
  constructor(...args: any[]) {
    // @ts-ignore
    super(...arguments)
  }

  async create(
    data: ProductTypes.CreateProductOptionDTO[],
    context: Context = {}
  ): Promise<ProductOption[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)
    const productIds: string[] = []

    data.forEach((d) => d.product_id && productIds.push(d.product_id))

    const productOptions = data.map((optionData) => {
      return manager.create(ProductOption, optionData)
    })

    return await super.create(productOptions, context)
  }

  async upsert(
    data:
      | ProductTypes.CreateProductOptionDTO[]
      | ProductTypes.UpdateProductOptionDTO[],
    context: Context = {}
  ): Promise<ProductOption[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const optionIds = data.map((optionData) => optionData.id).filter((o) => o)

    let existingOptions
    let existingOptionsMap = new Map()

    if (optionIds.length) {
      existingOptions = await this.find(
        {
          where: {
            id: {
              $in: optionIds,
            },
          },
        },
        context
      )

      existingOptionsMap = new Map(
        existingOptions.map((option) => [option.id, option])
      )
    }

    const upsertedOptions: ProductOption[] = []
    const optionsToCreate: ProductOption[] = []
    const optionsToUpdate: ProductOption[] = []

    data.forEach((option) => {
      const existingOption = existingOptionsMap.get(option.id)
      if (existingOption) {
        const updatedOption = manager.assign(existingOption, option)
        optionsToUpdate.push(updatedOption)
      } else {
        const newOption = manager.create(ProductOption, option)
        optionsToCreate.push(newOption)
      }
    })

    if (optionsToCreate.length) {
      manager.persist(optionsToCreate)
      upsertedOptions.push(...optionsToCreate)
    }

    if (optionsToUpdate.length) {
      manager.persist(optionsToUpdate)
      upsertedOptions.push(...optionsToUpdate)
    }

    return upsertedOptions
  }
}
