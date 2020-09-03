export const mockCreateOrder = jest
  .fn()
  .mockReturnValue(Promise.resolve("1234"))

const mock = jest.fn().mockImplementation(() => {
  return {
    warehouses: {
      createReservation: jest.fn().mockReturnValue(Promise.resolve()),
    },
    payments: {
      create: jest.fn().mockReturnValue(Promise.resolve()),
    },
    orders: {
      create: mockCreateOrder,
      retrieve: jest.fn().mockReturnValue(Promise.resolve()),
    },
    products: {
      retrieveBySKU: jest.fn().mockReturnValue(
        Promise.resolve({
          productId: 1234,
        })
      ),
    },
    customers: {
      retrieveByEmail: jest.fn().mockReturnValue(
        Promise.resolve([
          {
            primaryEmail: "test@example.com",
            contactId: "12345",
          },
        ])
      ),
    },
  }
})

export default mock
