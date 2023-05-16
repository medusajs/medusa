import { FindOptions, RepositoryService } from "../../src"

export class CustomRepository implements RepositoryService<any> {
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
