import { searchProviderConformanceSuite } from "@medusajs/test-utils"
import { LocalSearchService } from "../services/local-search"

searchProviderConformanceSuite({
  name: LocalSearchService.identifier,
  createProvider: () => new LocalSearchService({}),
})
