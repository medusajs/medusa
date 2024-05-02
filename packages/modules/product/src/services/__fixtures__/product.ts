import { asValue } from "awilix"

export const nonExistingProductId = "non-existing-id"

export const productRepositoryMock = {
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
}
