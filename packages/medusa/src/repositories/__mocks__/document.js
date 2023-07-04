import { IdMap } from "medusa-test-utils"

export const documents = [
  {
    _id: IdMap.getId("doc"),
    name: "test doc",
    base_64: "verylongstring",
  },
]

export const DocumentModelMock = {
  findOne: jest.fn().mockImplementation(query => {
    return Promise.resolve(documents[0])
  }),
}
