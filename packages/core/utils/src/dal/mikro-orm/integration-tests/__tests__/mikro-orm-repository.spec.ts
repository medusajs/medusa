import {
  BeforeCreate,
  Collection,
  Entity,
  EntityManager,
  Filter,
  ManyToMany,
  ManyToOne,
  MikroORM,
  OneToMany,
  OnInit,
  PrimaryKey,
  Property,
  Unique,
  wrap,
} from "@medusajs/deps/mikro-orm/core"
import { defineConfig } from "@medusajs/deps/mikro-orm/postgresql"
import { BigNumberRawValue } from "@medusajs/types"
import BigNumber from "bignumber.js"
import { dropDatabase } from "pg-god"
import { MikroOrmBigNumberProperty } from "../../big-number-field"
import { mikroOrmBaseRepositoryFactory } from "../../mikro-orm-repository"
import { mikroOrmSoftDeletableFilterOptions } from "../../mikro-orm-soft-deletable-filter"
import { getDatabaseURL, pgGodCredentials } from "../__fixtures__/database"

const dbName = "mikroorm-integration-1"

jest.setTimeout(300000)
@Filter(mikroOrmSoftDeletableFilterOptions)
@Entity()
class Entity1 {
  @PrimaryKey()
  id: string

  @Property()
  title: string

  @MikroOrmBigNumberProperty({ nullable: true })
  amount: BigNumber | number | null

  @Property({ columnType: "jsonb", nullable: true })
  raw_amount: BigNumberRawValue | null

  @Property({ nullable: true })
  deleted_at: Date | null

  @Property({
    columnType: "timestamptz",
    type: "date",
    nullable: false,
    defaultRaw: "now()",
    onCreate: () => new Date(),
    onUpdate: () => new Date(),
  })
  updated_at: Date

  @OneToMany(() => Entity2, (entity2) => entity2.entity1)
  entity2 = new Collection<Entity2>(this)

  @ManyToMany(() => Entity3, "entity1", {
    owner: true,
    pivotTable: "entity_1_3",
  })
  entity3 = new Collection<Entity3>(this)

  @OnInit()
  @BeforeCreate()
  onInit() {
    if (!this.id) {
      this.id = Math.random().toString(36).substring(7)
    }
  }
}

@Entity()
class Entity2 {
  @PrimaryKey()
  id: string

  @Property()
  title: string

  @Unique()
  @Property()
  handle: string

  @Property({ nullable: true })
  deleted_at: Date | null

  @ManyToOne(() => Entity1, {
    columnType: "text",
    nullable: true,
    mapToPk: true,
    fieldName: "entity1_id",
    deleteRule: "set null",
  })
  entity1_id: string

  @ManyToOne(() => Entity1, { persist: false, nullable: true })
  entity1: Entity1 | null

  @OnInit()
  @BeforeCreate()
  onInit() {
    if (!this.id) {
      this.id = Math.random().toString(36).substring(7)
    }

    this.entity1_id ??= this.entity1?.id!
  }
}

@Entity()
class Entity3 {
  @PrimaryKey()
  id: string

  @Unique()
  @Property()
  title: string

  @Property({ nullable: true })
  deleted_at: Date | null

  @ManyToMany(() => Entity1, (entity1) => entity1.entity3)
  entity1 = new Collection<Entity1>(this)

  @OneToMany(() => Entity4, (entity4) => entity4.entity3)
  entity4 = new Collection<Entity4>(this)

  @ManyToMany(() => Entity5, "entity3", {
    owner: true,
    pivotTable: "entity_3_5",
  })
  entity5 = new Collection<Entity5>(this)

  @OnInit()
  @BeforeCreate()
  onInit() {
    if (!this.id) {
      this.id = Math.random().toString(36).substring(7)
    }
  }
}

@Entity()
class Entity4 {
  @PrimaryKey()
  id: string

  @Property()
  title: string

  @Property()
  description: string

  @Property({ nullable: true })
  deleted_at: Date | null

  @ManyToOne(() => Entity3, {
    columnType: "text",
    nullable: true,
    mapToPk: true,
    fieldName: "entity3_id",
    deleteRule: "set null",
  })
  entity3_id: string

  @ManyToOne(() => Entity3, { persist: false, nullable: true })
  entity3: Entity3 | null

  @OnInit()
  @BeforeCreate()
  onInit() {
    if (!this.id) {
      this.id = Math.random().toString(36).substring(7)
    }

    this.entity3_id ??= this.entity3?.id!
  }
}

@Entity()
class Entity5 {
  @PrimaryKey()
  id: string

  @Property()
  title: string

  @Property()
  value: number

  @Property({ nullable: true })
  deleted_at: Date | null

  @ManyToMany(() => Entity3, (entity3) => entity3.entity5)
  entity3 = new Collection<Entity3>(this)

  @OneToMany(() => Entity6, (entity6) => entity6.entity5)
  entity6 = new Collection<Entity6>(this)

  @OnInit()
  @BeforeCreate()
  onInit() {
    if (!this.id) {
      this.id = Math.random().toString(36).substring(7)
    }
  }
}

@Entity()
class Entity6 {
  @PrimaryKey()
  id: string

  @Property()
  title: string

  @Property()
  metadata: string

  @Property({ nullable: true })
  deleted_at: Date | null

  @ManyToOne(() => Entity5, {
    columnType: "text",
    nullable: true,
    mapToPk: true,
    fieldName: "entity5_id",
    deleteRule: "set null",
  })
  entity5_id: string

  @ManyToOne(() => Entity5, { persist: false, nullable: true })
  entity5: Entity5 | null

  @OnInit()
  @BeforeCreate()
  onInit() {
    if (!this.id) {
      this.id = Math.random().toString(36).substring(7)
    }

    this.entity5_id ??= this.entity5?.id!
  }
}

// Entity with a non-nullable foreign key
@Entity()
class Entity7 {
  @PrimaryKey()
  id: string

  @Property()
  title: string

  @Unique()
  @Property()
  handle: string

  @Property({ nullable: true })
  deleted_at: Date | null

  @ManyToOne(() => Entity1, {
    columnType: "text",
    nullable: false,
    mapToPk: true,
    fieldName: "entity1_id",
    deleteRule: "set null",
  })
  entity1_id: string

  @ManyToOne(() => Entity1, { persist: false, nullable: false })
  entity1: Entity1 | null

  @OnInit()
  @BeforeCreate()
  onInit() {
    if (!this.id) {
      this.id = Math.random().toString(36).substring(7)
    }

    this.entity1_id ??= this.entity1?.id!
  }
}

// Entity whose primary key is a custom (non-id) column
@Entity()
class CustomPkEntity {
  @PrimaryKey({ columnType: "text" })
  code: string

  @Property()
  title: string

  @Property({ nullable: true })
  deleted_at: Date | null
}

// Entity with a composite primary key
@Entity()
class CompositePkEntity {
  @PrimaryKey({ columnType: "text" })
  foo: string

  @PrimaryKey({ columnType: "text" })
  bar: string

  @Property()
  title: string

  @Property({ nullable: true })
  deleted_at: Date | null
}

