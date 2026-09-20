import { MedusaContainer, SearchTypes } from "@medusajs/types"
import checkbox from "@inquirer/checkbox"
import { migrateSearchIndexes } from "../migrate-search"

// ─── Mocks ────────────────────────────────────────────────────────────────────

jest.mock("@inquirer/checkbox", () => jest.fn())

jest.mock("../../../loaders", () => ({
  initializeContainer: jest.fn(),
}))

jest.mock("@medusajs/framework", () => ({
  MedusaAppLoader: jest.fn().mockImplementation(() => ({
    load: jest.fn().mockResolvedValue({
      onApplicationPrepareShutdown: jest.fn().mockResolvedValue(undefined),
      onApplicationShutdown: jest.fn().mockResolvedValue(undefined),
    }),
  })),
}))

jest.mock("@medusajs/framework/links", () => ({
  LinkLoader: jest.fn().mockImplementation(() => ({
    load: jest.fn().mockResolvedValue(undefined),
  })),
}))

jest.mock("@medusajs/framework/modules-sdk", () => ({
  MedusaModule: { clearInstances: jest.fn() },
}))

jest.mock("@medusajs/framework/utils", () => ({
  ContainerRegistrationKeys: {
    LOGGER: "logger",
    CONFIG_MODULE: "configModule",
  },
  getResolvedPlugins: jest.fn().mockResolvedValue([]),
  mergePluginModules: jest.fn(),
  Modules: { SEARCH: "search" },
}))

jest.mock("../../../loaders/search", () => ({
  isSearchModuleEnabled: jest.fn().mockReturnValue(true),
  loadSearchIndexes: jest.fn().mockResolvedValue(undefined),
}))

jest.mock("../../utils", () => ({
  ensureDbExists: jest.fn().mockResolvedValue(undefined),
}))

// ─── Helpers ──────────────────────────────────────────────────────────────────

const logger = { info: jest.fn(), error: jest.fn(), log: jest.fn() }

const drop = (index: string): SearchTypes.SearchIndexMigrationAction => ({
  action: "drop",
  index,
  physical_names: [`${index}_v1`],
})

const create = (index: string): SearchTypes.SearchIndexMigrationAction => ({
  action: "create",
  index,
  physical_name: `${index}_v1`,
  definition_hash: "hash",
  version: 1,
})

const noop = (index: string): SearchTypes.SearchIndexMigrationAction => ({
  action: "noop",
  index,
  physical_name: `${index}_v1`,
  definition_hash: "hash",
})

const run = async (
  plan: SearchTypes.SearchIndexMigrationAction[],
  options: { executeAll?: boolean; executeSafe?: boolean } = {}
) => {
  const searchModule = {
    createIndexMigrationPlan: jest.fn().mockResolvedValue(plan),
    executeIndexMigrationPlan: jest.fn().mockResolvedValue(undefined),
  }

  const container = {
    resolve: jest.fn((key: string) => {
      if (key === "configModule") return { modules: {}, plugins: [] }
      if (key === "search") return searchModule
      throw new Error(`[mock container] Nothing registered for key: ${key}`)
    }),
  } as unknown as MedusaContainer

  const migrated = await migrateSearchIndexes({
    directory: "/app",
    container,
    logger: logger as any,
    ...options,
  })

  return { migrated, searchModule }
}

/** What `executeIndexMigrationPlan` was handed, by action. */
const executed = (searchModule: { executeIndexMigrationPlan: jest.Mock }) =>
  (searchModule.executeIndexMigrationPlan.mock.calls[0]?.[0] ?? []).map(
    (action: SearchTypes.SearchIndexMigrationAction) =>
      `${action.action}:${action.index}`
  )

const setTty = (isTTY: boolean) => {
  Object.defineProperty(process.stdin, "isTTY", {
    value: isTTY,
    configurable: true,
  })
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("db:migrate:search – dropping undeclared indexes", () => {
  const originalTty = process.stdin.isTTY

  beforeEach(() => {
    jest.clearAllMocks()
    // Prompting is the default, so tests that are not about it opt out.
    setTty(true)
  })

  afterEach(() => {
    setTty(originalTty as boolean)
  })

  it("does not prompt when nothing is being dropped", async () => {
    const { searchModule } = await run([create("product")])

    expect(checkbox).not.toHaveBeenCalled()
    expect(executed(searchModule)).toEqual(["create:product"])
  })

  it("asks before dropping, and drops only what was selected", async () => {
    const plan = [drop("blog"), drop("article")]
    ;(checkbox as unknown as jest.Mock).mockResolvedValue([plan[0]])

    const { searchModule } = await run(plan)

    expect(checkbox).toHaveBeenCalledTimes(1)
    expect(executed(searchModule)).toEqual(["drop:blog"])
  })

  it("drops everything without asking when --execute-all-search is passed", async () => {
    const { searchModule } = await run([drop("blog"), drop("article")], {
      executeAll: true,
    })

    expect(checkbox).not.toHaveBeenCalled()
    expect(executed(searchModule)).toEqual(["drop:blog", "drop:article"])
  })

  it("leaves drops alone when --execute-safe-search is passed", async () => {
    const { searchModule } = await run([create("product"), drop("blog")], {
      executeSafe: true,
    })

    expect(checkbox).not.toHaveBeenCalled()
    expect(executed(searchModule)).toEqual(["create:product"])
  })

  it("leaves drops alone when there is no terminal to prompt on", async () => {
    setTty(false)

    const { searchModule } = await run([create("product"), drop("blog")])

    // A CI run would otherwise hang on a prompt nobody can see, or delete
    // documents nobody confirmed.
    expect(checkbox).not.toHaveBeenCalled()
    expect(executed(searchModule)).toEqual(["create:product"])
    expect(logger.info).toHaveBeenCalledWith(
      expect.stringContaining("--execute-all-search")
    )
  })

  it("executes nothing when the only action was a drop that was skipped", async () => {
    const { migrated, searchModule } = await run([drop("blog")], {
      executeSafe: true,
    })

    expect(migrated).toBe(true)
    expect(searchModule.executeIndexMigrationPlan).not.toHaveBeenCalled()
    expect(logger.info).toHaveBeenCalledWith(
      "Search indexes already up-to-date"
    )
  })

  it("hands the noop actions along, so stale versions are still cleaned up", async () => {
    const { searchModule } = await run([noop("product"), drop("blog")], {
      executeAll: true,
    })

    expect(executed(searchModule)).toEqual(["noop:product", "drop:blog"])
  })

  it("still executes an all-noop plan, so a version an earlier swap left behind is cleaned up", async () => {
    const { migrated, searchModule } = await run([noop("product")])

    expect(migrated).toBe(true)
    expect(executed(searchModule)).toEqual(["noop:product"])
    expect(logger.info).toHaveBeenCalledWith(
      "Search indexes already up-to-date"
    )
  })
})
