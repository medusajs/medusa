import IdMap from "../../helpers/id-map"

export const ProductServiceMock = {
  createDraft: jest.fn().mockImplementation(data => {
    return Promise.resolve(data)
  }),
  list: jest.fn().mockImplementation(data => {
    if (data.variants === IdMap.getId("testVariant")) {
      return Promise.resolve([
        {
          _id: "1234",
          title: "test",
          options: [
            {
              _id: IdMap.getId("testOptionId"),
              title: "testOption",
            },
          ],
        },
      ])
    }
    return Promise.resolve([])
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return ProductServiceMock
})

export default mock
