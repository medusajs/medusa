import {
  BeforeCreate,
  Entity,
  MikroORM,
  OnInit,
  PrimaryKey,
  Property,
} from "@medusajs/deps/mikro-orm/core"
import {
  defineConfig,
  SqlEntityManager,
} from "@medusajs/deps/mikro-orm/postgresql"
import { FindConfig } from "@medusajs/types"
import { dropDatabase } from "pg-god"
import { buildQuery } from "../../../../modules-sdk/build-query"
import { mikroOrmBaseRepositoryFactory } from "../../mikro-orm-repository"
import {
  createSqlCapture,
  expectCapturedQueries,
  getDatabaseURL,
  pgGodCredentials,
  SqlCapture,
} from "../__fixtures__/database"

jest.setTimeout(300000)

const dbName = "mikroorm-cross-module-order-product"

@Entity({ tableName: "order" })
class OrderEntity {
  @PrimaryKey()
  id: string

  @Property()
  display_id: string

  @Property({ nullable: true })
  deleted_at: Date | null

  @OnInit()
  @BeforeCreate()
  onInit() {
    if (!this.id) {
      this.id = Math.random().toString(36).substring(7)
    }
  }
}

@Entity({ tableName: "product" })
class ProductEntity {
  @PrimaryKey()
  id: string

  @Property()
  handle: string

  @Property({ nullable: true })
  deleted_at: Date | null

  @OnInit()
  @BeforeCreate()
  onInit() {
    if (!this.id) {
      this.id = Math.random().toString(36).substring(7)
    }
  }
}

@Entity({ tableName: "order_line_item" })
class OrderLineItemEntity {
  @PrimaryKey()
  id: string

  @Property()
  order_id: string

  @Property({ nullable: true })
  product_id: string | null

  @Property({ nullable: true })
  deleted_at: Date | null

  @OnInit()
  @BeforeCreate()
  onInit() {
    if (!this.id) {
      this.id = Math.random().toString(36).substring(7)
    }
  }
}

const OrderEntityRepository = mikroOrmBaseRepositoryFactory(OrderEntity)
const ProductEntityRepository = mikroOrmBaseRepositoryFactory(ProductEntity)
const OrderLineItemEntityRepository =
  mikroOrmBaseRepositoryFactory(OrderLineItemEntity)

const ordersSeed = [
  { id: "order_a", display_id: "1001" },
  { id: "order_b", display_id: "1002" },
  { id: "order_c", display_id: "1003" },
]

const productsSeed = [
  { id: "prod_standard", handle: "standard" },
  { id: "prod_premium", handle: "premium" },
]

const orderProductLinksSeed = [
  { id: "link_1", order_id: "order_a", product_id: "prod_premium" },
  { id: "link_2", order_id: "order_b", product_id: "prod_standard" },
  { id: "link_3", order_id: "order_c", product_id: "prod_premium" },
]

const regionsSeed = [
  { id: "reg_eu", code: "eu" },
  { id: "reg_us", code: "us" },
]

const orderRegionLinksSeed = [
  { id: "region_link_1", order_id: "order_a", region_id: "reg_eu" },
  { id: "region_link_2", order_id: "order_b", region_id: "reg_eu" },
  { id: "region_link_3", order_id: "order_c", region_id: "reg_us" },
]

const salesChannelsSeed = [
  { id: "sc_web", name: "web-store" },
  { id: "sc_wholesale", name: "wholesale" },
]

const productSalesChannelLinksSeed = [
  {
    id: "psc_link_1",
    product_id: "prod_premium",
    sales_channel_id: "sc_web",
  },
  {
    id: "psc_link_2",
    product_id: "prod_standard",
    sales_channel_id: "sc_wholesale",
  },
]

const orderLineItemsSeed = [
  { id: "li_1", order_id: "order_a", product_id: "prod_premium" },
  { id: "li_2", order_id: "order_b", product_id: "prod_standard" },
  { id: "li_3", order_id: "order_c", product_id: "prod_premium" },
]

async function createLinkTable(manager: SqlEntityManager) {
  const knex = manager.getKnex()

  await knex.schema.createTable("order_product_link", (table) => {
    table.text("id").primary()
    table.text("order_id").notNullable()
    table.text("product_id").notNullable()
    table.timestamps(true, true)
    table.timestamp("deleted_at", { useTz: true }).nullable()
  })

  await knex.schema.createTable("region", (table) => {
    table.text("id").primary()
    table.text("code").notNullable()
    table.timestamps(true, true)
    table.timestamp("deleted_at", { useTz: true }).nullable()
  })

  await knex.schema.createTable("order_region_link", (table) => {
    table.text("id").primary()
    table.text("order_id").notNullable()
    table.text("region_id").notNullable()
    table.timestamps(true, true)
    table.timestamp("deleted_at", { useTz: true }).nullable()
  })

  await knex.schema.createTable("sales_channel", (table) => {
    table.text("id").primary()
    table.text("name").notNullable()
    table.timestamps(true, true)
    table.timestamp("deleted_at", { useTz: true }).nullable()
  })

  await knex.schema.createTable("product_sales_channel", (table) => {
    table.text("id").primary()
    table.text("product_id").notNullable()
    table.text("sales_channel_id").notNullable()
    table.timestamps(true, true)
    table.timestamp("deleted_at", { useTz: true }).nullable()
  })
}

