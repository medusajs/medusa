import { MikroORM } from "@mikro-orm/core"
import { Entity1, Entity2 } from "../__fixtures__/utils"
import { mikroOrmSerializer } from "../mikro-orm-serializer"

describe("mikroOrmSerializer", () => {
  beforeEach(async () => {
    await MikroORM.init({
      entities: [Entity1, Entity2],
      dbName: "test",
      type: "postgresql",
    })
  })

  it("should serialize an entity", async () => {
    const entity1 = new Entity1({ id: "1", deleted_at: null })
    const entity2 = new Entity2({
      id: "2",
      deleted_at: null,
      entity1: entity1,
    })
    entity1.entity2.add(entity2)

    const serialized = await mikroOrmSerializer(entity1, {
      preventCircularRef: false,
    })

    expect(serialized).toEqual({
      id: "1",
      deleted_at: null,
      entity2: [
        {
          id: "2",
          deleted_at: null,
          entity1: {
            id: "1",
            deleted_at: null,
          },
        },
      ],
    })
  })

  it("should serialize an array of entities", async () => {
    const entity1 = new Entity1({ id: "1", deleted_at: null })
    const entity2 = new Entity2({
      id: "2",
      deleted_at: null,
      entity1: entity1,
    })
    entity1.entity2.add(entity2)

    const serialized = await mikroOrmSerializer([entity1, entity1], {
      preventCircularRef: false,
    })

    const expectation = {
      id: "1",
      deleted_at: null,
      entity2: [
        {
          id: "2",
          deleted_at: null,
          entity1: {
            id: "1",
            deleted_at: null,
          },
        },
      ],
    }

    expect(serialized).toEqual([expectation, expectation])
  })

  it("should serialize an entity preventing circular relation reference", async () => {
    const entity1 = new Entity1({ id: "1", deleted_at: null })
    const entity2 = new Entity2({
      id: "2",
      deleted_at: null,
      entity1: entity1,
    })
    entity1.entity2.add(entity2)

    const serialized = await mikroOrmSerializer(entity1, {
      preventCircularRef: false,
    })

    expect(serialized).toEqual({
      id: "1",
      deleted_at: null,
      entity2: [
        {
          id: "2",
          deleted_at: null,
          entity1: {
            id: "1",
            deleted_at: null,
          },
        },
      ],
    })
  })
})
