import { asValue } from "awilix"

export const salesChannelRepositoryMock = {
  salesChannelRepository: asValue({
    find: jest.fn().mockImplementation(async ({ where: { code } }) => {
      return [{}]
    }),
    findAndCount: jest.fn().mockResolvedValue([[], 0]),
    getFreshManager: jest.fn().mockResolvedValue({}),
  }),
}
