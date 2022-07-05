import { IdMap } from "medusa-test-utils"

export const salesChannel1 = {
  id: IdMap.getId("sales_channel_1"),
  name: "sales channel 1 name",
  description: "sales channel 1 description",
  is_disabled: false,
}


export const SalesChannelServiceMock = {
  retrieve: jest.fn().mockImplementation((id, config) => {
    if (id === IdMap.getId("sales_channel_1")) {
      return salesChannel1
    }
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return SalesChannelServiceMock
})

export default mock
