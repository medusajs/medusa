import { Currency } from "@models"
import { CurrencyService } from "@services"
import { asClass, asValue, createContainer } from "awilix"

;(Currency as any).meta = {
  /**
   * Need to mock the Currency model as well to expose the primary keys when it is different than `id`
   */
  primaryKeys: ["code"],
}

export const nonExistingCurrencyCode = "non-existing-code"
export const mockContainer = createContainer()

mockContainer.register({
  transaction: asValue(async (task) => await task()),
  currencyRepository: asValue({
    find: jest.fn().mockImplementation(async ({ where: { code } }) => {
      if (code === nonExistingCurrencyCode) {
        return []
      }

      return [{}]
    }),
    findAndCount: jest.fn().mockResolvedValue([[], 0]),
    getFreshManager: jest.fn().mockResolvedValue({}),
  }),
  currencyService: asClass(CurrencyService),
})
