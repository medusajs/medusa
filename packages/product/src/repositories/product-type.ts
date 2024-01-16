import {
    Context,
    CreateProductTypeDTO,
    UpdateProductTypeDTO,
} from "@medusajs/types"
import { DALUtils } from "@medusajs/utils"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { ProductType } from "@models"

export class ProductTypeRepository extends DALUtils.mikroOrmBaseRepositoryFactory<
  ProductType,
  {
    create: CreateProductTypeDTO
    update: UpdateProductTypeDTO
  }
>(ProductType) {
  async upsert(
    types: CreateProductTypeDTO[],
    context: Context = {}
  ): Promise<ProductType[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const typesValues = types.map((type) => type.value)
    const existingTypes = await this.find(
      {
        where: {
          value: {
            $in: typesValues,
          },
        },
      },
      context
    )

    const existingTypesMap = new Map(
      existingTypes.map<[string, ProductType]>((type) => [type.value, type])
    )

    const upsertedTypes: ProductType[] = []
    const typesToCreate: ProductType[] = []
    const typesToUpdate: ProductType[] = []

    types.forEach((type) => {
      const aType = existingTypesMap.get(type.value)
      if (aType) {
        const updatedType = manager.assign(aType, type)
        typesToUpdate.push(updatedType)
      } else {
        const newType = manager.create(ProductType, type)
        typesToCreate.push(newType)
      }
    })

    if (typesToCreate.length) {
      manager.persist(typesToCreate)
      upsertedTypes.push(...typesToCreate)
    }

    if (typesToUpdate.length) {
      manager.persist(typesToUpdate)
      upsertedTypes.push(...typesToUpdate)
    }

    return upsertedTypes
  }
}
