import { FindOptions } from "./index"
import { RepositoryTransformOptions } from "../common"

/**
 * Data access layer (DAL) interface to implements for any repository service.
 * This layer helps to separate the business logic (service layer) from accessing the
 * ORM directly and allows to switch to another ORM without changing the business logic.
 */
export interface RepositoryService<T = any> {
  find(options?: FindOptions<T>, transformOptions?: RepositoryTransformOptions): Promise<T[]>
  findAndCount(options?: FindOptions<T>, transformOptions?: RepositoryTransformOptions): Promise<[T[], number]>
}