async function seedLinkTable(manager: SqlEntityManager) {
  const knex = manager.getKnex()
  const now = new Date()

  await knex("order_product_link").insert(
    orderProductLinksSeed.map((link) => ({
      ...link,
      created_at: now,
      updated_at: now,
      deleted_at: null,
    }))
  )

  await knex("region").insert(
    regionsSeed.map((region) => ({
      ...region,
      created_at: now,
      updated_at: now,
      deleted_at: null,
    }))
  )

  await knex("order_region_link").insert(
    orderRegionLinksSeed.map((link) => ({
      ...link,
      created_at: now,
      updated_at: now,
      deleted_at: null,
    }))
  )

  await knex("sales_channel").insert(
    salesChannelsSeed.map((salesChannel) => ({
      ...salesChannel,
      created_at: now,
      updated_at: now,
      deleted_at: null,
    }))
  )

  await knex("product_sales_channel").insert(
    productSalesChannelLinksSeed.map((link) => ({
      ...link,
      created_at: now,
      updated_at: now,
      deleted_at: null,
    }))
  )
}

function buildRegionJoinMetadata(filters?: Record<string, unknown>) {
  return {
    link: {
      table: "order_region_link",
      sourceKey: "order_id",
      targetKey: "region_id",
    },
    target: {
      table: "region",
      filters,
    },
  }
}

function buildProductJoinMetadata(filters?: Record<string, unknown>) {
  return {
    link: {
      table: "order_product_link",
      sourceKey: "order_id",
      targetKey: "product_id",
    },
    target: {
      table: "product",
      filters,
    },
  }
}

function buildSalesChannelJoinMetadata(filters?: Record<string, unknown>) {
  return {
    parent: "product",
    link: {
      table: "product_sales_channel",
      sourceKey: "product_id",
      targetKey: "sales_channel_id",
    },
    target: {
      table: "sales_channel",
      filters,
    },
  }
}

function buildReadonlyOrderLineItemProductJoinMetadata(
  filters?: Record<string, unknown>
) {
  return {
    link: {
      table: "order_line_item",
      sourceKey: "order_id",
      targetKey: "product_id",
    },
    target: {
      table: "product",
      filters,
    },
  }
}

function buildReadonlyProductJoinFromOrderLineItemMetadata(
  filters?: Record<string, unknown>
) {
  return {
    link: {
      table: "order_line_item",
      sourceKey: "id",
      targetKey: "product_id",
    },
    target: {
      table: "product",
      filters,
    },
  }
}

function buildReadonlyOrderLineItemJoinFromProductMetadata(
  filters?: Record<string, unknown>
) {
  return {
    link: {
      table: "order_line_item",
      sourceKey: "product_id",
      targetKey: "id",
    },
    target: {
      table: "order_line_item",
      filters,
    },
  }
}

function buildOrderJoinMetadata(filters?: Record<string, unknown>) {
  return {
    link: {
      table: "order_product_link",
      sourceKey: "product_id",
      targetKey: "order_id",
    },
    target: {
      table: "order",
      filters,
    },
  }
}

function orderIds(results: OrderEntity[]): string[] {
  return results.map((row) => row.id)
}

function productIds(results: ProductEntity[]): string[] {
  return results.map((row) => row.id)
}

function orderLineItemIds(results: OrderLineItemEntity[]): string[] {
  return results.map((row) => row.id)
}

