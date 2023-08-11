export const LineItemAdjustmentServiceMock = {
  withTransaction: function () {
    return this
  },
  create: jest.fn().mockImplementation((data) => {
    return Promise.resolve({ ...data })
  }),
  update: jest.fn().mockImplementation((data) => {
    return Promise.resolve({ ...data })
  }),
  validate: jest.fn().mockImplementation((data) => {
    if (data.title === "invalid lineitem") {
      throw new Error(`"content" is required`)
    }
    return data
  }),
  delete: jest.fn().mockImplementation((data) => {
    return Promise.resolve({})
  }),
  createAdjustmentForLineItem: jest
    .fn()
    .mockImplementation((cart, lineItem) => {
      return Promise.resolve({
        item_id: lineItem.id,
        amount: 1000,
        discount_id: "disc_2",
        id: "lia-1",
        description: "discount",
      })
    }),
  createAdjustments: jest.fn().mockImplementation((cart, lineItem) => {
    if (lineItem) {
      return Promise.resolve({
        item_id: lineItem.id,
        amount: 1000,
        discount_id: "disc_2",
        id: "lia-1",
        description: "discount",
      })
    }

    return Promise.resolve([
      {
        item_id: "li-1",
        amount: 200,
        discount_id: "disc_2",
        id: "lia-1",
        description: "discount",
      },
      {
        item_id: "li-3",
        amount: 100,
        discount_id: "disc_3",
        id: "lia-2",
        description: "discount",
      },
    ])
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return LineItemAdjustmentServiceMock
})

export default mock
