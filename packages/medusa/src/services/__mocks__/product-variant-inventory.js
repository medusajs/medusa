import { MedusaError } from "medusa-core-utils"

export const ProductVariantInventoryServiceMock = {
  withTransaction: function () {
    return this
  },
  adjustInventory: jest.fn().mockReturnValue((_variantId, _quantity) => {
    return Promise.resolve({})
  }),
  confirmInventory: jest
    .fn()
    .mockImplementation((variantId, quantity, options) => {
      return quantity < 10
    }),
  adjustReservationsQuantityByLineItem: jest
    .fn()
    .mockImplementation((lineItem) => {}),
  releaseReservationsByLineItem: jest.fn().mockImplementation((lineItem) => {}),
  reserveQuantity: jest
    .fn()
    .mockImplementation((variantId, quantity, options) => {}),
}
