import { Context } from "@medusajs/types"
import { DALUtils } from "@medusajs/utils"

class CustomRepository extends DALUtils.MikroOrmBaseRepository {
  constructor({ manager }) {
    // @ts-ignore
    super(...arguments)
  }

  find = jest.fn().mockImplementation(async () => [])
  findAndCount = jest.fn().mockImplementation(async () => [])
  create = jest.fn()
  update = jest.fn()
  delete = jest.fn()
  softDelete = jest.fn()
  restore = jest.fn()

  async transaction<TManager = unknown>(
    task: (transactionManager: TManager) => Promise<any>,
    options: {
      isolationLevel?: string
      enableNestedTransactions?: boolean
      transaction?: TManager
    } = {}
  ): Promise<any> {
    return super.transaction(task, options)
  }

  getActiveManager<TManager = unknown>({
    transactionManager,
    manager,
  }: Context = {}): TManager {
    return super.getActiveManager({ transactionManager, manager })
  }

  getFreshManager<TManager = unknown>(): TManager {
    return super.getFreshManager()
  }

  async serialize<TOutput extends object | object[]>(
    data: any,
    options?: any
  ): Promise<TOutput> {
    return super.serialize(data, options)
  }
}

export class ProductRepository extends CustomRepository {}
export class ProductTagRepository extends CustomRepository {}
export class ProductCollectionRepository extends CustomRepository {}
export class ProductVariantRepository extends CustomRepository {}
export class ProductCategoryRepository extends CustomRepository {}