const Entity1Repository = mikroOrmBaseRepositoryFactory(Entity1)
const Entity2Repository = mikroOrmBaseRepositoryFactory(Entity2)
const Entity3Repository = mikroOrmBaseRepositoryFactory(Entity3)
const Entity4Repository = mikroOrmBaseRepositoryFactory(Entity4)
const Entity5Repository = mikroOrmBaseRepositoryFactory(Entity5)
const Entity6Repository = mikroOrmBaseRepositoryFactory(Entity6)
const Entity7Repository = mikroOrmBaseRepositoryFactory(Entity7)
const CustomPkEntityRepository = mikroOrmBaseRepositoryFactory(CustomPkEntity)
const CompositePkEntityRepository =
  mikroOrmBaseRepositoryFactory(CompositePkEntity)

describe("mikroOrmRepository", () => {
  let orm!: MikroORM
  let manager!: EntityManager
  const manager1 = () => {
    return new Entity1Repository({ manager: manager.fork() })
  }
  const manager2 = () => {
    return new Entity2Repository({ manager: manager.fork() })
  }
  const manager3 = () => {
    return new Entity3Repository({ manager: manager.fork() })
  }
  // @ts-expect-error
  const manager4 = () => {
    return new Entity4Repository({ manager: manager.fork() })
  }
  const manager5 = () => {
    return new Entity5Repository({ manager: manager.fork() })
  }
  const manager7 = () => {
    return new Entity7Repository({ manager: manager.fork() })
  }
  // @ts-expect-error
  const manager6 = () => {
    return new Entity6Repository({ manager: manager.fork() })
  }
  const customPkManager = () => {
    return new CustomPkEntityRepository({ manager: manager.fork() })
  }
  const compositePkManager = () => {
    return new CompositePkEntityRepository({ manager: manager.fork() })
  }

  beforeEach(async () => {
    await dropDatabase(
      { databaseName: dbName, errorIfNonExist: false },
      pgGodCredentials
    )

    orm = await MikroORM.init(
      defineConfig({
        entities: [
          Entity1,
          Entity2,
          Entity3,
          Entity4,
          Entity5,
          Entity6,
          Entity7,
          CustomPkEntity,
          CompositePkEntity,
        ],
        clientUrl: getDatabaseURL(dbName),
        // Match Medusa's production config: soft-delete filters are not
        // auto-joined onto referenced entities unless they are populated.
        autoJoinRefsForFilters: false,
      })
    )

    const generator = orm.getSchemaGenerator()
    await generator.ensureDatabase()
    await generator.createSchema()

    manager = orm.em.fork()
  })

  afterEach(async () => {
    if (orm) {
      const generator = orm.getSchemaGenerator()
      await generator.dropSchema()
      await orm.close(true)
    }

    await dropDatabase(
      { databaseName: dbName, errorIfNonExist: false },
      pgGodCredentials
    )
  })

  it("should successfully update a many to many collection providing an empty array", async () => {
    const entity1 = {
      id: "1",
      title: "en1",
      entity3: [{ title: "en3-1" }, { title: "en3-2" }],
    }

    let manager = orm.em.fork()
    await manager1().create([entity1], { transactionManager: manager })
    await manager.flush()

    const [createdEntity1] = await manager1().find({
      where: { id: "1" },
      options: { populate: ["entity3"] },
    })

    expect(createdEntity1.entity3.getItems()).toHaveLength(2)

    manager = orm.em.fork()
    await manager1().update(
      [{ entity: createdEntity1, update: { entity3: [] } }],
      {
        transactionManager: manager,
      }
    )
    await manager.flush()

    const updatedEntity1 = await manager1().find({
      where: { id: "1" },
      options: { populate: ["entity3"] },
    })

    expect(updatedEntity1).toHaveLength(1)
    expect(updatedEntity1[0].entity3.getItems()).toHaveLength(0)
  })

  it("should return rows even when a populated relation is soft-deleted", async () => {
    await manager1().upsertWithReplace([{ id: "1", title: "en1" }])
    await manager7().upsertWithReplace([
      { id: "2", title: "en2", handle: "handle-2", entity1: { id: "1" } },
      { id: "3", title: "en3", handle: "handle-3", entity1: { id: "1" } },
    ])

    const softDeleteManager = orm.em.fork()
    await new Entity1Repository({ manager: softDeleteManager }).softDelete(
      ["1"],
      { transactionManager: softDeleteManager }
    )
    await softDeleteManager.flush()

    const afterSoftDelete = await manager7().find({
      where: {},
      options: {
        fields: ["entity1.id"],
      },
    })
    expect(afterSoftDelete).toHaveLength(2)
    expect(afterSoftDelete[0].id).toBe("2")
    expect(afterSoftDelete[0].entity1).toBeNull()
    expect(afterSoftDelete[1].id).toBe("3")
    expect(afterSoftDelete[1].entity1).toBeNull()
  })

  describe("upsert with replace", () => {
    it("should successfully create a flat entity", async () => {
      const entity1 = { id: "1", title: "en1", amount: 100 }

      const { performedActions } = await manager1().upsertWithReplace([entity1])

      expect(performedActions).toEqual({
        created: {
          [Entity1.name]: [expect.objectContaining({ id: entity1.id })],
        },
        updated: {},
        deleted: {},
      })

      const listedEntities = await manager1().find()

      expect(listedEntities).toHaveLength(1)
      expect(wrap(listedEntities[0]).toPOJO()).toEqual(
        expect.objectContaining({
          id: "1",
          title: "en1",
          amount: 100,
          raw_amount: { value: "100", precision: 20 },
        })
      )
    })

    it("batch updates should retain order of entities", async () => {
      const entity1 = { id: "1", title: "en1" }
      const entity2 = { id: "2", title: "en2" }
      const entity3 = { id: "3", title: "en3" }

      const { performedActions: performedActions1 } =
        await manager1().upsertWithReplace([entity1, entity2, entity3])

      expect(performedActions1).toEqual({
        created: {
          [Entity1.name]: [
            expect.objectContaining({ id: entity1.id }),
            expect.objectContaining({ id: entity2.id }),
            expect.objectContaining({ id: entity3.id }),
          ],
        },
        updated: {},
        deleted: {},
      })

      // Doing this to shuffle the physical order of rows in the DB
      entity1.title = "en1-update-1"
      entity3.title = "en3-update-1"
      await manager1().upsertWithReplace([entity1, entity3])

      entity1.title = "en1-update-2"
      entity2.title = "en2-update-2"
      entity3.title = "en3-update-2"
      const { performedActions: performedActions2 } =
        await manager1().upsertWithReplace([entity1, entity2, entity3])

      expect(performedActions2).toEqual({
        created: {},
        updated: {
          [Entity1.name]: [
            expect.objectContaining({ id: entity1.id }),
            expect.objectContaining({ id: entity2.id }),
            expect.objectContaining({ id: entity3.id }),
          ],
        },
        deleted: {},
      })

      const readEntity1 = await manager1().find({ where: { id: "1" } })
      expect(wrap(readEntity1[0]).toPOJO()).toEqual(
        expect.objectContaining({
          id: "1",
          title: "en1-update-2",
        })
      )
      const readEntity2 = await manager1().find({ where: { id: "2" } })
      expect(wrap(readEntity2[0]).toPOJO()).toEqual(
        expect.objectContaining({
          id: "2",
          title: "en2-update-2",
        })
      )
      const readEntity3 = await manager1().find({ where: { id: "3" } })
      expect(wrap(readEntity3[0]).toPOJO()).toEqual(
        expect.objectContaining({
          id: "3",
          title: "en3-update-2",
        })
      )
    })

    it("should successfully do a partial update a flat entity", async () => {
      const entity1 = { id: "1", title: "en1" }

      const { performedActions: performedActions1 } =
        await manager1().upsertWithReplace([entity1])

      expect(performedActions1).toEqual({
        created: {
          [Entity1.name]: [expect.objectContaining({ id: entity1.id })],
        },
        updated: {},
        deleted: {},
      })

      entity1.title = undefined as any

      const { performedActions: performedActions2 } =
        await manager1().upsertWithReplace([entity1])

      expect(performedActions2).toEqual({
        created: {},
        updated: {
          [Entity1.name]: [expect.objectContaining({ id: entity1.id })],
        },
        deleted: {},
      })

      const listedEntities = await manager1().find()

      expect(listedEntities).toHaveLength(1)
      expect(wrap(listedEntities[0]).toPOJO()).toEqual(
        expect.objectContaining({
          id: "1",
          title: "en1",
        })
      )
    })

    it("should apply onUpdate hooks when batch updating entities", async () => {
      const entity1 = { id: "1", title: "en1" }
      const originalUpdatedAt = new Date("2020-01-01T00:00:00.000Z")

      await manager1().upsertWithReplace([
        { ...entity1, updated_at: originalUpdatedAt },
      ])

      const [createdEntity] = await manager1().find({
        where: { id: "1" },
      })

      expect(createdEntity.updated_at.getTime()).toEqual(
        originalUpdatedAt.getTime()
      )

      entity1.title = "en1-update"

      const { performedActions } = await manager1().upsertWithReplace([entity1])

      expect(performedActions).toEqual({
        created: {},
        updated: {
          [Entity1.name]: [expect.objectContaining({ id: entity1.id })],
        },
        deleted: {},
      })

      const [updatedEntity] = await manager1().find({
        where: { id: "1" },
      })

      expect(updatedEntity.title).toBe("en1-update")
      expect(updatedEntity.updated_at.getTime()).toBeGreaterThan(
        createdEntity.updated_at.getTime()
      )
    })

    it("should throw if a sub-entity is passed in a many-to-one relation", async () => {
      const entity2 = {
        id: "2",
        title: "en2",
        handle: "some-handle",
        entity1: { title: "en1" },
      }

      const errMsg = await manager2()
        .upsertWithReplace([entity2])
        .catch((e) => e.message)

      expect(errMsg).toEqual(
        "Many-to-one relation entity1 must be set with an ID"
      )
    })

    // TODO: I believe this should not be allowed
    it("should successfully create the parent entity of a many-to-one", async () => {
      const entity2 = {
        id: "2",
        handle: "some-handle",
        title: "en2",
      }

      await manager2().upsertWithReplace([entity2], {
        relations: [],
      })
      const listedEntities = await manager2().find({
        where: { id: "2" },
        options: { populate: ["entity1"] },
      })

      expect(listedEntities).toHaveLength(1)
      expect(listedEntities[0]).toEqual(
        expect.objectContaining({
          id: "2",
          title: "en2",
          entity1: null,
        })
      )
    })

    it("should set an entity to parent entity of a many-to-one relation", async () => {
      const entity1 = {
        id: "1",
        title: "en1",
      }

      const entity2 = {
        id: "2",
        title: "en2",
        handle: "some-handle",
        entity1: { id: "1" },
      }

      await manager1().upsertWithReplace([entity1])
      await manager2().upsertWithReplace([entity2])

      const listedEntities = await manager2().find({
        where: { id: "2" },
        options: { populate: ["entity1"] },
      })

      expect(listedEntities).toHaveLength(1)
      expect(JSON.parse(JSON.stringify(listedEntities[0]))).toEqual(
        expect.objectContaining({
          id: "2",
          title: "en2",
          entity1: expect.objectContaining({
            title: "en1",
          }),
        })
      )
    })

    it("should successfully unset an entity of a many-to-one relation", async () => {
      const entity1 = {
        id: "1",
        title: "en1",
      }

      const entity2 = {
        id: "2",
        title: "en2",
        handle: "some-handle",
        entity1: { id: "1" },
      }

      await manager1().upsertWithReplace([entity1])
      await manager2().upsertWithReplace([entity2])

      entity2.entity1 = null as any
      await manager2().upsertWithReplace([entity2])

      const listedEntities = await manager2().find({
        where: { id: "2" },
        options: { populate: ["entity1"] },
      })

      const listedEntity1 = await manager1().find({
        where: {},
      })

      expect(listedEntities).toHaveLength(1)
      expect(listedEntities[0]).toEqual(
        expect.objectContaining({
          id: "2",
          title: "en2",
          entity1: null,
        })
      )

      expect(listedEntity1).toHaveLength(1)
      expect(listedEntity1[0].title).toEqual("en1")
    })

    it("should only create the parent entity of a one-to-many if relation is not included", async () => {
      const entity1 = {
        id: "1",
        title: "en1",
        entity2: [{ title: "en2-1" }, { title: "en2-2" }],
      }

      const { performedActions: performedActions1 } =
        await manager1().upsertWithReplace([entity1], {
          relations: [],
        })

      expect(performedActions1).toEqual({
        created: {
          [Entity1.name]: [expect.objectContaining({ id: entity1.id })],
        },
        updated: {},
        deleted: {},
      })

      const listedEntities = await manager1().find({
        where: { id: "1" },
        options: { populate: ["entity2"] },
      })

      expect(listedEntities).toHaveLength(1)
      expect(listedEntities[0]).toEqual(
        expect.objectContaining({
          id: "1",
          title: "en1",
        })
      )
      expect(listedEntities[0].entity2.getItems()).toHaveLength(0)
    })

    it("should successfully create an entity with a sub-entity one-to-many relation", async () => {
      const entity1 = {
        id: "1",
        title: "en1",
        entity2: [
          { title: "en2-1", handle: "some-handle" },
          { title: "en2-2", handle: "some-other-handle" },
        ],
      }

      const { performedActions: performedActions1 } =
        await manager1().upsertWithReplace([entity1], {
          relations: ["entity2"],
        })

      const listedEntities = await manager1().find({
        where: { id: "1" },
        options: { populate: ["entity2"] },
      })

      const entities2 = listedEntities.flatMap((entity1) =>
        entity1.entity2.getItems()
      )

      expect(performedActions1).toEqual({
        created: {
          [Entity1.name]: [expect.objectContaining({ id: entity1.id })],
          [Entity2.name]: entities2.map((entity2) => ({ id: entity2.id })),
        },
        updated: {},
        deleted: {},
      })

      expect(listedEntities).toHaveLength(1)
      expect(listedEntities[0]).toEqual(
        expect.objectContaining({
          id: "1",
          title: "en1",
        })
      )
      expect(listedEntities[0].entity2.getItems()).toHaveLength(2)
      expect(listedEntities[0].entity2.getItems()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            title: "en2-1",
          }),
          expect.objectContaining({
            title: "en2-2",
          }),
        ])
      )
    })

    it("should clear the parent entity from the one-to-many relation", async () => {
      const entity1 = {
        id: "1",
        title: "en1",
        entity2: [{ title: "en2-1", handle: "some-handle", entity1: null }],
      }

      const { performedActions: performedActions1 } =
        await manager1().upsertWithReplace([entity1], {
          relations: ["entity2"],
        })
      const listedEntities = await manager1().find({
        where: { id: "1" },
        options: { populate: ["entity2"] },
      })

      expect(performedActions1).toEqual({
        created: {
          [Entity1.name]: [expect.objectContaining({ id: entity1.id })],
          [Entity2.name]: [
            expect.objectContaining({ id: listedEntities[0].entity2[0].id }),
          ],
        },
        updated: {},
        deleted: {},
      })

      expect(listedEntities).toHaveLength(1)
      expect(listedEntities[0]).toEqual(
        expect.objectContaining({
          id: "1",
          title: "en1",
        })
      )
      expect(listedEntities[0].entity2.getItems()).toHaveLength(1)
      expect(listedEntities[0].entity2.getItems()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            title: "en2-1",
          }),
        ])
      )
    })

    it("should only update the parent entity of a one-to-many if relation is not included", async () => {
      const entity1 = {
        id: "1",
        title: "en1",
        entity2: [
          { title: "en2-1", handle: "some-handle" },
          { title: "en2-2", handle: "some-other-handle" },
        ],
      }

      const { entities: entities1, performedActions: performedActions1 } =
        await manager1().upsertWithReplace([entity1], {
          relations: ["entity2"],
        })

      expect(performedActions1).toEqual({
        created: {
          [Entity1.name]: [expect.objectContaining({ id: entity1.id })],
          [Entity2.name]: entities1[0].entity2.map((entity2) =>
            expect.objectContaining({ id: entity2.id })
          ),
        },
        updated: {},
        deleted: {},
      })

      entity1.entity2.push({ title: "en2-3", handle: "some-new-handle" })

      const { performedActions: performedActions2 } =
        await manager1().upsertWithReplace([entity1], {
          relations: [],
        })

      expect(performedActions2).toEqual({
        created: {},
        updated: {
          [Entity1.name]: [expect.objectContaining({ id: entity1.id })],
        },
        deleted: {},
      })

      const listedEntities = await manager1().find({
        where: { id: "1" },
        options: { populate: ["entity2"] },
      })

      expect(listedEntities).toHaveLength(1)
      expect(listedEntities[0]).toEqual(
        expect.objectContaining({
          id: "1",
          title: "en1",
        })
      )
      expect(listedEntities[0].entity2.getItems()).toHaveLength(2)
      expect(listedEntities[0].entity2.getItems()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            title: "en2-1",
          }),
          expect.objectContaining({
            title: "en2-2",
          }),
        ])
      )
    })

    it("should successfully update, create, and delete subentities an entity with a one-to-many relation", async () => {
      const entity1 = {
        id: "1",
        title: "en1",
        entity2: [
          { id: "2", title: "en2-1", handle: "some-handle" },
          { id: "3", title: "en2-2", handle: "some-other-handle" },
        ] as any[],
      }

      const { entities: entities1, performedActions: performedActions1 } =
        await manager1().upsertWithReplace([entity1], {
          relations: ["entity2"],
        })

      expect(performedActions1).toEqual({
        created: {
          [Entity1.name]: [expect.objectContaining({ id: entity1.id })],
          [Entity2.name]: entities1[0].entity2.map((entity2) =>
            expect.objectContaining({ id: entity2.id })
          ),
        },
        updated: {},
        deleted: {},
      })

      entity1.entity2 = [
        { id: "2", title: "newen2-1" },
        { title: "en2-3", handle: "some-new-handle" },
      ]

      const { entities: entities2, performedActions: performedActions2 } =
        await manager1().upsertWithReplace([entity1], {
          relations: ["entity2"],
        })

      const entity2En23 = entities2[0].entity2.find((e) => e.title === "en2-3")!

      expect(performedActions2).toEqual({
        created: {
          [Entity2.name]: [expect.objectContaining({ id: entity2En23.id })],
        },
        updated: {
          [Entity1.name]: [expect.objectContaining({ id: entity1.id })],
          [Entity2.name]: [expect.objectContaining({ id: "2" })],
        },
        deleted: {
          [Entity2.name]: [expect.objectContaining({ id: "3" })],
        },
      })

      const listedEntities = await manager1().find({
        where: { id: "1" },
        options: { populate: ["entity2"] },
      })

      expect(listedEntities).toHaveLength(1)
      expect(listedEntities[0]).toEqual(
        expect.objectContaining({
          id: "1",
          title: "en1",
        })
      )
      expect(listedEntities[0].entity2.getItems()).toHaveLength(2)
      expect(listedEntities[0].entity2.getItems()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            title: "newen2-1",
          }),
          expect.objectContaining({
            title: "en2-3",
          }),
        ])
      )
    })

    it("should successfully update, create, and delete subentities an entity with a one-to-many relation within a transaction", async () => {
      const entity1 = {
        id: "1",
        title: "en1",
        entity2: [
          { id: "2", title: "en2-1", handle: "some-handle" },
          { id: "3", title: "en2-2", handle: "some-other-handle" },
        ] as any[],
      }

      const { entities: entities1, performedActions: performedActions1 } =
        await manager1().transaction(async (txManager) => {
          return await manager1().upsertWithReplace(
            [entity1],
            {
              relations: ["entity2"],
            },
            {
              transactionManager: txManager,
            }
          )
        })

      expect(performedActions1).toEqual({
        created: {
          [Entity1.name]: [expect.objectContaining({ id: entity1.id })],
          [Entity2.name]: entities1[0].entity2.map((entity2) =>
            expect.objectContaining({ id: entity2.id })
          ),
        },
        updated: {},
        deleted: {},
      })

      entity1.entity2 = [
        { id: "2", title: "newen2-1" },
        { title: "en2-3", handle: "some-new-handle" },
      ]

      const { entities: entities2, performedActions: performedActions2 } =
        await manager1().transaction(async (txManager) => {
          return await manager1().upsertWithReplace(
            [entity1],
            {
              relations: ["entity2"],
            },
            { transactionManager: txManager }
          )
        })

      const entity2En23 = entities2[0].entity2.find((e) => e.title === "en2-3")!

      expect(performedActions2).toEqual({
        created: {
          [Entity2.name]: [expect.objectContaining({ id: entity2En23.id })],
        },
        updated: {
          [Entity1.name]: [expect.objectContaining({ id: entity1.id })],
          [Entity2.name]: [expect.objectContaining({ id: "2" })],
        },
        deleted: {
          [Entity2.name]: [expect.objectContaining({ id: "3" })],
        },
      })

      const listedEntities = await manager1().find({
        where: { id: "1" },
        options: { populate: ["entity2"] },
      })

      expect(listedEntities).toHaveLength(1)
      expect(listedEntities[0]).toEqual(
        expect.objectContaining({
          id: "1",
          title: "en1",
        })
      )
      expect(listedEntities[0].entity2.getItems()).toHaveLength(2)
      expect(listedEntities[0].entity2.getItems()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            title: "newen2-1",
          }),
          expect.objectContaining({
            title: "en2-3",
          }),
        ])
      )
    })

    it("should update an entity with a one-to-many relation that has the same unique constraint key", async () => {
      const entity1 = {
        id: "1",
        title: "en1",
        entity2: [{ id: "2", title: "en2-1", handle: "some-handle" }] as any[],
      }

      await manager1().upsertWithReplace([entity1], {
        relations: ["entity2"],
      })

      entity1.entity2 = [{ title: "newen2-1", handle: "some-handle" }]
      await manager1().upsertWithReplace([entity1], {
        relations: ["entity2"],
      })

      const listedEntities = await manager1().find({
        where: { id: "1" },
        options: { populate: ["entity2"] },
      })

      expect(listedEntities).toHaveLength(1)
      expect(listedEntities[0]).toEqual(
        expect.objectContaining({
          id: "1",
          title: "en1",
        })
      )
      expect(listedEntities[0].entity2.getItems()).toHaveLength(1)
      expect(listedEntities[0].entity2.getItems()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            title: "newen2-1",
            handle: "some-handle",
          }),
        ])
      )
    })

    it("should only create the parent entity of a many-to-many if relation is not included", async () => {
      const entity1 = {
        id: "1",
        title: "en1",
        entity3: [{ title: "en3-1" }, { title: "en3-2" }],
      }

      await manager1().upsertWithReplace([entity1], {
        relations: [],
      })
      const listedEntities = await manager1().find({
        where: { id: "1" },
        options: { populate: ["entity3"] },
      })

      expect(listedEntities).toHaveLength(1)
      expect(listedEntities[0]).toEqual(
        expect.objectContaining({
          id: "1",
          title: "en1",
        })
      )
      expect(listedEntities[0].entity3.getItems()).toHaveLength(0)
    })

    it("should successfully create an entity with a sub-entity many-to-many relation", async () => {
      const entity1 = {
        id: "1",
        title: "en1",
        entity3: [{ title: "en3-1" }, { title: "en3-2" }],
      }

      await manager1().upsertWithReplace([entity1], {
        relations: ["entity3"],
      })
      const listedEntity1 = await manager1().find({
        where: { id: "1" },
        options: { populate: ["entity3"] },
      })

      const listedEntity3 = await manager3().find({
        where: { title: "en3-1" },
        options: { populate: ["entity1"] },
      })

      expect(listedEntity1).toHaveLength(1)
      expect(listedEntity1[0]).toEqual(
        expect.objectContaining({
          id: "1",
          title: "en1",
        })
      )
      expect(listedEntity1[0].entity3.getItems()).toHaveLength(2)
      expect(listedEntity1[0].entity3.getItems()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            title: "en3-1",
          }),
          expect.objectContaining({
            title: "en3-2",
          }),
        ])
      )

      expect(listedEntity3).toHaveLength(1)
      expect(listedEntity3[0]).toEqual(
        expect.objectContaining({
          title: "en3-1",
        })
      )
      expect(listedEntity3[0].entity1.getItems()).toHaveLength(1)
      expect(listedEntity3[0].entity1.getItems()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            title: "en1",
          }),
        ])
      )
    })

    it("should only update the parent entity of a many-to-many if relation is not included", async () => {
      const entity1 = {
        id: "1",
        title: "en1",
        entity3: [{ title: "en3-1" }, { title: "en3-2" }],
      }

      await manager1().upsertWithReplace([entity1], {
        relations: ["entity3"],
      })
      entity1.title = "newen1"
      entity1.entity3.push({ title: "en3-3" })
      await manager1().upsertWithReplace([entity1], {
        relations: [],
      })

      const listedEntities = await manager1().find({
        where: { id: "1" },
        options: { populate: ["entity3"] },
      })

      expect(listedEntities).toHaveLength(1)
      expect(listedEntities[0].title).toEqual("newen1")

      expect(listedEntities[0].entity3.getItems()).toHaveLength(2)
      expect(listedEntities[0].entity3.getItems()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            title: "en3-1",
          }),
          expect.objectContaining({
            title: "en3-2",
          }),
        ])
      )
    })

    it("should successfully create subentities and delete pivot relationships on a many-to-many relation", async () => {
      const entity1 = {
        id: "1",
        title: "en1",
        entity3: [
          { id: "4", title: "en3-1" },
          { id: "5", title: "en3-2" },
        ] as any,
      }

      await manager1().upsertWithReplace([entity1], {
        relations: ["entity3"],
      })

      entity1.title = "newen1"
      entity1.entity3 = [{ id: "4", title: "newen3-1" }, { title: "en3-4" }]

      // We don't do many-to-many updates, so id: 4 entity should remain unchanged
      await manager1().upsertWithReplace([entity1], {
        relations: ["entity3"],
      })

      const listedEntities = await manager1().find({
        where: { id: "1" },
        options: { populate: ["entity3"] },
      })

      const listedEntity3 = await manager3().find({
        where: {},
      })

      expect(listedEntities).toHaveLength(1)
      expect(listedEntities[0].title).toEqual("newen1")
      expect(listedEntities[0].entity3.getItems()).toHaveLength(2)
      expect(listedEntities[0].entity3.getItems()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            title: "en3-1",
          }),
          expect.objectContaining({
            title: "en3-4",
          }),
        ])
      )

      // Many-to-many don't get deleted afterwards, even if they were disassociated
      expect(listedEntity3).toHaveLength(3)
    })

    it("should successfully remove relationship when an empty array is passed in a many-to-many relation", async () => {
      const entity1 = {
        id: "1",
        title: "en1",
        entity3: [
          { id: "4", title: "en3-1" },
          { id: "5", title: "en3-2" },
        ] as any,
      }

      await manager1().upsertWithReplace([entity1], {
        relations: ["entity3"],
      })
      entity1.title = "newen1"
      entity1.entity3 = []
      await manager1().upsertWithReplace([entity1], {
        relations: ["entity3"],
      })

      const listedEntities = await manager1().find({
        where: { id: "1" },
        options: { populate: ["entity3"] },
      })

      expect(listedEntities).toHaveLength(1)
      expect(listedEntities[0].title).toEqual("newen1")
      expect(listedEntities[0].entity3.getItems()).toHaveLength(0)
    })

    it("should correctly handle sub-entity upserts", async () => {
      const entity1 = {
        id: "1",
        title: "en1",
        entity3: [
          { id: "4", title: "en3-1" },
          { id: "5", title: "en3-2" },
        ] as any,
      }

      const { entities: mainEntity } = await manager1().upsertWithReplace(
        [entity1],
        {
          relations: ["entity3"],
        }
      )

      entity1.title = "newen1"
      entity1.entity3 = [{ id: "4", title: "newen3-1" }, { title: "en3-4" }]

      // We don't do many-to-many updates, so id: 4 entity should remain unchanged
      await manager1().upsertWithReplace([entity1], {
        relations: ["entity3"],
      })

      // The sub-entity upsert should happen after the main was created
      await manager2().upsertWithReplace([
        {
          id: "2",
          title: "en2",
          handle: "some-handle",
          entity1_id: mainEntity[0].id,
        },
      ])

      const listedEntities = await manager1().find({
        where: { id: "1" },
        options: { populate: ["entity2", "entity3"] },
      })

      expect(listedEntities).toHaveLength(1)
      expect(listedEntities[0].title).toEqual("newen1")
      expect(listedEntities[0].entity2.getItems()).toHaveLength(1)
      expect(listedEntities[0].entity2.getItems()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            title: "en2",
          }),
        ])
      )
      expect(listedEntities[0].entity3.getItems()).toHaveLength(2)
      expect(listedEntities[0].entity3.getItems()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            title: "en3-1",
          }),
          expect.objectContaining({
            title: "en3-4",
          }),
        ])
      )
    })

    it("should return the complete dependency tree as a response, with IDs populated", async () => {
      const entity1 = {
        id: "1",
        title: "en1",
        entity2: [{ title: "en2", handle: "some-handle" }],
        entity3: [{ title: "en3-1" }, { title: "en3-2" }] as any,
      }

      const {
        entities: [createResp],
        performedActions: performedActions1,
      } = await manager1().upsertWithReplace([entity1], {
        relations: ["entity2", "entity3"],
      })

      expect(performedActions1).toEqual({
        created: {
          [Entity1.name]: [expect.objectContaining({ id: createResp.id })],
          [Entity2.name]: [
            expect.objectContaining({ id: createResp.entity2[0].id }),
          ],
          [Entity3.name]: createResp.entity3.map((entity3) =>
            expect.objectContaining({ id: entity3.id })
          ),
        },
        updated: {},
        deleted: {},
      })

      createResp.title = "newen1"
      const {
        entities: [updateResp],
      } = await manager1().upsertWithReplace([createResp], {
        relations: ["entity2", "entity3"],
      })

      expect(createResp.id).toEqual("1")
      expect(createResp.title).toEqual("newen1")
      expect(createResp.entity2).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            title: "en2",
          }),
        ])
      )
      expect(createResp.entity3).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            title: "en3-1",
          }),
          expect.objectContaining({
            id: expect.any(String),
            title: "en3-2",
          }),
        ])
      )

      expect(updateResp.id).toEqual("1")
      expect(updateResp.title).toEqual("newen1")
      expect(updateResp.entity2).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            title: "en2",
          }),
        ])
      )
      expect(updateResp.entity3).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            title: "en3-1",
          }),
          expect.objectContaining({
            id: expect.any(String),
            title: "en3-2",
          }),
        ])
      )
    })

    it("should correctly handle many-to-many upserts with a uniqueness constriant on a non-primary key", async () => {
      const entity1 = {
        id: "1",
        title: "en1",
        entity3: [
          { id: "4", title: "en3-1" },
          { id: "5", title: "en3-2" },
        ] as any,
      }

      await manager1().upsertWithReplace([entity1], {
        relations: ["entity3"],
      })

      await manager1().upsertWithReplace([{ ...entity1, id: "2" }], {
        relations: ["entity3"],
      })

      const listedEntities = await manager1().find({
        where: {},
        options: { populate: ["entity3"] },
      })

      expect(listedEntities).toHaveLength(2)
      expect(listedEntities[0].entity3.getItems()).toEqual(
        listedEntities[1].entity3.getItems()
      )
    })
  })

  describe("delete", () => {
    it("should delete an entity with a standard id primary key and return the ids", async () => {
      const seedManager = orm.em.fork()
      await manager1().create(
        [
          { id: "1", title: "en1" },
          { id: "2", title: "en2" },
        ],
        { transactionManager: seedManager }
      )
      await seedManager.flush()

      const deleted = await manager1().delete({ id: "1" })

      expect(deleted).toEqual(["1"])

      const remaining = await manager1().find({ where: {} })
      expect(remaining).toHaveLength(1)
      expect(remaining[0].id).toEqual("2")
    })

    it("should delete an entity with a custom (non-id) primary key and return the primary key values", async () => {
      const seedManager = orm.em.fork()
      await customPkManager().create(
        [
          { code: "code-1", title: "first" },
          { code: "code-2", title: "second" },
        ],
        { transactionManager: seedManager }
      )
      await seedManager.flush()

      const deleted = await customPkManager().delete({ code: "code-1" })

      expect(deleted).toEqual(["code-1"])

      const remaining = await customPkManager().find({ where: {} })
      expect(remaining).toHaveLength(1)
      expect(remaining[0].code).toEqual("code-2")
    })

    it("should delete an entity with a composite primary key and return the primary key values keyed by property name", async () => {
      const seedManager = orm.em.fork()
      await compositePkManager().create(
        [
          { foo: "foo-1", bar: "bar-1", title: "first" },
          { foo: "foo-2", bar: "bar-2", title: "second" },
        ],
        { transactionManager: seedManager }
      )
      await seedManager.flush()

      const deleted = await compositePkManager().delete({
        foo: "foo-1",
        bar: "bar-1",
      })

      expect(deleted).toEqual([{ foo: "foo-1", bar: "bar-1" }])

      const remaining = await compositePkManager().find({ where: {} })
      expect(remaining).toHaveLength(1)
      expect(remaining[0].foo).toEqual("foo-2")
      expect(remaining[0].bar).toEqual("bar-2")
    })
  })

  describe("error mapping", () => {
    it("should map UniqueConstraintViolationException to MedusaError on upsertWithReplace", async () => {
      const entity3 = { title: "en3" }

      await manager3().upsertWithReplace([entity3])

      const err = await manager3()
        .upsertWithReplace([entity3])
        .catch((e) => e.message)

      expect(err).toEqual("Entity3 with title: en3, already exists.")
    })

    it("should map NotNullConstraintViolationException MedusaError on upsertWithReplace", async () => {
      const entity3 = { title: null }
      const err = await manager3()
        .upsertWithReplace([entity3])
        .catch((e) => e.message)

      expect(err).toEqual("Cannot set field 'title' of Entity3 to null")
    })

    it("should map InvalidFieldNameException MedusaError on upsertWithReplace", async () => {
      const entity3 = { othertitle: "en3" }
      const err = await manager3()
        .upsertWithReplace([entity3])
        .catch((e) => e.message)

      expect(err).toEqual(
        'column "othertitle" of relation "entity3" does not exist'
      )
    })

    it("should map ForeignKeyConstraintViolationException MedusaError on upsertWithReplace", async () => {
      const entity2 = {
        title: "en2",
        handle: "some-handle",
        entity1: { id: "1" },
      }
      const err = await manager2()
        .upsertWithReplace([entity2])
        .catch((e) => e.message)

      expect(err).toEqual(
        "You tried to set relationship entity1_id: 1, but such entity does not exist"
      )
    })

    it("should efficiently handle large batches with deeply nested relations", async () => {
      const numParentEntities = 25
      const numEntity2PerParent = 10
      const numEntity3PerParent = 8
      const numEntity4PerEntity3 = 5
      const numEntity5PerEntity3 = 4
      const numEntity6PerEntity5 = 3

      const entity5Manager = manager5()
      const entity3Manager = manager3()
      const entity1Manager = manager1()

      const qbInsertSpy = jest.fn()
      const qbSelectSpy = jest.fn()
      const qbDeleteSpy = jest.fn()

      const wrapManagerQb = (activeManager: any) => {
        const originalQb = activeManager.qb
        jest.spyOn(activeManager, "qb").mockImplementation((...args) => {
          const qb = originalQb.apply(activeManager, args)

          const originalInsert = qb.insert
          const originalSelect = qb.select
          const originalDelete = qb.delete

          qb.insert = jest.fn((...insertArgs) => {
            qbInsertSpy(...insertArgs)
            return originalInsert.apply(qb, insertArgs)
          })

          qb.select = jest.fn((...selectArgs) => {
            qbSelectSpy(...selectArgs)
            return originalSelect.apply(qb, selectArgs)
          })

          qb.delete = jest.fn(() => {
            qbDeleteSpy()
            return originalDelete.apply(qb)
          })

          return qb
        })
      }

      let entity5ActiveManager: any = entity5Manager.getActiveManager()
      let entity3ActiveManager: any = entity3Manager.getActiveManager()
      let entity1ActiveManager: any = entity1Manager.getActiveManager()

      entity5Manager.getActiveManager = jest
        .fn(() => entity5ActiveManager)
        .mockReturnValue(entity5ActiveManager)
      entity3Manager.getActiveManager = jest
        .fn(() => entity3ActiveManager)
        .mockReturnValue(entity3ActiveManager)
      entity1Manager.getActiveManager = jest
        .fn(() => entity1ActiveManager)
        .mockReturnValue(entity1ActiveManager)

      wrapManagerQb(entity5ActiveManager)
      wrapManagerQb(entity3ActiveManager)
      wrapManagerQb(entity1ActiveManager)

      const findSpy = jest.spyOn(entity5ActiveManager, "find")
      const nativeUpdateManySpy = jest.spyOn(
        manager.getDriver(),
        "nativeUpdateMany"
      )
      const nativeDeleteSpy = jest.spyOn(entity5ActiveManager, "nativeDelete")

      qbInsertSpy.mockClear()
      qbSelectSpy.mockClear()
      qbDeleteSpy.mockClear()
      findSpy.mockClear()
      nativeUpdateManySpy.mockClear()
      nativeDeleteSpy.mockClear()

      // Create deeply nested dataset
      const complexEntities = Array.from(
        { length: numParentEntities },
        (_, i) => ({
          id: `parent-${i.toString().padStart(3, "0")}`,
          title: `Parent Entity ${i}`,
          entity2: Array.from({ length: numEntity2PerParent }, (_, j) => ({
            id: `e2-${i}-${j}`,
            title: `Entity2 ${j} of Parent ${i}`,
            handle: `handle-${i}-${j}`,
          })),
          entity3: Array.from({ length: numEntity3PerParent }, (_, k) => ({
            id: `e3-${i}-${k}`,
            title: `Entity3 ${k} of Parent ${i}`,
            entity4: Array.from({ length: numEntity4PerEntity3 }, (_, l) => ({
              id: `e4-${i}-${k}-${l}`,
              title: `Entity4 ${l} of Entity3 ${k}`,
              description: `Description for nested entity ${l}`,
            })),
            entity5: Array.from({ length: numEntity5PerEntity3 }, (_, m) => ({
              id: `e5-${i}-${k}-${m}`,
              title: `Entity5 ${m} of Entity3 ${k}`,
              value: i * 100 + k * 10 + m,
              entity6: Array.from({ length: numEntity6PerEntity5 }, (_, n) => ({
                id: `e6-${i}-${k}-${m}-${n}`,
                title: `Entity6 ${n} deeply nested`,
                metadata: `{"parent": ${i}, "e3": ${k}, "e5": ${m}, "e6": ${n}}`,
              })),
            })),
          })),
        })
      )

      // First: Create Entity5 with Entity6 relations
      const allEntity5Data = complexEntities.flatMap((parent) =>
        parent.entity3.flatMap((e3) => e3.entity5)
      )

      const { performedActions: e5CreateActions } =
        await entity5Manager.upsertWithReplace(allEntity5Data, {
          relations: ["entity6"],
        })

      const e5SelectCalls = qbSelectSpy.mock.calls.length
      const e5InsertCalls = qbInsertSpy.mock.calls.length

      expect(e5SelectCalls).toBe(2) // One for Entity5, one for Entity6
      expect(e5InsertCalls).toBe(2) // One batch insert for Entity5s, one for Entity6s

      // Check that the expected batch sizes exist (order may vary)
      const e5BatchSizes = qbInsertSpy.mock.calls.map((call) => call[0].length)
      expect(e5BatchSizes).toContain(800) // entity5 25 * 8 * 4
      expect(e5BatchSizes).toContain(2400) // entity6 25 * 8 * 4 * 3

      findSpy.mockClear()
      qbSelectSpy.mockClear()
      qbInsertSpy.mockClear()
      qbDeleteSpy.mockClear()
      nativeUpdateManySpy.mockClear()
      nativeDeleteSpy.mockClear()

      // Second: Create Entity3 with Entity4 and Entity5 relations
      const allEntity3Data = complexEntities.flatMap((parent) =>
        parent.entity3.map((e3) => ({
          ...e3,
          // Reference existing Entity5 by ID only
          entity5: e3.entity5.map((e5) => ({ id: e5.id })),
        }))
      )

      const { performedActions: e3CreateActions } =
        await entity3Manager.upsertWithReplace(allEntity3Data, {
          relations: ["entity4", "entity5"],
        })

      const e3SelectCalls = qbSelectSpy.mock.calls.length
      const e3InsertCalls = qbInsertSpy.mock.calls.length

      expect(e3SelectCalls).toBe(3) // One for Entity3, one for Entity5, One pivot entity3 -> entity5
      expect(e3InsertCalls).toBe(3) // One batch insert for Entity3s, one for Entity4s and one pivot entity3 -> entity5

      // Check that the expected batch sizes exist (order may vary)
      const e3BatchSizes = qbInsertSpy.mock.calls.map((call) => call[0].length)
      expect(e3BatchSizes).toContain(200) // entity3: 25 * 8
      expect(e3BatchSizes).toContain(800) // pivot entity3 -> entity5: 25 * 8 * 4
      expect(e3BatchSizes).toContain(1000) // entity4: 25 * 8 * 5

      findSpy.mockClear()
      qbSelectSpy.mockClear()
      qbInsertSpy.mockClear()
      qbDeleteSpy.mockClear()
      nativeUpdateManySpy.mockClear()
      nativeDeleteSpy.mockClear()

      // Third: Create Entity1 with all relations
      const mainEntitiesData = complexEntities.map((parent) => ({
        ...parent,
        // Reference existing Entity3 by ID only
        entity3: parent.entity3.map((e3) => ({ id: e3.id })),
      }))

      const { performedActions: mainCreateActions } =
        await entity1Manager.upsertWithReplace(mainEntitiesData, {
          relations: ["entity2", "entity3"],
        })

      const mainSelectCalls = qbSelectSpy.mock.calls.length
      const mainInsertCalls = qbInsertSpy.mock.calls.length

      expect(mainSelectCalls).toBe(3) // One for Entity1, one for Entity3, one for Entity2
      expect(mainInsertCalls).toBe(3) // One batch insert for Entity1s, one for Entity2s, one for Entity3s

      // Check that the expected batch sizes exist (order may vary)
      const mainBatchSizes = qbInsertSpy.mock.calls.map(
        (call) => call[0].length
      )
      expect(mainBatchSizes).toContain(25) // entity1: 25
      expect(mainBatchSizes).toContain(200) // entity3: 25 * 8
      expect(mainBatchSizes).toContain(250) // entity2: 25 * 10

      findSpy.mockClear()
      qbSelectSpy.mockClear()
      qbInsertSpy.mockClear()
      qbDeleteSpy.mockClear()
      nativeUpdateManySpy.mockClear()
      nativeDeleteSpy.mockClear()

      // Verify creation counts
      expect(e5CreateActions.created[Entity5.name]).toHaveLength(
        numParentEntities * numEntity3PerParent * numEntity5PerEntity3
      )
      expect(e5CreateActions.created[Entity6.name]).toHaveLength(
        numParentEntities *
          numEntity3PerParent *
          numEntity5PerEntity3 *
          numEntity6PerEntity5
      )
      expect(e3CreateActions.created[Entity3.name]).toHaveLength(
        numParentEntities * numEntity3PerParent
      )
      expect(e3CreateActions.created[Entity4.name]).toHaveLength(
        numParentEntities * numEntity3PerParent * numEntity4PerEntity3
      )
      expect(mainCreateActions.created[Entity1.name]).toHaveLength(
        numParentEntities
      )
      expect(mainCreateActions.created[Entity2.name]).toHaveLength(
        numParentEntities * numEntity2PerParent
      )

      // Now test complex updates

      // Modify nested structures
      const updatedComplexEntities = complexEntities.map((parent, i) => ({
        ...parent,
        title: `Updated ${parent.title}`,
        entity2: [
          // Keep first 5 out of 10, update them
          ...parent.entity2.slice(0, 5).map((e2) => ({
            ...e2,
            title: `Updated ${e2.title}`,
          })),
          // Add new ones
          {
            id: `new-e2-${i}-0`,
            title: `New Entity2 0`,
            handle: `new-handle-${i}-0`,
          },
          {
            id: `new-e2-${i}-1`,
            title: `New Entity2 1`,
            handle: `new-handle-${i}-1`,
          },
        ],
        entity3: parent.entity3.slice(0, 4).map((e3) => ({ id: e3.id })), // Keep only first 4
      }))

      const { performedActions: updateActions } =
        await entity1Manager.upsertWithReplace(updatedComplexEntities, {
          relations: ["entity2", "entity3"],
        })

      // Validate batching for update operations
      const updateSelectCalls = qbSelectSpy.mock.calls.length
      const updateInsertCalls = qbInsertSpy.mock.calls.length
      const updateManyCalls = nativeUpdateManySpy.mock.calls.length

      expect(updateSelectCalls).toBe(3) // Entity1, Entity2, Entity3 existence checks

      // Should use batch updates for existing entities
      expect(updateManyCalls).toBe(3) // 1 for Entity1 (25), 2 for Entity2 (100+25, chunked due to 100 batch limit)

      // Should use batch inserts for new entities and pivot relationships
      expect(updateInsertCalls).toBe(2) // pivot Entity1 - Entity3 (with conflict resolution) + new Entity2s
      // Check that the expected batch sizes exist (order may vary)
      const updateBatchSizes = qbInsertSpy.mock.calls.map(
        (call) => call[0].length
      )
      expect(updateBatchSizes).toContain(100) // pivot Entity1 - Entity3: 25 parents × 4 entity3s each (uses onConflict().ignore())
      expect(updateBatchSizes).toContain(50) // New Entity2s: 25 parents × 2 new each

      // We wont check the deletion which happen through knex directly. It will be accounted for in
      // the final state verification

      // Validate that updates are batched correctly with chunking
      expect(nativeUpdateManySpy.mock.calls[0][2]).toHaveLength(25) // Entity1: 25 entities
      expect(nativeUpdateManySpy.mock.calls[1][2]).toHaveLength(100) // Entity2 chunk 1: 100 entities
      expect(nativeUpdateManySpy.mock.calls[2][2]).toHaveLength(25) // Entity2 chunk 2: 25 entities

      // Verify updates
      expect(updateActions.updated[Entity1.name]).toHaveLength(
        numParentEntities
      )
      expect(updateActions.updated[Entity2.name]).toHaveLength(
        numParentEntities * 5
      ) // 5 updated per parent
      expect(updateActions.created[Entity2.name]).toHaveLength(
        numParentEntities * 2
      ) // 2 new per parent
      expect(updateActions.deleted[Entity2.name]).toHaveLength(
        numParentEntities * 5
      ) // 5 deleted per parent (kept first 5 out of 10, so 5 deleted)

      // Verify order preservation
      updateActions.updated[Entity1.name].forEach((entity, index) => {
        expect(entity.id).toBe(`parent-${index.toString().padStart(3, "0")}`)
      })

      // Verify final  state
      const finalEntities = await manager1().find({
        where: {},
        options: {
          populate: ["entity2", "entity3"],
          orderBy: { id: "ASC" } as any,
        },
      })

      expect(finalEntities).toHaveLength(numParentEntities)
      finalEntities.forEach((entity, i) => {
        expect(entity.title).toBe(`Updated Parent Entity ${i}`)
        expect(entity.entity2).toHaveLength(7) // 5 updated + 2 new
        expect(entity.entity3).toHaveLength(4) // Only first 4 kept
      })

      // Verify nested relationships still exist
      const sampleEntity3 = await manager3().find({
        where: { id: "e3-0-0" },
        options: {
          populate: ["entity4", "entity5"],
        },
      })

      expect(sampleEntity3).toHaveLength(1)
      expect(sampleEntity3[0].entity4).toHaveLength(numEntity4PerEntity3)
      expect(sampleEntity3[0].entity5).toHaveLength(numEntity5PerEntity3)

      // Verify deeply nested Entity6 relationships
      const sampleEntity5 = await manager5().find({
        where: { id: "e5-0-0-0" },
        options: {
          populate: ["entity6"],
        },
      })

      expect(sampleEntity5).toHaveLength(1)
      expect(sampleEntity5[0].entity6).toHaveLength(numEntity6PerEntity5)
    })
  })
})
