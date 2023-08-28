import { Constructor, DAL } from "@medusajs/types"
import { asClass } from "awilix"
import { lowerCaseFirst } from "../../common"

/**
 * Load the repositories from the custom repositories object. If a repository is not
 * present in the custom repositories object, the default repository will be used.
 *
 * @param customRepositories
 * @param container
 */
export function loadCustomRepositories({
  defaultRepositories,
  customRepositories,
  container,
}) {
  const customRepositoriesMap = new Map(Object.entries(customRepositories))

  Object.entries(defaultRepositories).forEach(([key, defaultRepository]) => {
    let finalRepository = customRepositoriesMap.get(key)

    if (
      !finalRepository ||
      !(finalRepository as Constructor<DAL.RepositoryService>).prototype.find
    ) {
      finalRepository = defaultRepository
    }

    container.register({
      [lowerCaseFirst(key)]: asClass(
        finalRepository as Constructor<DAL.RepositoryService>
      ).singleton(),
    })
  })
}
