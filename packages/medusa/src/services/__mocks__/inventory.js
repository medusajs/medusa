export const InventoryServiceMock = {
  withTransaction: function () {
    return this
  },

  listInventoryItems: jest.fn().mockImplementation((id, config) => {
    return Promise.resolve()
  }),

  listReservationItems: jest.fn().mockImplementation((id, config) => {
    return Promise.resolve()
  }),

  listInventoryLevels: jest.fn().mockImplementation((id, config) => {
    return Promise.resolve()
  }),

  retrieveInventoryItem: jest.fn().mockImplementation((id, config) => {
    return Promise.resolve()
  }),

  retrieveInventoryLevel: jest.fn().mockImplementation((id, config) => {
    return Promise.resolve()
  }),

  createReservationItem: jest.fn().mockImplementation((id, config) => {
    return Promise.resolve()
  }),

  createInventoryItem: jest.fn().mockImplementation((id, config) => {
    return Promise.resolve()
  }),

  createInventoryLevel: jest.fn().mockImplementation((id, config) => {
    return Promise.resolve()
  }),

  updateInventoryLevel: jest.fn().mockImplementation((id, config) => {
    return Promise.resolve()
  }),

  updateInventoryItem: jest.fn().mockImplementation((id, config) => {
    return Promise.resolve()
  }),

  updateReservationItem: jest.fn().mockImplementation((id, config) => {
    return Promise.resolve()
  }),

  deleteReservationItemsByLineItem: jest
    .fn()
    .mockImplementation((id, config) => {
      return Promise.resolve()
    }),

  deleteReservationItem: jest.fn().mockImplementation((id, config) => {
    return Promise.resolve()
  }),

  deleteInventoryItem: jest.fn().mockImplementation((id, config) => {
    return Promise.resolve()
  }),

  deleteInventoryLevel: jest.fn().mockImplementation((id, config) => {
    return Promise.resolve()
  }),

  adjustInventory: jest.fn().mockImplementation((id, config) => {
    return Promise.resolve()
  }),

  confirmInventory: jest.fn().mockImplementation((id, config) => {
    return Promise.resolve()
  }),

  retrieveAvailableQuantity: jest.fn().mockImplementation((id, config) => {
    return Promise.resolve(10)
  }),

  retrieveStockedQuantity: jest.fn().mockImplementation((id, config) => {
    return Promise.resolve(9)
  }),

  retrieveReservedQuantity: jest.fn().mockImplementation((id, config) => {
    return Promise.resolve(1)
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return InventoryServiceMock
})

export default mock
