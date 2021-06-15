export const MockEntry = {
  update: jest.fn(() => Promise.resolve(MockEntry)),
  publish: jest.fn(() => Promise.resolve({ sys: { id: "test" } })),
}

export const MockAsset = {
  processForAllLocales: jest.fn(() => Promise.resolve(MockAsset)),
  publish: jest.fn(() => Promise.resolve({ sys: { id: "test" } })),
}

export const MockEnvironment = {
  createAsset: jest.fn((d) => Promise.resolve(MockAsset)),
  createEntryWithId: jest.fn(() => Promise.resolve(MockEntry)),
  getEntry: jest.fn(() => Promise.resolve(MockEntry)),
  getContentType: jest.fn(() => Promise.resolve({})),
}

export const MockSpace = {
  getEnvironment: jest.fn(() => Promise.resolve(MockEnvironment)),
}

export const MockClient = {
  getSpace: jest.fn(() => Promise.resolve(MockSpace)),
}

export const createClient = jest.fn(() => MockClient)
