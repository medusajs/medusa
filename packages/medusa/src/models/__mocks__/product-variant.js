import { IdMap } from "medusa-test-utils"

export const ProductVariantModelMock = {
  create: jest.fn().mockReturnValue(Promise.resolve()),
  updateOne: jest.fn().mockImplementation((query, update) => {
    return Promise.resolve()
  }),
  deleteOne: jest.fn().mockReturnValue(Promise.resolve()),
  findOne: jest.fn().mockImplementation(query => {
    if (query._id === IdMap.getId("validId")) {
      return Promise.resolve({
        _id: IdMap.getId("validId"),
        title: "test",
      })
    }
    if (query._id === IdMap.getId("testVariant")) {
      return Promise.resolve({
        _id: IdMap.getId("testVariant"),
        title: "test",
      })
    }
    if (query._id === IdMap.getId("deleteId")) {
      return Promise.resolve({
        _id: IdMap.getId("deleteId"),
        title: "test",
      })
    }
    if (query._id === IdMap.getId("failId")) {
      return Promise.reject(new Error("test error"))
    }
    return Promise.resolve(undefined)
  }),
}
