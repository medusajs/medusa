export const ProductCollectionServiceMock = {
  withTransaction: function () {
    return this
  },
  create: jest.fn().mockImplementation((data) => {
    return Promise.resolve({
      id: `col_${data.metadata.sh_id}`,
      ...data,
    })
  }),
  retrieveByHandle: jest.fn().mockImplementation((handle) => {
    return Promise.resolve(undefined)
  }),
}
