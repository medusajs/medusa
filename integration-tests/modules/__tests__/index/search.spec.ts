import { medusaIntegrationTestRunner } from "medusa-test-utils"
import { IndexTypes } from "@medusajs/types"
import { Modules } from "@medusajs/utils"

jest.setTimeout(50000)

medusaIntegrationTestRunner({
  testSuite: ({ getContainer }) => {
    let indexEngine: IndexTypes.IIndexService

    beforeAll(() => {
      const appContainer = getContainer()
      indexEngine = appContainer.resolve(Modules.INDEX)
    })

    describe("TESTS", () => {})
  },
})
