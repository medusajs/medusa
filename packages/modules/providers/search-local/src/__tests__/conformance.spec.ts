import { searchProviderConformanceSuite } from "@medusajs/test-utils"
import { LocalSearchService } from "../services/local-search"

// The provider's contract is the conformance suite: every optional capability
// either answers exactly or throws. This is also the suite's own regression
// test, since provider implementers run it against theirs.
searchProviderConformanceSuite({
  createProvider: () => new LocalSearchService(),
})
