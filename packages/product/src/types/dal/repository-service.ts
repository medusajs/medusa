import { FindOptions } from "./helpers"

export { FindOptions, OptionsQuery, FilterQuery } from "./helpers"

/**
 * Data access layer (DAL) interface to implements for any repository service.
 * This layer helps to separate the business logic (service layer) from accessing the
 * ORM directly and allows to switch to another ORM without changing the business logic.
 */
export interface RepositoryService<S = any> {
  find<T = S>(options?: FindOptions<T>): Promise<T[]>
  findAndCount<T = S>(options?: FindOptions<T>): Promise<[T[], number]>
}
