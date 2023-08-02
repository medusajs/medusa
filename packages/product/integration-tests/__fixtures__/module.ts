import { DALUtils } from "@medusajs/utils"

class CustomRepository extends DALUtils.MikroOrmBaseRepository {
  constructor({ manager }) {
    // @ts-ignore
    super(...arguments)
  }
}

CustomRepository.prototype.find = jest.fn().mockImplementation(async () => [])
CustomRepository.prototype.findAndCount = jest
  .fn()
  .mockImplementation(async () => [])

export class ProductRepository extends CustomRepository {}
export class ProductTagRepository extends CustomRepository {}
export class ProductCollectionRepository extends CustomRepository {}
export class ProductVariantRepository extends CustomRepository {}
export class ProductCategoryRepository extends CustomRepository {}
