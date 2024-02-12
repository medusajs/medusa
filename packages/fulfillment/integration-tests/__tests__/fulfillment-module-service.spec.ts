import { Modules } from "@medusajs/modules-sdk"
import { initModules } from "medusa-test-utils/dist"
import {
  CreateFulfillmentSetDTO,
  IFulfillmentModuleService,
} from "@medusajs/types"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { getInitModuleConfig, MikroOrmWrapper } from "../utils"

describe("fulfillment module service", function () {
  let service: IFulfillmentModuleService
  let testManager: SqlEntityManager
  let shutdownFunc: () => Promise<void>

  beforeAll(async () => {
    const initModulesConfig = getInitModuleConfig()

    const { medusaApp, shutdown } = await initModules(initModulesConfig)

    service = medusaApp.modules[Modules.FULFILLMENT]

    shutdownFunc = shutdown
  })

  beforeEach(async () => {
    await MikroOrmWrapper.setupDatabase()
    testManager = MikroOrmWrapper.forkManager()
  })

  afterEach(async () => {
    await MikroOrmWrapper.clearDatabase()
  })

  afterAll(async () => {
    await shutdownFunc()
  })

  it("should create a new fulfillment set", async function () {
    const data: CreateFulfillmentSetDTO = {
      name: "test",
      type: "test-type",
    }

    const fulfillmentSets = await service.create(data)

    expect(fulfillmentSets).toHaveLength(1)
    expect(fulfillmentSets[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: data.name,
        type: data.type,
      })
    )
  })

  it("should create a collection of fulfillment sets", async function () {
    const data = [
      {
        name: "test",
        type: "test-type",
      },
      {
        name: "test2",
        type: "test-type2",
      },
    ]

    const fulfillmentSets = await service.create(data)

    expect(fulfillmentSets).toHaveLength(2)

    let i = 0
    for (const data_ of data) {
      expect(fulfillmentSets[i]).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: data_.name,
          type: data_.type,
        })
      )
      ++i
    }
  })

  it("should create a new fulfillment set with new service zones", async function () {
    const data = {
      name: "test",
      type: "test-type",
      service_zones: [
        {
          name: "test",
        },
      ],
    }

    const fulfillmentSets = await service.create(data)

    expect(fulfillmentSets).toHaveLength(1)
    expect(fulfillmentSets[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: data.name,
        type: data.type,
        service_zones: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            name: data.service_zones[0].name,
          }),
        ]),
      })
    )
  })

  it("should create a collection of fulfillment sets with new service zones", async function () {
    const data = [
      {
        name: "test",
        type: "test-type",
        service_zones: [
          {
            name: "test",
          },
        ],
      },
      {
        name: "test2",
        type: "test-type2",
        service_zones: [
          {
            name: "test",
          },
        ],
      },
      {
        name: "test3",
        type: "test-type3",
        service_zones: [
          {
            name: "test2",
          },
        ],
      },
    ]

    const fulfillmentSets = await service.create(data)

    expect(fulfillmentSets).toHaveLength(3)

    let i = 0
    for (const data_ of data) {
      expect(fulfillmentSets[i]).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: data_.name,
          type: data_.type,
          service_zones: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              name: data_.service_zones[0].name,
            }),
          ]),
        })
      )
      ++i
    }

    // The two first fulfillment sets share the same service zone
    expect(fulfillmentSets[0].service_zones[0].id).toEqual(
      fulfillmentSets[1].service_zones[0].id
    )
  })

  it("should create a collection of fulfillment sets with new service zones and existing service zones", async function () {
    // TODO
  })
})
