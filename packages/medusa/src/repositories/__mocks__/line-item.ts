import { MockRepository } from "medusa-test-utils"
import { LineItem } from "../../models"
import { LineItemRepository } from "../line-item"

export const lineItemRepositoryMock = MockRepository({
  create: jest.fn().mockImplementation((data) => {
    return Object.assign(new LineItem(), data)
  })
}) as LineItemRepository