import { asClass, asValue, createContainer } from "awilix"
import { ProductService } from "@services"

export const nonExistingProductId = "non-existing-id"

export const mockContainer = createContainer()
mockContainer.register({
  transaction: asValue(async (task) => await task()),
  productRepository: asValue({
    find: jest.fn().mockImplementation(async ({ where: { id } }) => {
      if (id === nonExistingProductId) {
        return []
      }

      return [{}]
    }),
    findAndCount: jest.fn().mockResolvedValue([[], 0]),
    getFreshManager: jest.fn().mockResolvedValue({}),
  }),
  productService: asClass(ProductService),
})
