import { MikroORM } from "@mikro-orm/core"
import {
  Entity1WithUnDecoratedProp,
  Entity2WithUnDecoratedProp,
} from "../__fixtures__/utils"
import { mikroOrmSerializer } from "../mikro-orm-serializer"

describe("mikroOrmSerializer", () => {
  beforeEach(async () => {
    await MikroORM.init({
      entities: [Entity1WithUnDecoratedProp, Entity2WithUnDecoratedProp],
      dbName: "test",
      type: "postgresql",
    })
  })

  it("should serialize an entity", async () => {
    const entity1 = new Entity1WithUnDecoratedProp({
      id: "1",
      deleted_at: null,
    })
    entity1.unknownProp = "calculated"

    const entity2 = new Entity2WithUnDecoratedProp({
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
      unknownProp: "calculated",
      entity2: [
        {
          id: "2",
          deleted_at: null,
          entity1: {
            id: "1",
            deleted_at: null,
            unknownProp: "calculated",
          },
          entity1_id: "1",
        },
      ],
    })
  })

  it("should serialize an array of entities", async () => {
    const entity1 = new Entity1WithUnDecoratedProp({
      id: "1",
      deleted_at: null,
    })
    entity1.unknownProp = "calculated"

    const entity2 = new Entity2WithUnDecoratedProp({
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
      unknownProp: "calculated",
      entity2: [
        {
          id: "2",
          deleted_at: null,
          entity1: {
            id: "1",
            deleted_at: null,
            unknownProp: "calculated",
          },
          entity1_id: "1",
        },
      ],
    }

    expect(serialized).toEqual([expectation, expectation])
  })

  it("should serialize an entity preventing circular relation reference", async () => {
    const entity1 = new Entity1WithUnDecoratedProp({
      id: "1",
      deleted_at: null,
    })
    entity1.unknownProp = "calculated"

    const entity2 = new Entity2WithUnDecoratedProp({
      id: "2",
      deleted_at: null,
      entity1: entity1,
    })
    entity1.entity2.add(entity2)

    const serialized = await mikroOrmSerializer(entity1)

    expect(serialized).toEqual({
      id: "1",
      deleted_at: null,
      unknownProp: "calculated",
      entity2: [
        {
          id: "2",
          deleted_at: null,
          entity1_id: "1",
        },
      ],
    })
  })
})
