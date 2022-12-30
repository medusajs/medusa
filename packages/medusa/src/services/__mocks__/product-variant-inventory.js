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
      if (quantity < 10) {
        return true
      } else {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          `Variant with id: ${variantId} does not have the required inventory`
        )
      }
    }),
  releaseReservationsByLineItem: jest.fn().mockImplementation((lineItem) => {}),
  reserveQuantity: jest
    .fn()
    .mockImplementation((variantId, quantity, options) => {}),
}
