import { ProductOptionValue } from "@models"
import { Context, DAL } from "@medusajs/types"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { DALUtils } from "@medusajs/utils"
import {
  CreateProductOptionValueDTO,
  UpdateProductOptionValueDTO,
} from "../types/services/product-option-value"
import { LoadStrategy } from "@mikro-orm/core"
import { FilterQuery as MikroFilterQuery } from "@mikro-orm/core/typings"
import { FindOptions as MikroOptions } from "@mikro-orm/core/drivers/IDatabaseDriver"

export class ProductOptionValueRepository extends DALUtils.MikroOrmBaseRepository {
  protected readonly manager_: SqlEntityManager

  constructor({ manager }: { manager: SqlEntityManager }) {
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    super(...arguments)
    this.manager_ = manager
  }

  async find(
    findOptions: DAL.FindOptions<ProductOptionValue> = { where: {} },
    context: Context = {}
  ): Promise<ProductOptionValue[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)
    const findOptions_ = { ...findOptions }

    findOptions_.options ??= {}


    return await manager.find(
      ProductOptionValue,
      findOptions_.where as MikroFilterQuery<ProductOptionValue>,
      findOptions_.options as MikroOptions<ProductOptionValue>
    )
  }

  async upsert(
    optionValues: (UpdateProductOptionValueDTO | CreateProductOptionValueDTO)[],
    context: Context = {}
  ): Promise<ProductOptionValue[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const optionValueIds = optionValues
      .filter((option) => !!option.id)
      .map(({ id }) => id!)

    const existingOptionValues = await this.find(
      {
        where: {
          id: {
            $in: optionValueIds,
          },
        },
      },
      context
    )

    const existingOptionValuesMap = new Map(
      existingOptionValues.map<[string, ProductOptionValue]>((optionValue) => [
        optionValue.id,
        optionValue,
      ])
    )

    const upsertedOptionValues: ProductOptionValue[] = []
    const optionValuesToCreate: ProductOptionValue[] = []
    const optionValuesToUpdate: ProductOptionValue[] = []

    optionValues.forEach((optionValue) => {
      if (optionValue.id && existingOptionValuesMap.has(optionValue.id)) {
        const existingOptionValue = existingOptionValuesMap.get(optionValue.id)!
        const updatedOptionValue = manager.assign(
          existingOptionValue,
          optionValue as UpdateProductOptionValueDTO
        )
        optionValuesToUpdate.push(updatedOptionValue)
      } else {
        const newOptionValue = manager.create(
          ProductOptionValue,
          optionValue as CreateProductOptionValueDTO
        )
        optionValuesToCreate.push(newOptionValue)
      }
    })

    if (optionValuesToCreate.length) {
      manager.persist(optionValuesToCreate)
      upsertedOptionValues.push(...optionValuesToCreate)
    }

    if (optionValuesToUpdate.length) {
      manager.persist(optionValuesToUpdate)
      upsertedOptionValues.push(...optionValuesToUpdate)
    }

    return upsertedOptionValues
  }

  async delete(ids: string[], context: Context = {}): Promise<void> {
    const manager = this.getActiveManager<SqlEntityManager>(context)
    await manager.nativeDelete(ProductOptionValue, { id: { $in: ids } }, {})
  }
}
