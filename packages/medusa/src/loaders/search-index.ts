import { AbstractSearchService } from "@medusajs/utils"
import { EventBusService } from "../services"
import { Logger, MedusaContainer } from "../types/global"

export const SEARCH_INDEX_EVENT = "SEARCH_INDEX_EVENT"

async function loadProductsIntoSearchEngine(
  container: MedusaContainer
): Promise<void> {
  const logger: Logger = container.resolve<Logger>("logger")
  const eventBusService: EventBusService = container.resolve("eventBusService")
  void eventBusService.emit(SEARCH_INDEX_EVENT, {}).catch((err) => {
    logger.error(err)
    logger.error(
      "Something went wrong while emitting the search indexing event."
    )
  })
}

export default async ({
  container,
}: {
  container: MedusaContainer
}): Promise<void> => {
  const searchService =
    container.resolve<AbstractSearchService>("searchService")
  const logger = container.resolve<Logger>("logger")
  if (searchService.isDefault) {
    logger.warn(
      "No search engine provider was found: make sure to include a search plugin to enable searching"
    )
    return
  }

  await loadProductsIntoSearchEngine(container)
}
