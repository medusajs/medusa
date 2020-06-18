const EntryMock = {
  update: jest.fn().mockReturnValue(Promise.resolve()),
  publish: jest.fn().mockReturnValue(Promise.resolve()),
}

const EnvironmentMock = {
  getEntry: jest.fn().mockImplementation(() => Promise.resolve(EntryMock)),
  createEntryWithId: jest.fn().mockImplementation(() => {}),
}

const SpaceMock = {
  getEnvironment: jest.fn().mockReturnValue(Promise.resolve(EnvironmentMock)),
}

export const ContentfulMock = {
  getSpace: jest.fn().mockReturnValue(Promise.resolve(SpaceMock)),
  getContentful: jest.fn().mockReturnValue(Promise.resolve()),
}

const contentful = jest.fn(() => ContentfulMock)

export default contentful
