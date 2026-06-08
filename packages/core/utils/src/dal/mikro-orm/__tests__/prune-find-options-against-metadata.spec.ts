import {
  Collection,
  Entity,
  ManyToOne,
  MikroORM,
  OneToMany,
  PrimaryKey,
  Property,
} from "@medusajs/deps/mikro-orm/core"
import { defineConfig } from "@medusajs/deps/mikro-orm/postgresql"
import { pruneFindOptionsAgainstMetadata } from "../prune-find-options-against-metadata"

@Entity()
class Parent {
  @PrimaryKey()
  id!: string

  @Property()
  title!: string

  @OneToMany(() => Child, (child) => child.parent)
  children = new Collection<Child>(this)
}

@Entity()
class Child {
  @PrimaryKey()
  id!: string

  @Property()
  title!: string

  @ManyToOne(() => Parent, { nullable: true })
  parent: Parent | null = null

  @ManyToOne(() => GrandChild, { nullable: true })
  grand_child: GrandChild | null = null
}

@Entity()
class GrandChild {
  @PrimaryKey()
  id!: string

  @Property()
  label!: string
}

describe("pruneFindOptionsAgainstMetadata", () => {
  let orm: MikroORM
  let parentMeta: any

  beforeAll(async () => {
    orm = await MikroORM.init(
      defineConfig({
        entities: [Parent, Child, GrandChild],
        user: "postgres",
        password: "",
        dbName: "test",
        connect: false,
      })
    )
    parentMeta = orm.em.getMetadata().get(Parent.name)
  })

  afterAll(async () => {
    await orm.close(true)
  })

  describe("fields", () => {
    it("keeps bare scalar fields", () => {
      const options = { fields: ["id", "title"] }
      const { droppedFields } = pruneFindOptionsAgainstMetadata(
        parentMeta,
        options
      )
      expect(options.fields).toEqual(["id", "title"])
      expect(droppedFields).toEqual([])
    })

    it("keeps wildcard fields", () => {
      const options = { fields: ["*", "children.*"] }
      const { droppedFields } = pruneFindOptionsAgainstMetadata(
        parentMeta,
        options
      )
      expect(options.fields).toEqual(["*", "children.*"])
      expect(droppedFields).toEqual([])
    })

    it("keeps dotted paths through real relations", () => {
      const options = {
        fields: ["children.id", "children.title", "children.grand_child.label"],
      }
      const { droppedFields } = pruneFindOptionsAgainstMetadata(
        parentMeta,
        options
      )
      expect(options.fields).toEqual([
        "children.id",
        "children.title",
        "children.grand_child.label",
      ])
      expect(droppedFields).toEqual([])
    })

    it("drops dotted paths through non-existent properties", () => {
      const options = { fields: ["id", "bogus.id"] }
      const { droppedFields } = pruneFindOptionsAgainstMetadata(
        parentMeta,
        options
      )
      expect(options.fields).toEqual(["id"])
      expect(droppedFields).toEqual(["bogus.id"])
    })

    it("drops dotted paths through scalar properties", () => {
      const options = { fields: ["title.something"] }
      const { droppedFields } = pruneFindOptionsAgainstMetadata(
        parentMeta,
        options
      )
      expect(options.fields).toEqual([])
      expect(droppedFields).toEqual(["title.something"])
    })

    it("drops broken chains beyond a real relation", () => {
      const options = {
        fields: ["children.bogus.label", "children.grand_child.bogus"],
      }
      const { droppedFields } = pruneFindOptionsAgainstMetadata(
        parentMeta,
        options
      )
      expect(options.fields).toEqual([])
      expect(droppedFields).toEqual([
        "children.bogus.label",
        "children.grand_child.bogus",
      ])
    })

    it("keeps mixed valid + invalid, dropping only the invalid ones", () => {
      const options = {
        fields: ["id", "children.title", "bogus.id", "title.x"],
      }
      const { droppedFields } = pruneFindOptionsAgainstMetadata(
        parentMeta,
        options
      )
      expect(options.fields).toEqual(["id", "children.title"])
      expect(droppedFields).toEqual(["bogus.id", "title.x"])
    })
  })

  describe("populate", () => {
    it("keeps relation entries", () => {
      const options = { populate: ["children", "children.grand_child"] }
      const { droppedPopulate } = pruneFindOptionsAgainstMetadata(
        parentMeta,
        options
      )
      expect(options.populate).toEqual(["children", "children.grand_child"])
      expect(droppedPopulate).toEqual([])
    })

    it("preserves wildcard populate", () => {
      const options = { populate: ["*"] }
      const { droppedPopulate } = pruneFindOptionsAgainstMetadata(
        parentMeta,
        options
      )
      expect(options.populate).toEqual(["*"])
      expect(droppedPopulate).toEqual([])
    })

    it("leaves boolean populate untouched", () => {
      const optsTrue: any = { populate: true }
      const optsFalse: any = { populate: false }
      pruneFindOptionsAgainstMetadata(parentMeta, optsTrue)
      pruneFindOptionsAgainstMetadata(parentMeta, optsFalse)
      expect(optsTrue.populate).toBe(true)
      expect(optsFalse.populate).toBe(false)
    })

    it("keeps scalar names in populate (Medusa convention)", () => {
      // Medusa's buildQuery sends `relations` paths into MikroORM's
      // populate where the trailing segment is often a scalar projection,
      // e.g. "payment_sessions.amount". The prune must not drop those.
      const options = { populate: ["title", "children.title"] }
      const { droppedPopulate } = pruneFindOptionsAgainstMetadata(
        parentMeta,
        options
      )
      expect(options.populate).toEqual(["title", "children.title"])
      expect(droppedPopulate).toEqual([])
    })

    it("drops populate entries that don't exist on the entity", () => {
      const options = { populate: ["bogus", "children"] }
      const { droppedPopulate } = pruneFindOptionsAgainstMetadata(
        parentMeta,
        options
      )
      expect(options.populate).toEqual(["children"])
      expect(droppedPopulate).toEqual(["bogus"])
    })

    it("strips strategy suffix when validating segments", () => {
      const options = { populate: ["children:joined"] }
      const { droppedPopulate } = pruneFindOptionsAgainstMetadata(
        parentMeta,
        options
      )
      expect(options.populate).toEqual(["children:joined"])
      expect(droppedPopulate).toEqual([])
    })
  })

  describe("6.6.14 merge-branch regression", () => {
    // The behavior change in @mikro-orm/core@6.6.14 merges nested field
    // paths into explicit populate; if any merged hint is invalid,
    // MikroORM rejects the find. Pruning at the boundary keeps both
    // arrays valid so the merge produces only resolvable paths.
    it("drops dotted field paths that would leak as invalid populate hints", () => {
      const options = {
        fields: [
          "id",
          "children.title",
          "children.something_bogus",
          "bogus.id",
        ],
        populate: ["children"],
      }
      const result = pruneFindOptionsAgainstMetadata(parentMeta, options)
      expect(options.fields).toEqual(["id", "children.title"])
      expect(options.populate).toEqual(["children"])
      expect(result.droppedFields).toEqual([
        "children.something_bogus",
        "bogus.id",
      ])
      expect(result.droppedPopulate).toEqual([])
    })
  })

  describe("logger", () => {
    it("emits debug logs for dropped paths when logger is provided", () => {
      const debug = jest.fn()
      const options = { fields: ["bogus.id"], populate: ["bogus"] }
      pruneFindOptionsAgainstMetadata(parentMeta, options, { debug })
      expect(debug).toHaveBeenCalledTimes(2)
      expect(debug.mock.calls[0][0]).toContain("bogus.id")
      expect(debug.mock.calls[1][0]).toContain("bogus")
    })
  })

  describe("guard rails", () => {
    it("is a no-op when meta is undefined", () => {
      const options = { fields: ["whatever"], populate: ["whatever"] }
      const result = pruneFindOptionsAgainstMetadata(undefined, options)
      expect(options.fields).toEqual(["whatever"])
      expect(options.populate).toEqual(["whatever"])
      expect(result.droppedFields).toEqual([])
      expect(result.droppedPopulate).toEqual([])
    })

    it("leaves non-array fields/populate untouched", () => {
      const options: any = { fields: undefined, populate: undefined }
      pruneFindOptionsAgainstMetadata(parentMeta, options)
      expect(options.fields).toBeUndefined()
      expect(options.populate).toBeUndefined()
    })
  })
})
