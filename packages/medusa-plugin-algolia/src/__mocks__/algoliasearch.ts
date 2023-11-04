export const AlgoliaMock = {
  initIndex: jest.fn().mockImplementation(() => ({
    search: jest.fn().mockImplementation(() => ({
      hits: [],
    })),
    setSettings: jest.fn(),
    deleteObject: jest.fn(),
    delete: jest.fn(),
    saveObjects: jest.fn(),
  })),
}

const algolia = jest.fn(() => AlgoliaMock)

export default algolia
