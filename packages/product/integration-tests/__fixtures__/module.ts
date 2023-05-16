import { FindOptions, RepositoryService } from "../../src"

class CustomRepository implements RepositoryService<any> {
  constructor() {}

  find(options?: FindOptions<any>): Promise<any[]> {
    throw new Error("Method not implemented.")
  }

  findAndCount(options?: FindOptions<any>): Promise<[any[], number]> {
    throw new Error("Method not implemented.")
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
