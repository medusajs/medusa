import { SqlEntityManager } from "@mikro-orm/postgresql"

import { MikroOrmWrapper } from "../../utils"

jest.setTimeout(30000)

describe("Sales Channel Service", () => {
  let testManager: SqlEntityManager
  let repositoryManager: SqlEntityManager

  beforeEach(async () => {
    await MikroOrmWrapper.setupDatabase()
    repositoryManager = await MikroOrmWrapper.forkManager()

    testManager = await MikroOrmWrapper.forkManager()
  })

  afterEach(async () => {
    await MikroOrmWrapper.clearDatabase()
  })

  describe("list", () => {
    it("list", async () => {})
  })

  describe("retrieve", () => {
    it("should return", async () => {})
  })
})