describe("cross-module query integration", () => {
  let orm!: MikroORM
  let manager!: SqlEntityManager
  let sqlCapture!: SqlCapture

  const getOrderRepository = () => {
    return new OrderEntityRepository({ manager: manager.fork() })
  }

  const getProductRepository = () => {
    return new ProductEntityRepository({ manager: manager.fork() })
  }

  const getOrderLineItemRepository = () => {
    return new OrderLineItemEntityRepository({ manager: manager.fork() })
  }

  const findOrders = async (
    filters: Record<string, unknown> = {},
    config: FindConfig<any> = {}
  ) => {
    sqlCapture.clear()
    return getOrderRepository().find(buildQuery(filters, config) as any, {
      manager,
    }) as Promise<OrderEntity[]>
  }

  const findOrdersAndCount = async (
    filters: Record<string, unknown> = {},
    config: FindConfig<any> = {}
  ) => {
    sqlCapture.clear()
    return getOrderRepository().findAndCount(
      buildQuery(filters, config) as any,
      { manager }
    ) as Promise<[OrderEntity[], number]>
  }

  const findProducts = async (
    filters: Record<string, unknown> = {},
    config: FindConfig<any> = {}
  ) => {
    sqlCapture.clear()
    return getProductRepository().find(buildQuery(filters, config) as any, {
      manager,
    }) as Promise<ProductEntity[]>
  }

  const findOrderLineItems = async (
    filters: Record<string, unknown> = {},
    config: FindConfig<any> = {}
  ) => {
    sqlCapture.clear()
    return getOrderLineItemRepository().find(
      buildQuery(filters, config) as any,
      { manager }
    ) as Promise<OrderLineItemEntity[]>
  }

  beforeEach(async () => {
    sqlCapture = createSqlCapture()

    await dropDatabase(
      { databaseName: dbName, errorIfNonExist: false },
      pgGodCredentials
    )

    orm = await MikroORM.init(
      defineConfig({
        entities: [OrderEntity, ProductEntity, OrderLineItemEntity],
        clientUrl: getDatabaseURL(dbName),
        onQuery: sqlCapture.onQuery,
      })
    )

    const generator = orm.getSchemaGenerator()
    await generator.ensureDatabase()
    await generator.createSchema()

    manager = orm.em.fork() as unknown as SqlEntityManager

    await createLinkTable(manager)
    await seedLinkTable(manager)

    await getOrderRepository().create(ordersSeed, { manager })
    await getProductRepository().create(productsSeed, { manager })
    await getOrderLineItemRepository().create(orderLineItemsSeed, { manager })
    await manager.flush()
  })

  afterEach(async () => {
    const knex = manager.getKnex()
    await knex.schema.dropTableIfExists("product_sales_channel")
    await knex.schema.dropTableIfExists("sales_channel")
    await knex.schema.dropTableIfExists("order_region_link")
    await knex.schema.dropTableIfExists("region")
    await knex.schema.dropTableIfExists("order_product_link")

    const generator = orm.getSchemaGenerator()
    await generator.dropSchema()
    await orm.close(true)
  })

  describe("listing orders filtered by product", () => {
    it("should filter orders by linked product handle", async () => {
      const config = {
        __internal: {
          crossModuleJoins: [buildProductJoinMetadata({ handle: "premium" })],
        },
      }

      const results = await findOrders({}, config)

      expectCapturedQueries(
        orm,
        sqlCapture,
        `
          select "o0".*
          from "order" as "o0"
          where exists (
            select 1
            from "public"."order_product_link" as "cm_link_0"
            inner join "public"."product" as "product" on true
            where "cm_link_0"."order_id" = "o0"."id"
              and "cm_link_0"."product_id" = "product"."id"
              and "cm_link_0"."deleted_at" is null
              and "product"."deleted_at" is null
              and "product"."handle" = 'premium'
          )
        `
      )
      expect(orderIds(results).sort()).toEqual(["order_a", "order_c"])
    })

    it("should filter orders by linked product id using the link table only", async () => {
      const config = {
        __internal: {
          crossModuleJoins: [buildProductJoinMetadata({ id: "prod_premium" })],
        },
        order: {
          "product.id": "DESC",
        },
      }

      const results = await findOrders({}, config)

      expectCapturedQueries(
        orm,
        sqlCapture,
        `
          select "o0".*
          from "order" as "o0"
          where exists (
            select 1
            from "public"."order_product_link" as "cm_link_0"
            where "cm_link_0"."order_id" = "o0"."id"
              and "cm_link_0"."deleted_at" is null
              and "cm_link_0"."product_id" = 'prod_premium'
          )
          order by (
            select "cm_order_link_0"."product_id"
            from "public"."order_product_link" as "cm_order_link_0"
            where "cm_order_link_0"."order_id" = "o0"."id"
              and "cm_order_link_0"."deleted_at" is null
            order by "cm_order_link_0"."product_id"
            limit 1
          ) desc
        `
      )
      expect(orderIds(results)).toEqual(["order_c", "order_a"])
    })

    it("should combine order filters with product filters", async () => {
      const results = await findOrders(
        { display_id: "1002" },
        {
          __internal: {
            crossModuleJoins: [
              buildProductJoinMetadata({ handle: "standard" }),
            ],
          },
        }
      )

      expectCapturedQueries(
        orm,
        sqlCapture,
        `
          select "o0".*
          from "order" as "o0"
          where "o0"."display_id" = '1002'
            and exists (
              select 1
              from "public"."order_product_link" as "cm_link_0"
              inner join "public"."product" as "product" on true
              where "cm_link_0"."order_id" = "o0"."id"
                and "cm_link_0"."product_id" = "product"."id"
                and "cm_link_0"."deleted_at" is null
                and "product"."deleted_at" is null
                and "product"."handle" = 'standard'
            )
        `
      )
      expect(results).toHaveLength(1)
      expect(results[0].id).toBe("order_b")
    })

    it("should sort orders by linked product handle", async () => {
      const config = {
        __internal: {
          crossModuleJoins: [buildProductJoinMetadata()],
        },
        order: {
          "product.handle": "ASC",
        },
      }

      const results = await findOrders({}, config)

      expectCapturedQueries(
        orm,
        sqlCapture,
        `
          select "o0".*
          from "order" as "o0"
          order by (
            select "product"."handle"
            from "public"."order_product_link" as "cm_order_link_0"
            inner join "public"."product" as "product" on true
            where "cm_order_link_0"."order_id" = "o0"."id"
              and "cm_order_link_0"."product_id" = "product"."id"
              and "cm_order_link_0"."deleted_at" is null
              and "product"."deleted_at" is null
            order by "product"."id"
            limit 1
          ) asc
        `
      )
      expect(orderIds(results)).toEqual(["order_a", "order_c", "order_b"])
    })

    it("should return a correct count via findAndCount", async () => {
      const config = {
        __internal: {
          crossModuleJoins: [buildProductJoinMetadata({ handle: "premium" })],
        },
      }

      const [results, count] = await findOrdersAndCount({}, config)

      expectCapturedQueries(orm, sqlCapture, [
        `
          select "o0".*
          from "order" as "o0"
          where exists (
            select 1
            from "public"."order_product_link" as "cm_link_0"
            inner join "public"."product" as "product" on true
            where "cm_link_0"."order_id" = "o0"."id"
              and "cm_link_0"."product_id" = "product"."id"
              and "cm_link_0"."deleted_at" is null
              and "product"."deleted_at" is null
              and "product"."handle" = 'premium'
          )
        `,
        `
          select count(*) as "count"
          from "order" as "o0"
          where exists (
            select 1
            from "public"."order_product_link" as "cm_link_0"
            inner join "public"."product" as "product" on true
            where "cm_link_0"."order_id" = "o0"."id"
              and "cm_link_0"."product_id" = "product"."id"
              and "cm_link_0"."deleted_at" is null
              and "product"."deleted_at" is null
              and "product"."handle" = 'premium'
          )
        `,
      ])
      expect(count).toBe(2)
      expect(orderIds(results).sort()).toEqual(["order_a", "order_c"])
    })

    it("should not multiply rows when multiple links match (exists semantics)", async () => {
      const knex = manager.getKnex()
      const now = new Date()

      await getProductRepository().create(
        [{ id: "prod_premium_2", handle: "premium" }],
        { manager }
      )
      await manager.flush()
      await knex("order_product_link").insert({
        id: "link_dup",
        order_id: "order_a",
        product_id: "prod_premium_2",
        created_at: now,
        updated_at: now,
        deleted_at: null,
      })

      const [results, count] = await findOrdersAndCount(
        {},
        {
          __internal: {
            crossModuleJoins: [buildProductJoinMetadata({ handle: "premium" })],
          },
        }
      )

      expectCapturedQueries(orm, sqlCapture, [
        `
          select "o0".*
          from "order" as "o0"
          where exists (
            select 1
            from "public"."order_product_link" as "cm_link_0"
            inner join "public"."product" as "product" on true
            where "cm_link_0"."order_id" = "o0"."id"
              and "cm_link_0"."product_id" = "product"."id"
              and "cm_link_0"."deleted_at" is null
              and "product"."deleted_at" is null
              and "product"."handle" = 'premium'
          )
        `,
        `
          select count(*) as "count"
          from "order" as "o0"
          where exists (
            select 1
            from "public"."order_product_link" as "cm_link_0"
            inner join "public"."product" as "product" on true
            where "cm_link_0"."order_id" = "o0"."id"
              and "cm_link_0"."product_id" = "product"."id"
              and "cm_link_0"."deleted_at" is null
              and "product"."deleted_at" is null
              and "product"."handle" = 'premium'
          )
        `,
      ])
      expect(count).toBe(2)
      expect(orderIds(results).sort()).toEqual(["order_a", "order_c"])
    })

    it("should honor pagination together with a cross-module filter", async () => {
      const [results, count] = await findOrdersAndCount(
        {},
        {
          __internal: {
            crossModuleJoins: [buildProductJoinMetadata({ handle: "premium" })],
          },
          order: { id: "ASC" },
          take: 1,
          skip: 1,
        }
      )

      expectCapturedQueries(orm, sqlCapture, [
        `
          select "o0".*
          from "order" as "o0"
          where exists (
            select 1
            from "public"."order_product_link" as "cm_link_0"
            inner join "public"."product" as "product" on true
            where "cm_link_0"."order_id" = "o0"."id"
              and "cm_link_0"."product_id" = "product"."id"
              and "cm_link_0"."deleted_at" is null
              and "product"."deleted_at" is null
              and "product"."handle" = 'premium'
          )
          order by "o0"."id" asc
          limit 1 offset 1
        `,
        `
          select count(*) as "count"
          from "order" as "o0"
          where exists (
            select 1
            from "public"."order_product_link" as "cm_link_0"
            inner join "public"."product" as "product" on true
            where "cm_link_0"."order_id" = "o0"."id"
              and "cm_link_0"."product_id" = "product"."id"
              and "cm_link_0"."deleted_at" is null
              and "product"."deleted_at" is null
              and "product"."handle" = 'premium'
          )
        `,
      ])
      expect(count).toBe(2)
      expect(orderIds(results)).toEqual(["order_c"])
    })

    it("should exclude rows whose link row is soft-deleted", async () => {
      const knex = manager.getKnex()
      await knex("order_product_link")
        .where({ id: "link_1" })
        .update({ deleted_at: new Date() })

      const results = await findOrders(
        {},
        {
          __internal: {
            crossModuleJoins: [buildProductJoinMetadata({ handle: "premium" })],
          },
        }
      )

      expectCapturedQueries(
        orm,
        sqlCapture,
        `
          select "o0".*
          from "order" as "o0"
          where exists (
            select 1
            from "public"."order_product_link" as "cm_link_0"
            inner join "public"."product" as "product" on true
            where "cm_link_0"."order_id" = "o0"."id"
              and "cm_link_0"."product_id" = "product"."id"
              and "cm_link_0"."deleted_at" is null
              and "product"."deleted_at" is null
              and "product"."handle" = 'premium'
          )
        `
      )
      expect(orderIds(results)).toEqual(["order_c"])
    })

    it("should exclude rows whose target row is soft-deleted", async () => {
      const knex = manager.getKnex()
      await knex("product")
        .where({ id: "prod_premium" })
        .update({ deleted_at: new Date() })

      const results = await findOrders(
        {},
        {
          __internal: {
            crossModuleJoins: [buildProductJoinMetadata({ handle: "premium" })],
          },
        }
      )

      expectCapturedQueries(
        orm,
        sqlCapture,
        `
          select "o0".*
          from "order" as "o0"
          where exists (
            select 1
            from "public"."order_product_link" as "cm_link_0"
            inner join "public"."product" as "product" on true
            where "cm_link_0"."order_id" = "o0"."id"
              and "cm_link_0"."product_id" = "product"."id"
              and "cm_link_0"."deleted_at" is null
              and "product"."deleted_at" is null
              and "product"."handle" = 'premium'
          )
        `
      )
      expect(results).toHaveLength(0)
    })

    it("should include soft-deleted links when the query uses withDeleted", async () => {
      const knex = manager.getKnex()
      await knex("order_product_link")
        .where({ id: "link_1" })
        .update({ deleted_at: new Date() })

      sqlCapture.clear()
      const withoutDeleted = await findOrders(
        {},
        {
          __internal: {
            crossModuleJoins: [buildProductJoinMetadata({ handle: "premium" })],
          },
        }
      )
      expect(orderIds(withoutDeleted)).toEqual(["order_c"])

      const withDeleted = await findOrders(
        {},
        {
          withDeleted: true,
          __internal: {
            crossModuleJoins: [buildProductJoinMetadata({ handle: "premium" })],
          },
        }
      )

      expectCapturedQueries(
        orm,
        sqlCapture,
        `
          select "o0".*
          from "order" as "o0"
          where exists (
            select 1
            from "public"."order_product_link" as "cm_link_0"
            inner join "public"."product" as "product" on true
            where "cm_link_0"."order_id" = "o0"."id"
              and "cm_link_0"."product_id" = "product"."id"
              and "product"."handle" = 'premium'
          )
        `
      )
      expect(orderIds(withDeleted).sort()).toEqual(["order_a", "order_c"])
    })

    it("should include soft-deleted targets when the query uses withDeleted", async () => {
      const knex = manager.getKnex()
      await knex("product")
        .where({ id: "prod_premium" })
        .update({ deleted_at: new Date() })

      const withDeleted = await findOrders(
        {},
        {
          withDeleted: true,
          __internal: {
            crossModuleJoins: [buildProductJoinMetadata({ handle: "premium" })],
          },
        }
      )

      expectCapturedQueries(
        orm,
        sqlCapture,
        `
          select "o0".*
          from "order" as "o0"
          where exists (
            select 1
            from "public"."order_product_link" as "cm_link_0"
            inner join "public"."product" as "product" on true
            where "cm_link_0"."order_id" = "o0"."id"
              and "cm_link_0"."product_id" = "product"."id"
              and "product"."handle" = 'premium'
          )
        `
      )
      expect(orderIds(withDeleted).sort()).toEqual(["order_a", "order_c"])
    })
  })

  describe("multi-target and nested cross-module filters", () => {
    it("should filter orders by multiple independent targets with AND semantics", async () => {
      const config = {
        __internal: {
          crossModuleJoins: [
            buildProductJoinMetadata({ handle: "premium" }),
            buildRegionJoinMetadata({ code: "eu" }),
          ],
        },
      }

      const results = await findOrders({}, config)

      expectCapturedQueries(
        orm,
        sqlCapture,
        `
          select "o0".*
          from "order" as "o0"
          where exists (
            select 1
            from "public"."order_product_link" as "cm_link_0"
            inner join "public"."product" as "product" on true
            where "cm_link_0"."order_id" = "o0"."id"
              and "cm_link_0"."product_id" = "product"."id"
              and "cm_link_0"."deleted_at" is null
              and "product"."deleted_at" is null
              and "product"."handle" = 'premium'
          )
            and exists (
              select 1
              from "public"."order_region_link" as "cm_link_1"
              inner join "public"."region" as "region" on true
              where "cm_link_1"."order_id" = "o0"."id"
                and "cm_link_1"."region_id" = "region"."id"
                and "cm_link_1"."deleted_at" is null
                and "region"."deleted_at" is null
                and "region"."code" = 'eu'
            )
        `
      )
      expect(orderIds(results)).toEqual(["order_a"])
    })

    it("should filter orders by a nested sales channel through a parent product join", async () => {
      const config = {
        __internal: {
          crossModuleJoins: [
            buildProductJoinMetadata(),
            buildSalesChannelJoinMetadata({ name: "web-store" }),
          ],
        },
      }

      const results = await findOrders({}, config)

      expectCapturedQueries(
        orm,
        sqlCapture,
        `
          select "o0".*
          from "order" as "o0"
          where exists (
            select 1
            from "public"."order_product_link" as "cm_link_0"
            inner join "public"."product" as "product" on true
            where "cm_link_0"."order_id" = "o0"."id"
              and "cm_link_0"."product_id" = "product"."id"
              and "cm_link_0"."deleted_at" is null
              and "product"."deleted_at" is null
              and exists (
                select 1
                from "public"."product_sales_channel" as "cm_link_1"
                inner join "public"."sales_channel" as "sales_channel" on true
                where "cm_link_1"."product_id" = "product"."id"
                  and "cm_link_1"."sales_channel_id" = "sales_channel"."id"
                  and "cm_link_1"."deleted_at" is null
                  and "sales_channel"."deleted_at" is null
                  and "sales_channel"."name" = 'web-store'
              )
          )
        `
      )
      expect(orderIds(results).sort()).toEqual(["order_a", "order_c"])
    })

    it("should combine parent and nested target filters in a single exists clause", async () => {
      const config = {
        __internal: {
          crossModuleJoins: [
            buildProductJoinMetadata({ handle: "premium" }),
            buildSalesChannelJoinMetadata({ name: "web-store" }),
          ],
        },
      }

      const results = await findOrders({}, config)

      expectCapturedQueries(
        orm,
        sqlCapture,
        `
          select "o0".*
          from "order" as "o0"
          where exists (
            select 1
            from "public"."order_product_link" as "cm_link_0"
            inner join "public"."product" as "product" on true
            where "cm_link_0"."order_id" = "o0"."id"
              and "cm_link_0"."product_id" = "product"."id"
              and "cm_link_0"."deleted_at" is null
              and "product"."deleted_at" is null
              and "product"."handle" = 'premium'
              and exists (
                select 1
                from "public"."product_sales_channel" as "cm_link_1"
                inner join "public"."sales_channel" as "sales_channel" on true
                where "cm_link_1"."product_id" = "product"."id"
                  and "cm_link_1"."sales_channel_id" = "sales_channel"."id"
                  and "cm_link_1"."deleted_at" is null
                  and "sales_channel"."deleted_at" is null
                  and "sales_channel"."name" = 'web-store'
              )
          )
        `
      )
      expect(orderIds(results).sort()).toEqual(["order_a", "order_c"])
    })

    it("should combine product, region, and nested sales channel filters", async () => {
      const config = {
        __internal: {
          crossModuleJoins: [
            buildProductJoinMetadata({ handle: "premium" }),
            buildRegionJoinMetadata({ code: "eu" }),
            buildSalesChannelJoinMetadata({ name: "web-store" }),
          ],
        },
      }

      const results = await findOrders({}, config)

      expectCapturedQueries(
        orm,
        sqlCapture,
        `
          select "o0".*
          from "order" as "o0"
          where exists (
            select 1
            from "public"."order_product_link" as "cm_link_0"
            inner join "public"."product" as "product" on true
            where "cm_link_0"."order_id" = "o0"."id"
              and "cm_link_0"."product_id" = "product"."id"
              and "cm_link_0"."deleted_at" is null
              and "product"."deleted_at" is null
              and "product"."handle" = 'premium'
              and exists (
                select 1
                from "public"."product_sales_channel" as "cm_link_1"
                inner join "public"."sales_channel" as "sales_channel" on true
                where "cm_link_1"."product_id" = "product"."id"
                  and "cm_link_1"."sales_channel_id" = "sales_channel"."id"
                  and "cm_link_1"."deleted_at" is null
                  and "sales_channel"."deleted_at" is null
                  and "sales_channel"."name" = 'web-store'
              )
          )
            and exists (
              select 1
              from "public"."order_region_link" as "cm_link_2"
              inner join "public"."region" as "region" on true
              where "cm_link_2"."order_id" = "o0"."id"
                and "cm_link_2"."region_id" = "region"."id"
                and "cm_link_2"."deleted_at" is null
                and "region"."deleted_at" is null
                and "region"."code" = 'eu'
            )
        `
      )
      expect(orderIds(results)).toEqual(["order_a"])
    })

    it("should exclude orders when a nested product sales channel link is soft-deleted", async () => {
      const knex = manager.getKnex()
      await knex("product_sales_channel")
        .where({ id: "psc_link_1" })
        .update({ deleted_at: new Date() })

      const results = await findOrders(
        {},
        {
          __internal: {
            crossModuleJoins: [
              buildProductJoinMetadata(),
              buildSalesChannelJoinMetadata({ name: "web-store" }),
            ],
          },
        }
      )

      expectCapturedQueries(
        orm,
        sqlCapture,
        `
          select "o0".*
          from "order" as "o0"
          where exists (
            select 1
            from "public"."order_product_link" as "cm_link_0"
            inner join "public"."product" as "product" on true
            where "cm_link_0"."order_id" = "o0"."id"
              and "cm_link_0"."product_id" = "product"."id"
              and "cm_link_0"."deleted_at" is null
              and "product"."deleted_at" is null
              and exists (
                select 1
                from "public"."product_sales_channel" as "cm_link_1"
                inner join "public"."sales_channel" as "sales_channel" on true
                where "cm_link_1"."product_id" = "product"."id"
                  and "cm_link_1"."sales_channel_id" = "sales_channel"."id"
                  and "cm_link_1"."deleted_at" is null
                  and "sales_channel"."deleted_at" is null
                  and "sales_channel"."name" = 'web-store'
              )
          )
        `
      )
      expect(results).toHaveLength(0)
    })
  })

  describe("readonly links", () => {
    it("should filter orders through an entity table used as a readonly link bridge", async () => {
      const config = {
        __internal: {
          crossModuleJoins: [
            buildReadonlyOrderLineItemProductJoinMetadata({
              handle: "premium",
            }),
          ],
        },
      }

      const results = await findOrders({}, config)

      expectCapturedQueries(
        orm,
        sqlCapture,
        `
          select "o0".*
          from "order" as "o0"
          where exists (
            select 1
            from "public"."order_line_item" as "cm_link_0"
            inner join "public"."product" as "product" on true
            where "cm_link_0"."order_id" = "o0"."id"
              and "cm_link_0"."product_id" = "product"."id"
              and "cm_link_0"."deleted_at" is null
              and "product"."deleted_at" is null
              and "product"."handle" = 'premium'
          )
        `
      )
      expect(orderIds(results).sort()).toEqual(["order_a", "order_c"])
    })

    it("should filter orders through readonly line items and nested linked sales channels", async () => {
      const config = {
        __internal: {
          crossModuleJoins: [
            buildReadonlyOrderLineItemProductJoinMetadata(),
            buildSalesChannelJoinMetadata({ name: "web-store" }),
          ],
        },
      }

      const results = await findOrders({}, config)

      expectCapturedQueries(
        orm,
        sqlCapture,
        `
          select "o0".*
          from "order" as "o0"
          where exists (
            select 1
            from "public"."order_line_item" as "cm_link_0"
            inner join "public"."product" as "product" on true
            where "cm_link_0"."order_id" = "o0"."id"
              and "cm_link_0"."product_id" = "product"."id"
              and "cm_link_0"."deleted_at" is null
              and "product"."deleted_at" is null
              and exists (
                select 1
                from "public"."product_sales_channel" as "cm_link_1"
                inner join "public"."sales_channel" as "sales_channel" on true
                where "cm_link_1"."product_id" = "product"."id"
                  and "cm_link_1"."sales_channel_id" = "sales_channel"."id"
                  and "cm_link_1"."deleted_at" is null
                  and "sales_channel"."deleted_at" is null
                  and "sales_channel"."name" = 'web-store'
              )
          )
        `
      )
      expect(orderIds(results).sort()).toEqual(["order_a", "order_c"])
    })

    it("should filter order line items by readonly product handle", async () => {
      const config = {
        __internal: {
          crossModuleJoins: [
            buildReadonlyProductJoinFromOrderLineItemMetadata({
              handle: "premium",
            }),
          ],
        },
        order: {
          "product.handle": "ASC",
        },
      }

      const results = await findOrderLineItems({}, config)

      expectCapturedQueries(
        orm,
        sqlCapture,
        `
          select "o0".*
          from "order_line_item" as "o0"
          where exists (
            select 1
            from "public"."product" as "product"
            where "product"."id" = "o0"."product_id"
              and "product"."deleted_at" is null
              and "product"."handle" = 'premium'
          )
          order by (
            select "product"."handle"
            from "public"."product" as "product"
            where "product"."id" = "o0"."product_id"
              and "product"."deleted_at" is null
            order by "product"."id"
            limit 1
          ) asc
        `
      )
      expect(orderLineItemIds(results)).toEqual(["li_1", "li_3"])
    })

    it("should filter products by order_line_item id", async () => {
      const config = {
        __internal: {
          crossModuleJoins: [
            buildReadonlyOrderLineItemJoinFromProductMetadata({
              id: ["li_1", "li_2"],
            }),
          ],
        },
        order: {
          "order_line_item.id": "DESC",
        },
      }

      const results = await findProducts({}, config)

      expectCapturedQueries(
        orm,
        sqlCapture,
        `
          select "p0".*
          from "product" as "p0"
          where exists (
            select 1
            from "public"."order_line_item" as "order_line_item"
            where "order_line_item"."product_id" = "p0"."id"
              and "order_line_item"."deleted_at" is null
              and "order_line_item"."id" = any(array['li_1', 'li_2'])
          )
          order by (
            select "order_line_item"."id"
            from "public"."order_line_item" as "order_line_item"
            where "order_line_item"."product_id" = "p0"."id"
              and "order_line_item"."deleted_at" is null
            order by "order_line_item"."id"
            limit 1
          ) desc
        `
      )
      expect(results).toHaveLength(2)
      expect(results[0].id).toBe("prod_standard")
      expect(results[0].handle).toBe("standard")
      expect(results[1].id).toBe("prod_premium")
      expect(results[1].handle).toBe("premium")
    })
  })

  describe("listing products filtered by order", () => {
    it("should filter products by linked order display_id", async () => {
      const config = {
        __internal: {
          crossModuleJoins: [buildOrderJoinMetadata({ display_id: "1001" })],
        },
      }

      const results = await findProducts({}, config)

      expectCapturedQueries(
        orm,
        sqlCapture,
        `
          select "p0".*
          from "product" as "p0"
          where exists (
            select 1
            from "public"."order_product_link" as "cm_link_0"
            inner join "public"."order" as "order" on true
            where "cm_link_0"."product_id" = "p0"."id"
              and "cm_link_0"."order_id" = "order"."id"
              and "cm_link_0"."deleted_at" is null
              and "order"."deleted_at" is null
              and "order"."display_id" = '1001'
          )
        `
      )
      expect(results).toHaveLength(1)
      expect(results[0].id).toBe("prod_premium")
      expect(results[0].handle).toBe("premium")
    })

    it("should combine product filters with order filters", async () => {
      const results = await findProducts(
        { handle: "premium" },
        {
          __internal: {
            crossModuleJoins: [buildOrderJoinMetadata({ display_id: "1003" })],
          },
        }
      )

      expectCapturedQueries(
        orm,
        sqlCapture,
        `
          select "p0".*
          from "product" as "p0"
          where "p0"."handle" = 'premium'
            and exists (
              select 1
              from "public"."order_product_link" as "cm_link_0"
              inner join "public"."order" as "order" on true
              where "cm_link_0"."product_id" = "p0"."id"
                and "cm_link_0"."order_id" = "order"."id"
                and "cm_link_0"."deleted_at" is null
                and "order"."deleted_at" is null
                and "order"."display_id" = '1003'
            )
        `
      )
      expect(results).toHaveLength(1)
      expect(results[0].id).toBe("prod_premium")
    })

    it("should return products linked to any of the given orders", async () => {
      const results = await findProducts(
        {},
        {
          __internal: {
            crossModuleJoins: [
              buildOrderJoinMetadata({
                display_id: { $in: ["1001", "1002"] },
              }),
            ],
          },
        }
      )

      expectCapturedQueries(
        orm,
        sqlCapture,
        `
          select "p0".*
          from "product" as "p0"
          where exists (
            select 1
            from "public"."order_product_link" as "cm_link_0"
            inner join "public"."order" as "order" on true
            where "cm_link_0"."product_id" = "p0"."id"
              and "cm_link_0"."order_id" = "order"."id"
              and "cm_link_0"."deleted_at" is null
              and "order"."deleted_at" is null
              and "order"."display_id" = any(array['1001', '1002'])
          )
        `
      )
      expect(results.map((row) => row.handle).sort()).toEqual([
        "premium",
        "standard",
      ])
    })

    it("should sort products by linked order display_id", async () => {
      const results = await findProducts(
        {},
        {
          __internal: {
            crossModuleJoins: [buildOrderJoinMetadata()],
          },
          order: {
            "order.display_id": "ASC",
          },
        }
      )

      expectCapturedQueries(
        orm,
        sqlCapture,
        `
          select "p0".*
          from "product" as "p0"
          order by (
            select "order"."display_id"
            from "public"."order_product_link" as "cm_order_link_0"
            inner join "public"."order" as "order" on true
            where "cm_order_link_0"."product_id" = "p0"."id"
              and "cm_order_link_0"."order_id" = "order"."id"
              and "cm_order_link_0"."deleted_at" is null
              and "order"."deleted_at" is null
            order by "order"."id"
            limit 1
          ) asc
        `
      )
      expect(productIds(results)).toEqual(["prod_premium", "prod_standard"])
    })
  })
})
