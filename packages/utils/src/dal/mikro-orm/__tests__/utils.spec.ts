import { mikroOrmUpdateDeletedAtRecursively } from "../utils"
import {
  Collection,
  Entity,
  ManyToOne,
  MikroORM,
  OneToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import { SqlEntityManager } from "@mikro-orm/postgresql"

jest.mock("@mikro-orm/core", () => ({
  ...jest.requireActual("@mikro-orm/core"),
  wrap: jest.fn().mockImplementation((entity) => ({
    ...entity,
    init: jest.fn().mockResolvedValue(entity),
    __helper: {
      isInitialized: jest.fn().mockReturnValue(true),
    },
  })),
}))

@Entity()
class RecursiveEntity1 {
  constructor(props: { id: string; deleted_at: Date | null }) {
    this.id = props.id
    this.deleted_at = props.deleted_at
  }

  @PrimaryKey()
  id: string

  @Property()
  deleted_at: Date | null

  @OneToMany(() => RecursiveEntity2, (entity2) => entity2.entity1, {
    cascade: ["soft-remove"] as any,
  })
  entity2 = new Collection<RecursiveEntity2>(this)
}

@Entity()
class RecursiveEntity2 {
  constructor(props: {
    id: string
    deleted_at: Date | null
    entity1: RecursiveEntity1
  }) {
    this.id = props.id
    this.deleted_at = props.deleted_at
    this.entity1 = props.entity1
  }

  @PrimaryKey()
  id: string

  @Property()
  deleted_at: Date | null

  @ManyToOne(() => RecursiveEntity1, {
    cascade: ["soft-remove"] as any,
  })
  entity1: RecursiveEntity1
}

@Entity()
class Entity1 {
  constructor(props: { id: string; deleted_at: Date | null }) {
    this.id = props.id
    this.deleted_at = props.deleted_at
  }

  @PrimaryKey()
  id: string

  @Property()
  deleted_at: Date | null

  @OneToMany(() => Entity2, (entity2) => entity2.entity1, {
    cascade: ["soft-remove"] as any,
  })
  entity2 = new Collection<Entity2>(this)
}

@Entity()
class Entity2 {
  constructor(props: {
    id: string
    deleted_at: Date | null
    entity1: RecursiveEntity1
  }) {
    this.id = props.id
    this.deleted_at = props.deleted_at
    this.entity1 = props.entity1
  }

  @PrimaryKey()
  id: string

  @Property()
  deleted_at: Date | null

  @ManyToOne(() => Entity1, {})
  entity1: Entity1
}

describe("mikroOrmUpdateDeletedAtRecursively", () => {
  describe("using circular cascading", () => {
    let orm!: MikroORM

    beforeEach(async () => {
      orm = await MikroORM.init({
        entities: [Entity1, Entity2, RecursiveEntity1, RecursiveEntity2],
        dbName: "test",
        type: "postgresql",
      })
    })

    afterEach(async () => {
      await orm.close()
    })

    it("should successfully mark the entities deleted_at recursively", async () => {
      const manager = orm.em.fork() as SqlEntityManager
      const entity1 = new Entity1({ id: "1", deleted_at: null })
      const entity2 = new Entity2({
        id: "2",
        deleted_at: null,
        entity1: entity1,
      })
      entity1.entity2.add(entity2)

      const deletedAt = new Date()
      await mikroOrmUpdateDeletedAtRecursively(manager, [entity1], deletedAt)

      expect(entity1.deleted_at).toEqual(deletedAt)
      expect(entity2.deleted_at).toEqual(deletedAt)
    })

    it("should throw an error when a circular dependency is detected", async () => {
      const manager = orm.em.fork() as SqlEntityManager
      const entity1 = new RecursiveEntity1({ id: "1", deleted_at: null })
      const entity2 = new RecursiveEntity2({
        id: "2",
        deleted_at: null,
        entity1: entity1,
      })

      await expect(
        mikroOrmUpdateDeletedAtRecursively(manager, [entity2], new Date())
      ).rejects.toThrow(
        "Unable to soft delete the entity1. Circular dependency detected: RecursiveEntity2 -> entity1 -> RecursiveEntity1 -> entity2 -> RecursiveEntity2"
      )
    })
  })
})
