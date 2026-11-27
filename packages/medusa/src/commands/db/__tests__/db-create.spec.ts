import { dbCreate } from "../create"

const mockEnv: Record<string, string | undefined> = {}
const mockDbExists = jest.fn()

jest.mock("../../../loaders", () => ({
  initializeContainer: jest.fn(),
}))

jest.mock("@medusajs/framework/utils", () => {
  const actual = jest.requireActual("@medusajs/framework/utils")
  return {
    ...actual,
    EnvEditor: jest.fn().mockImplementation(() => ({
      load: jest.fn(),
      save: jest.fn(),
      get: (key: string) => mockEnv[key],
      set: jest.fn(),
    })),
    createClient: jest.fn(() => ({
      connect: jest.fn().mockResolvedValue(undefined),
      end: jest.fn().mockResolvedValue(undefined),
    })),
    dbExists: (...args: unknown[]) => mockDbExists(...args),
    createDb: jest.fn(),
  }
})

const logger = { info: jest.fn(), error: jest.fn() } as any

describe("dbCreate default database name", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockDbExists.mockResolvedValue(true)
    for (const key of Object.keys(mockEnv)) {
      delete mockEnv[key]
    }
  })

  it("uses the database name from DATABASE_URL when DB_NAME isn't set", async () => {
    mockEnv.DATABASE_URL = "postgres://user:pass@localhost:5432/medusa-my-store"

    await dbCreate({
      db: undefined,
      directory: "/projects/my-store/apps/backend",
      interactive: false,
      logger,
    })

    expect(mockDbExists).toHaveBeenCalledWith(
      expect.anything(),
      "medusa-my-store"
    )
  })

  it("falls back to the directory name when DATABASE_URL has no database", async () => {
    mockEnv.DATABASE_URL = "postgres://user:pass@localhost:5432"

    await dbCreate({
      db: undefined,
      directory: "/projects/my-store/apps/backend",
      interactive: false,
      logger,
    })

    expect(mockDbExists).toHaveBeenCalledWith(
      expect.anything(),
      "medusa-backend"
    )
  })
})
