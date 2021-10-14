export const ShippingProfileServiceMock = {
  retrieveGiftCardDefault: jest.fn().mockImplementation((_data) => {
    return Promise.resolve({ id: "gift_card_profile" })
  }),
  retrieveDefault: jest.fn().mockImplementation((_data) => {
    return Promise.resolve({ id: "default_shipping_profile" })
  }),
}
