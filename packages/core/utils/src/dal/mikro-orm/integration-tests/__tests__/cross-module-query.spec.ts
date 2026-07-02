import { FindConfig } from "@medusajs/types"
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
import { dropDatabase } from "pg-god"
import { mikroOrmBaseRepositoryFactory } from "../../mikro-orm-repository"
import { buildQuery } from "../../../../modules-sdk/build-query"
import {
  createSqlCapture,
  expectCapturedQueries,
  getDatabaseURL,
  pgGodCredentials,
  SqlCapture,
} from "../__fixtures__/database"

jest.setTimeout(300000)

const dbName = "mikroorm-cross-module-customer-pricing-tier"

@Entity()
class CustomerEntity {
  @PrimaryKey()
  id: string

  @Property()
  email: string

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

@Entity()
class PricingTierEntity {
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

const CustomerEntityRepository = mikroOrmBaseRepositoryFactory(CustomerEntity)
const PricingTierEntityRepository =
  mikroOrmBaseRepositoryFactory(PricingTierEntity)

const customersSeed = [
  { id: "cust_a", email: "alice@example.com" },
  { id: "cust_b", email: "bob@example.com" },
  { id: "cust_c", email: "charlie@example.com" },
]

const pricingTiersSeed = [
  { id: "tier_standard", handle: "standard" },
  { id: "tier_premium", handle: "premium" },
]

const customerPricingTierLinksSeed = [
  { id: "link_1", customer_id: "cust_a", pricing_tier_id: "tier_premium" },
  { id: "link_2", customer_id: "cust_b", pricing_tier_id: "tier_standard" },
  { id: "link_3", customer_id: "cust_c", pricing_tier_id: "tier_premium" },
]

const regionsSeed = [
  { id: "reg_eu", code: "eu" },
  { id: "reg_us", code: "us" },
]

const customerRegionLinksSeed = [
  { id: "region_link_1", customer_id: "cust_a", region_id: "reg_eu" },
  { id: "region_link_2", customer_id: "cust_b", region_id: "reg_eu" },
  { id: "region_link_3", customer_id: "cust_c", region_id: "reg_us" },
]

const functionalitiesSeed = [
  { id: "func_billing", handle: "billing", enabled: true },
  { id: "func_analytics", handle: "analytics", enabled: true },
]

const tierFunctionalityLinksSeed = [
  {
    id: "func_link_1",
    pricing_tier_id: "tier_premium",
    functionality_id: "func_billing",
  },
  {
    id: "func_link_2",
    pricing_tier_id: "tier_standard",
    functionality_id: "func_analytics",
  },
]

async function createLinkTable(manager: SqlEntityManager) {
  const knex = manager.getKnex()

  await knex.schema.createTable("customer_pricing_tier_link", (table) => {
    table.text("id").primary()
    table.text("customer_id").notNullable()
    table.text("pricing_tier_id").notNullable()
    table.timestamps(true, true)
    table.timestamp("deleted_at", { useTz: true }).nullable()
  })

  await knex.schema.createTable("region_entity", (table) => {
    table.text("id").primary()
    table.text("code").notNullable()
    table.timestamps(true, true)
    table.timestamp("deleted_at", { useTz: true }).nullable()
  })

  await knex.schema.createTable("customer_region_link", (table) => {
    table.text("id").primary()
    table.text("customer_id").notNullable()
    table.text("region_id").notNullable()
    table.timestamps(true, true)
    table.timestamp("deleted_at", { useTz: true }).nullable()
  })

  await knex.schema.createTable("functionality_entity", (table) => {
    table.text("id").primary()
    table.text("handle").notNullable()
    table.boolean("enabled").notNullable()
    table.timestamps(true, true)
    table.timestamp("deleted_at", { useTz: true }).nullable()
  })

  await knex.schema.createTable("tier_functionality_link", (table) => {
    table.text("id").primary()
    table.text("pricing_tier_id").notNullable()
    table.text("functionality_id").notNullable()
    table.timestamps(true, true)
    table.timestamp("deleted_at", { useTz: true }).nullable()
  })
}

async function seedLinkTable(manager: SqlEntityManager) {
  const knex = manager.getKnex()
  const now = new Date()

  await knex("customer_pricing_tier_link").insert(
    customerPricingTierLinksSeed.map((link) => ({
      ...link,
      created_at: now,
      updated_at: now,
      deleted_at: null,
    }))
  )

  await knex("region_entity").insert(
    regionsSeed.map((region) => ({
      ...region,
      created_at: now,
      updated_at: now,
      deleted_at: null,
    }))
  )

  await knex("customer_region_link").insert(
    customerRegionLinksSeed.map((link) => ({
      ...link,
      created_at: now,
      updated_at: now,
      deleted_at: null,
    }))
  )

  await knex("functionality_entity").insert(
    functionalitiesSeed.map((functionality) => ({
      ...functionality,
      created_at: now,
      updated_at: now,
      deleted_at: null,
    }))
  )

  await knex("tier_functionality_link").insert(
    tierFunctionalityLinksSeed.map((link) => ({
      ...link,
      created_at: now,
      updated_at: now,
      deleted_at: null,
    }))
  )
}

function buildRegionJoinMetadata(filters?: Record<string, unknown>) {
  return {
    alias: "region",
    link: {
      table: "customer_region_link",
      sourceKey: "customer_id",
      targetKey: "region_id",
    },
    target: {
      table: "region_entity",
      filters,
    },
  }
}

function buildPricingTierJoinMetadata(filters?: Record<string, unknown>) {
  return {
    alias: "pricing_tier",
    link: {
      table: "customer_pricing_tier_link",
      sourceKey: "customer_id",
      targetKey: "pricing_tier_id",
    },
    target: {
      table: "pricing_tier_entity",
      filters,
    },
  }
}

function buildFunctionalityJoinMetadata(filters?: Record<string, unknown>) {
  return {
    alias: "functionality",
    parent: "pricing_tier",
    link: {
      table: "tier_functionality_link",
      sourceKey: "pricing_tier_id",
      targetKey: "functionality_id",
    },
    target: {
      table: "functionality_entity",
      filters,
    },
  }
}

function buildCustomerJoinMetadata(filters?: Record<string, unknown>) {
  return {
    alias: "customer",
    link: {
      table: "customer_pricing_tier_link",
      sourceKey: "pricing_tier_id",
      targetKey: "customer_id",
    },
    target: {
      table: "customer_entity",
      filters,
    },
  }
}

function customerIds(results: CustomerEntity[]): string[] {
  return results.map((row) => row.id)
}

function pricingTierIds(results: PricingTierEntity[]): string[] {
  return results.map((row) => row.id)
}

describe("cross-module query integration", () => {
  let orm!: MikroORM
  let manager!: SqlEntityManager
  let sqlCapture!: SqlCapture

  const getCustomerRepository = () => {
    return new CustomerEntityRepository({ manager: manager.fork() })
  }

  const getPricingTierRepository = () => {
    return new PricingTierEntityRepository({ manager: manager.fork() })
  }

  const findCustomers = async (
    filters: Record<string, unknown> = {},
    config: FindConfig<any> = {}
  ) => {
    sqlCapture.clear()
    return getCustomerRepository().find(
      buildQuery(filters, config) as any,
      { manager }
    ) as Promise<CustomerEntity[]>
  }

  const findCustomersAndCount = async (
    filters: Record<string, unknown> = {},
    config: FindConfig<any> = {}
  ) => {
    sqlCapture.clear()
    return getCustomerRepository().findAndCount(
      buildQuery(filters, config) as any,
      { manager }
    ) as Promise<[CustomerEntity[], number]>
  }

  const findPricingTiers = async (
    filters: Record<string, unknown> = {},
    config: FindConfig<any> = {}
  ) => {
    sqlCapture.clear()
    return getPricingTierRepository().find(
      buildQuery(filters, config) as any,
      { manager }
    ) as Promise<PricingTierEntity[]>
  }

  beforeEach(async () => {
    sqlCapture = createSqlCapture()

    await dropDatabase(
      { databaseName: dbName, errorIfNonExist: false },
      pgGodCredentials
    )

    orm = await MikroORM.init(
      defineConfig({
        entities: [CustomerEntity, PricingTierEntity],
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

    await getCustomerRepository().create(customersSeed, { manager })
    await getPricingTierRepository().create(pricingTiersSeed, { manager })
    await manager.flush()
  })

  afterEach(async () => {
    const knex = manager.getKnex()
    await knex.schema.dropTableIfExists("tier_functionality_link")
    await knex.schema.dropTableIfExists("functionality_entity")
    await knex.schema.dropTableIfExists("customer_region_link")
    await knex.schema.dropTableIfExists("region_entity")
    await knex.schema.dropTableIfExists("customer_pricing_tier_link")

    const generator = orm.getSchemaGenerator()
    await generator.dropSchema()
    await orm.close(true)
  })

  describe("listing customers filtered by pricing tier", () => {
    it("should filter customers by linked pricing tier handle", async () => {
      const config = {
        __internal: {
          crossModuleJoins: [
            buildPricingTierJoinMetadata({ handle: "premium" }),
          ],
        },
      }

      const results = await findCustomers({}, config)

      expectCapturedQueries(
        orm,
        sqlCapture,
        `
          select "c0".*
          from "customer_entity" as "c0"
          where exists (
            select 1
            from "public"."customer_pricing_tier_link" as "cm_link_0"
            inner join "public"."pricing_tier_entity" as "pricing_tier" on true
            where "cm_link_0"."customer_id" = "c0"."id"
              and "cm_link_0"."pricing_tier_id" = "pricing_tier"."id"
              and "cm_link_0"."deleted_at" is null
              and "pricing_tier"."deleted_at" is null
              and "pricing_tier"."handle" = 'premium'
          )
        `
      )
      expect(customerIds(results).sort()).toEqual(["cust_a", "cust_c"])
    })

    it("should combine customer filters with pricing tier filters", async () => {
      const results = await findCustomers(
        { email: "bob@example.com" },
        {
          __internal: {
            crossModuleJoins: [
              buildPricingTierJoinMetadata({ handle: "standard" }),
            ],
          },
        }
      )

      expectCapturedQueries(
        orm,
        sqlCapture,
        `
          select "c0".*
          from "customer_entity" as "c0"
          where "c0"."email" = 'bob@example.com'
            and exists (
              select 1
              from "public"."customer_pricing_tier_link" as "cm_link_0"
              inner join "public"."pricing_tier_entity" as "pricing_tier" on true
              where "cm_link_0"."customer_id" = "c0"."id"
                and "cm_link_0"."pricing_tier_id" = "pricing_tier"."id"
                and "cm_link_0"."deleted_at" is null
                and "pricing_tier"."deleted_at" is null
                and "pricing_tier"."handle" = 'standard'
            )
        `
      )
      expect(results).toHaveLength(1)
      expect(results[0].id).toBe("cust_b")
    })

    it("should sort customers by linked pricing tier handle", async () => {
      const config = {
        __internal: {
          crossModuleJoins: [buildPricingTierJoinMetadata()],
        },
        order: {
          "pricing_tier.handle": "ASC",
        },
      }

      const results = await findCustomers({}, config)

      expectCapturedQueries(
        orm,
        sqlCapture,
        `
          select "c0".*
          from "customer_entity" as "c0"
          order by (
            select "pricing_tier"."handle"
            from "public"."customer_pricing_tier_link" as "cm_order_link_0"
            inner join "public"."pricing_tier_entity" as "pricing_tier" on true
            where "cm_order_link_0"."customer_id" = "c0"."id"
              and "cm_order_link_0"."pricing_tier_id" = "pricing_tier"."id"
              and "cm_order_link_0"."deleted_at" is null
              and "pricing_tier"."deleted_at" is null
            order by "pricing_tier"."id"
            limit 1
          ) asc
        `
      )
      expect(customerIds(results)).toEqual(["cust_a", "cust_c", "cust_b"])
    })

    it("should return a correct count via findAndCount", async () => {
      const config = {
        __internal: {
          crossModuleJoins: [
            buildPricingTierJoinMetadata({ handle: "premium" }),
          ],
        },
      }

      const [results, count] = await findCustomersAndCount({}, config)

      expectCapturedQueries(orm, sqlCapture, [
        `
          select "c0".*
          from "customer_entity" as "c0"
          where exists (
            select 1
            from "public"."customer_pricing_tier_link" as "cm_link_0"
            inner join "public"."pricing_tier_entity" as "pricing_tier" on true
            where "cm_link_0"."customer_id" = "c0"."id"
              and "cm_link_0"."pricing_tier_id" = "pricing_tier"."id"
              and "cm_link_0"."deleted_at" is null
              and "pricing_tier"."deleted_at" is null
              and "pricing_tier"."handle" = 'premium'
          )
        `,
        `
          select count(*) as "count"
          from "customer_entity" as "c0"
          where exists (
            select 1
            from "public"."customer_pricing_tier_link" as "cm_link_0"
            inner join "public"."pricing_tier_entity" as "pricing_tier" on true
            where "cm_link_0"."customer_id" = "c0"."id"
              and "cm_link_0"."pricing_tier_id" = "pricing_tier"."id"
              and "cm_link_0"."deleted_at" is null
              and "pricing_tier"."deleted_at" is null
              and "pricing_tier"."handle" = 'premium'
          )
        `,
      ])
      expect(count).toBe(2)
      expect(customerIds(results).sort()).toEqual(["cust_a", "cust_c"])
    })

    it("should not multiply rows when multiple links match (exists semantics)", async () => {
      const knex = manager.getKnex()
      const now = new Date()

      await getPricingTierRepository().create(
        [{ id: "tier_premium_2", handle: "premium" }],
        { manager }
      )
      await manager.flush()
      await knex("customer_pricing_tier_link").insert({
        id: "link_dup",
        customer_id: "cust_a",
        pricing_tier_id: "tier_premium_2",
        created_at: now,
        updated_at: now,
        deleted_at: null,
      })

      const [results, count] = await findCustomersAndCount(
        {},
        {
          __internal: {
            crossModuleJoins: [
              buildPricingTierJoinMetadata({ handle: "premium" }),
            ],
          },
        }
      )

      expectCapturedQueries(orm, sqlCapture, [
        `
          select "c0".*
          from "customer_entity" as "c0"
          where exists (
            select 1
            from "public"."customer_pricing_tier_link" as "cm_link_0"
            inner join "public"."pricing_tier_entity" as "pricing_tier" on true
            where "cm_link_0"."customer_id" = "c0"."id"
              and "cm_link_0"."pricing_tier_id" = "pricing_tier"."id"
              and "cm_link_0"."deleted_at" is null
              and "pricing_tier"."deleted_at" is null
              and "pricing_tier"."handle" = 'premium'
          )
        `,
        `
          select count(*) as "count"
          from "customer_entity" as "c0"
          where exists (
            select 1
            from "public"."customer_pricing_tier_link" as "cm_link_0"
            inner join "public"."pricing_tier_entity" as "pricing_tier" on true
            where "cm_link_0"."customer_id" = "c0"."id"
              and "cm_link_0"."pricing_tier_id" = "pricing_tier"."id"
              and "cm_link_0"."deleted_at" is null
              and "pricing_tier"."deleted_at" is null
              and "pricing_tier"."handle" = 'premium'
          )
        `,
      ])
      expect(count).toBe(2)
      expect(customerIds(results).sort()).toEqual(["cust_a", "cust_c"])
    })

    it("should honor pagination together with a cross-module filter", async () => {
      const [results, count] = await findCustomersAndCount(
        {},
        {
          __internal: {
            crossModuleJoins: [
              buildPricingTierJoinMetadata({ handle: "premium" }),
            ],
          },
          order: { id: "ASC" },
          take: 1,
          skip: 1,
        }
      )

      expectCapturedQueries(orm, sqlCapture, [
        `
          select "c0".*
          from "customer_entity" as "c0"
          where exists (
            select 1
            from "public"."customer_pricing_tier_link" as "cm_link_0"
            inner join "public"."pricing_tier_entity" as "pricing_tier" on true
            where "cm_link_0"."customer_id" = "c0"."id"
              and "cm_link_0"."pricing_tier_id" = "pricing_tier"."id"
              and "cm_link_0"."deleted_at" is null
              and "pricing_tier"."deleted_at" is null
              and "pricing_tier"."handle" = 'premium'
          )
          order by "c0"."id" asc
          limit 1 offset 1
        `,
        `
          select count(*) as "count"
          from "customer_entity" as "c0"
          where exists (
            select 1
            from "public"."customer_pricing_tier_link" as "cm_link_0"
            inner join "public"."pricing_tier_entity" as "pricing_tier" on true
            where "cm_link_0"."customer_id" = "c0"."id"
              and "cm_link_0"."pricing_tier_id" = "pricing_tier"."id"
              and "cm_link_0"."deleted_at" is null
              and "pricing_tier"."deleted_at" is null
              and "pricing_tier"."handle" = 'premium'
          )
        `,
      ])
      expect(count).toBe(2)
      expect(customerIds(results)).toEqual(["cust_c"])
    })

    it("should exclude rows whose link row is soft-deleted", async () => {
      const knex = manager.getKnex()
      await knex("customer_pricing_tier_link")
        .where({ id: "link_1" })
        .update({ deleted_at: new Date() })

      const results = await findCustomers(
        {},
        {
          __internal: {
            crossModuleJoins: [
              buildPricingTierJoinMetadata({ handle: "premium" }),
            ],
          },
        }
      )

      expectCapturedQueries(
        orm,
        sqlCapture,
        `
          select "c0".*
          from "customer_entity" as "c0"
          where exists (
            select 1
            from "public"."customer_pricing_tier_link" as "cm_link_0"
            inner join "public"."pricing_tier_entity" as "pricing_tier" on true
            where "cm_link_0"."customer_id" = "c0"."id"
              and "cm_link_0"."pricing_tier_id" = "pricing_tier"."id"
              and "cm_link_0"."deleted_at" is null
              and "pricing_tier"."deleted_at" is null
              and "pricing_tier"."handle" = 'premium'
          )
        `
      )
      expect(customerIds(results)).toEqual(["cust_c"])
    })

    it("should exclude rows whose target row is soft-deleted", async () => {
      const knex = manager.getKnex()
      await knex("pricing_tier_entity")
        .where({ id: "tier_premium" })
        .update({ deleted_at: new Date() })

      const results = await findCustomers(
        {},
        {
          __internal: {
            crossModuleJoins: [
              buildPricingTierJoinMetadata({ handle: "premium" }),
            ],
          },
        }
      )

      expectCapturedQueries(
        orm,
        sqlCapture,
        `
          select "c0".*
          from "customer_entity" as "c0"
          where exists (
            select 1
            from "public"."customer_pricing_tier_link" as "cm_link_0"
            inner join "public"."pricing_tier_entity" as "pricing_tier" on true
            where "cm_link_0"."customer_id" = "c0"."id"
              and "cm_link_0"."pricing_tier_id" = "pricing_tier"."id"
              and "cm_link_0"."deleted_at" is null
              and "pricing_tier"."deleted_at" is null
              and "pricing_tier"."handle" = 'premium'
          )
        `
      )
      expect(results).toHaveLength(0)
    })

    it("should include soft-deleted links when the query uses withDeleted", async () => {
      const knex = manager.getKnex()
      await knex("customer_pricing_tier_link")
        .where({ id: "link_1" })
        .update({ deleted_at: new Date() })

      sqlCapture.clear()
      const withoutDeleted = await findCustomers(
        {},
        {
          __internal: {
            crossModuleJoins: [
              buildPricingTierJoinMetadata({ handle: "premium" }),
            ],
          },
        }
      )
      expect(customerIds(withoutDeleted)).toEqual(["cust_c"])

      const withDeleted = await findCustomers(
        {},
        {
          withDeleted: true,
          __internal: {
            crossModuleJoins: [
              buildPricingTierJoinMetadata({ handle: "premium" }),
            ],
          },
        }
      )

      expectCapturedQueries(
        orm,
        sqlCapture,
        `
          select "c0".*
          from "customer_entity" as "c0"
          where exists (
            select 1
            from "public"."customer_pricing_tier_link" as "cm_link_0"
            inner join "public"."pricing_tier_entity" as "pricing_tier" on true
            where "cm_link_0"."customer_id" = "c0"."id"
              and "cm_link_0"."pricing_tier_id" = "pricing_tier"."id"
              and "pricing_tier"."handle" = 'premium'
          )
        `
      )
      expect(customerIds(withDeleted).sort()).toEqual(["cust_a", "cust_c"])
    })

    it("should include soft-deleted targets when the query uses withDeleted", async () => {
      const knex = manager.getKnex()
      await knex("pricing_tier_entity")
        .where({ id: "tier_premium" })
        .update({ deleted_at: new Date() })

      const withDeleted = await findCustomers(
        {},
        {
          withDeleted: true,
          __internal: {
            crossModuleJoins: [
              buildPricingTierJoinMetadata({ handle: "premium" }),
            ],
          },
        }
      )

      expectCapturedQueries(
        orm,
        sqlCapture,
        `
          select "c0".*
          from "customer_entity" as "c0"
          where exists (
            select 1
            from "public"."customer_pricing_tier_link" as "cm_link_0"
            inner join "public"."pricing_tier_entity" as "pricing_tier" on true
            where "cm_link_0"."customer_id" = "c0"."id"
              and "cm_link_0"."pricing_tier_id" = "pricing_tier"."id"
              and "pricing_tier"."handle" = 'premium'
          )
        `
      )
      expect(customerIds(withDeleted).sort()).toEqual(["cust_a", "cust_c"])
    })
  })

  describe("multi-target and nested cross-module filters", () => {
    it("should filter customers by multiple independent targets with AND semantics", async () => {
      const config = {
        __internal: {
          crossModuleJoins: [
            buildPricingTierJoinMetadata({ handle: "premium" }),
            buildRegionJoinMetadata({ code: "eu" }),
          ],
        },
      }

      const results = await findCustomers({}, config)

      expectCapturedQueries(
        orm,
        sqlCapture,
        `
          select "c0".*
          from "customer_entity" as "c0"
          where exists (
            select 1
            from "public"."customer_pricing_tier_link" as "cm_link_0"
            inner join "public"."pricing_tier_entity" as "pricing_tier" on true
            where "cm_link_0"."customer_id" = "c0"."id"
              and "cm_link_0"."pricing_tier_id" = "pricing_tier"."id"
              and "cm_link_0"."deleted_at" is null
              and "pricing_tier"."deleted_at" is null
              and "pricing_tier"."handle" = 'premium'
          )
            and exists (
              select 1
              from "public"."customer_region_link" as "cm_link_1"
              inner join "public"."region_entity" as "region" on true
              where "cm_link_1"."customer_id" = "c0"."id"
                and "cm_link_1"."region_id" = "region"."id"
                and "cm_link_1"."deleted_at" is null
                and "region"."deleted_at" is null
                and "region"."code" = 'eu'
            )
        `
      )
      expect(customerIds(results)).toEqual(["cust_a"])
    })

    it("should filter customers by a nested target through a parent join", async () => {
      const config = {
        __internal: {
          crossModuleJoins: [
            buildPricingTierJoinMetadata(),
            buildFunctionalityJoinMetadata({ handle: "billing" }),
          ],
        },
      }

      const results = await findCustomers({}, config)

      expectCapturedQueries(
        orm,
        sqlCapture,
        `
          select "c0".*
          from "customer_entity" as "c0"
          where exists (
            select 1
            from "public"."customer_pricing_tier_link" as "cm_link_0"
            inner join "public"."pricing_tier_entity" as "pricing_tier" on true
            where "cm_link_0"."customer_id" = "c0"."id"
              and "cm_link_0"."pricing_tier_id" = "pricing_tier"."id"
              and "cm_link_0"."deleted_at" is null
              and "pricing_tier"."deleted_at" is null
              and exists (
                select 1
                from "public"."tier_functionality_link" as "cm_link_1"
                inner join "public"."functionality_entity" as "functionality" on true
                where "cm_link_1"."pricing_tier_id" = "pricing_tier"."id"
                  and "cm_link_1"."functionality_id" = "functionality"."id"
                  and "cm_link_1"."deleted_at" is null
                  and "functionality"."deleted_at" is null
                  and "functionality"."handle" = 'billing'
              )
          )
        `
      )
      expect(customerIds(results).sort()).toEqual(["cust_a", "cust_c"])
    })

    it("should combine parent and nested target filters in a single exists clause", async () => {
      const config = {
        __internal: {
          crossModuleJoins: [
            buildPricingTierJoinMetadata({ handle: "premium" }),
            buildFunctionalityJoinMetadata({ handle: "billing" }),
          ],
        },
      }

      const results = await findCustomers({}, config)

      expectCapturedQueries(
        orm,
        sqlCapture,
        `
          select "c0".*
          from "customer_entity" as "c0"
          where exists (
            select 1
            from "public"."customer_pricing_tier_link" as "cm_link_0"
            inner join "public"."pricing_tier_entity" as "pricing_tier" on true
            where "cm_link_0"."customer_id" = "c0"."id"
              and "cm_link_0"."pricing_tier_id" = "pricing_tier"."id"
              and "cm_link_0"."deleted_at" is null
              and "pricing_tier"."deleted_at" is null
              and "pricing_tier"."handle" = 'premium'
              and exists (
                select 1
                from "public"."tier_functionality_link" as "cm_link_1"
                inner join "public"."functionality_entity" as "functionality" on true
                where "cm_link_1"."pricing_tier_id" = "pricing_tier"."id"
                  and "cm_link_1"."functionality_id" = "functionality"."id"
                  and "cm_link_1"."deleted_at" is null
                  and "functionality"."deleted_at" is null
                  and "functionality"."handle" = 'billing'
              )
          )
        `
      )
      expect(customerIds(results).sort()).toEqual(["cust_a", "cust_c"])
    })

    it("should combine multiple root filters with a nested filter", async () => {
      const config = {
        __internal: {
          crossModuleJoins: [
            buildPricingTierJoinMetadata({ handle: "premium" }),
            buildRegionJoinMetadata({ code: "eu" }),
            buildFunctionalityJoinMetadata({ handle: "billing" }),
          ],
        },
      }

      const results = await findCustomers({}, config)

      expectCapturedQueries(
        orm,
        sqlCapture,
        `
          select "c0".*
          from "customer_entity" as "c0"
          where exists (
            select 1
            from "public"."customer_pricing_tier_link" as "cm_link_0"
            inner join "public"."pricing_tier_entity" as "pricing_tier" on true
            where "cm_link_0"."customer_id" = "c0"."id"
              and "cm_link_0"."pricing_tier_id" = "pricing_tier"."id"
              and "cm_link_0"."deleted_at" is null
              and "pricing_tier"."deleted_at" is null
              and "pricing_tier"."handle" = 'premium'
              and exists (
                select 1
                from "public"."tier_functionality_link" as "cm_link_1"
                inner join "public"."functionality_entity" as "functionality" on true
                where "cm_link_1"."pricing_tier_id" = "pricing_tier"."id"
                  and "cm_link_1"."functionality_id" = "functionality"."id"
                  and "cm_link_1"."deleted_at" is null
                  and "functionality"."deleted_at" is null
                  and "functionality"."handle" = 'billing'
              )
          )
            and exists (
              select 1
              from "public"."customer_region_link" as "cm_link_2"
              inner join "public"."region_entity" as "region" on true
              where "cm_link_2"."customer_id" = "c0"."id"
                and "cm_link_2"."region_id" = "region"."id"
                and "cm_link_2"."deleted_at" is null
                and "region"."deleted_at" is null
                and "region"."code" = 'eu'
            )
        `
      )
      expect(customerIds(results)).toEqual(["cust_a"])
    })

    it("should exclude customers when a nested functionality link is soft-deleted", async () => {
      const knex = manager.getKnex()
      await knex("tier_functionality_link")
        .where({ id: "func_link_1" })
        .update({ deleted_at: new Date() })

      const results = await findCustomers(
        {},
        {
          __internal: {
            crossModuleJoins: [
              buildPricingTierJoinMetadata(),
              buildFunctionalityJoinMetadata({ handle: "billing" }),
            ],
          },
        }
      )

      expectCapturedQueries(
        orm,
        sqlCapture,
        `
          select "c0".*
          from "customer_entity" as "c0"
          where exists (
            select 1
            from "public"."customer_pricing_tier_link" as "cm_link_0"
            inner join "public"."pricing_tier_entity" as "pricing_tier" on true
            where "cm_link_0"."customer_id" = "c0"."id"
              and "cm_link_0"."pricing_tier_id" = "pricing_tier"."id"
              and "cm_link_0"."deleted_at" is null
              and "pricing_tier"."deleted_at" is null
              and exists (
                select 1
                from "public"."tier_functionality_link" as "cm_link_1"
                inner join "public"."functionality_entity" as "functionality" on true
                where "cm_link_1"."pricing_tier_id" = "pricing_tier"."id"
                  and "cm_link_1"."functionality_id" = "functionality"."id"
                  and "cm_link_1"."deleted_at" is null
                  and "functionality"."deleted_at" is null
                  and "functionality"."handle" = 'billing'
              )
          )
        `
      )
      expect(results).toHaveLength(0)
    })
  })

  describe("listing pricing tiers filtered by customer", () => {
    it("should filter pricing tiers by linked customer email", async () => {
      const config = {
        __internal: {
          crossModuleJoins: [
            buildCustomerJoinMetadata({ email: "alice@example.com" }),
          ],
        },
      }

      const results = await findPricingTiers({}, config)

      expectCapturedQueries(
        orm,
        sqlCapture,
        `
          select "p0".*
          from "pricing_tier_entity" as "p0"
          where exists (
            select 1
            from "public"."customer_pricing_tier_link" as "cm_link_0"
            inner join "public"."customer_entity" as "customer" on true
            where "cm_link_0"."pricing_tier_id" = "p0"."id"
              and "cm_link_0"."customer_id" = "customer"."id"
              and "cm_link_0"."deleted_at" is null
              and "customer"."deleted_at" is null
              and "customer"."email" = 'alice@example.com'
          )
        `
      )
      expect(results).toHaveLength(1)
      expect(results[0].id).toBe("tier_premium")
      expect(results[0].handle).toBe("premium")
    })

    it("should combine pricing tier filters with customer filters", async () => {
      const results = await findPricingTiers(
        { handle: "premium" },
        {
          __internal: {
            crossModuleJoins: [
              buildCustomerJoinMetadata({ email: "charlie@example.com" }),
            ],
          },
        }
      )

      expectCapturedQueries(
        orm,
        sqlCapture,
        `
          select "p0".*
          from "pricing_tier_entity" as "p0"
          where "p0"."handle" = 'premium'
            and exists (
              select 1
              from "public"."customer_pricing_tier_link" as "cm_link_0"
              inner join "public"."customer_entity" as "customer" on true
              where "cm_link_0"."pricing_tier_id" = "p0"."id"
                and "cm_link_0"."customer_id" = "customer"."id"
                and "cm_link_0"."deleted_at" is null
                and "customer"."deleted_at" is null
                and "customer"."email" = 'charlie@example.com'
            )
        `
      )
      expect(results).toHaveLength(1)
      expect(results[0].id).toBe("tier_premium")
    })

    it("should return pricing tiers linked to any of the given customers", async () => {
      const results = await findPricingTiers(
        {},
        {
          __internal: {
            crossModuleJoins: [
              buildCustomerJoinMetadata({
                email: { $in: ["alice@example.com", "bob@example.com"] },
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
          from "pricing_tier_entity" as "p0"
          where exists (
            select 1
            from "public"."customer_pricing_tier_link" as "cm_link_0"
            inner join "public"."customer_entity" as "customer" on true
            where "cm_link_0"."pricing_tier_id" = "p0"."id"
              and "cm_link_0"."customer_id" = "customer"."id"
              and "cm_link_0"."deleted_at" is null
              and "customer"."deleted_at" is null
              and "customer"."email" in ('alice@example.com', 'bob@example.com')
          )
        `
      )
      expect(results.map((row) => row.handle).sort()).toEqual([
        "premium",
        "standard",
      ])
    })

    it("should sort pricing tiers by linked customer email", async () => {
      const results = await findPricingTiers(
        {},
        {
          __internal: {
            crossModuleJoins: [buildCustomerJoinMetadata()],
          },
          order: {
            "customer.email": "ASC",
          },
        }
      )

      expectCapturedQueries(
        orm,
        sqlCapture,
        `
          select "p0".*
          from "pricing_tier_entity" as "p0"
          order by (
            select "customer"."email"
            from "public"."customer_pricing_tier_link" as "cm_order_link_0"
            inner join "public"."customer_entity" as "customer" on true
            where "cm_order_link_0"."pricing_tier_id" = "p0"."id"
              and "cm_order_link_0"."customer_id" = "customer"."id"
              and "cm_order_link_0"."deleted_at" is null
              and "customer"."deleted_at" is null
            order by "customer"."id"
            limit 1
          ) asc
        `
      )
      expect(pricingTierIds(results)).toEqual(["tier_premium", "tier_standard"])
    })
  })
})
