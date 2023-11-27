import { CurrencyService } from "@services"
import { asClass, asValue, createContainer } from "awilix"

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
