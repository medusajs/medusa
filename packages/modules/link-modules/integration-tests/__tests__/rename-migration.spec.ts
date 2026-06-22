import { MedusaModule } from "@medusajs/framework/modules-sdk"
import { ILinkModule, ModuleJoinerConfig } from "@medusajs/framework/types"
import { defineLink, isObject, Modules } from "@medusajs/framework/utils"
import { moduleIntegrationTestRunner } from "@medusajs/test-utils"
import { MigrationsExecutionPlanner } from "../../src"
import {
  Car,
  carJoinerConfig,
  CarModule,
  User,
  userJoinerConfig,
  UserModule,
} from "../__fixtures__/migrations"

jest.setTimeout(30000)

MedusaModule.setJoinerConfig(userJoinerConfig.serviceName, userJoinerConfig)
MedusaModule.setJoinerConfig(carJoinerConfig.serviceName, carJoinerConfig)

moduleIntegrationTestRunner<ILinkModule>({
  moduleName: Modules.LINK,
  moduleModels: [User, Car],
  testSuite: ({ dbConfig }) => {
    describe("MigrationsExecutionPlanner - table rename", () => {
      test("should rename a stale tracked table to its current computed name without throwing a PostgreSQL syntax error", async () => {
        defineLink(UserModule.linkable.user, CarModule.linkable.car)

        MedusaModule.getCustomLinks().forEach((linkDefinition: any) => {
          MedusaModule.setCustomLink(
            linkDefinition(MedusaModule.getAllJoinerConfigs())
          )
        })

        const joinerConfigs = MedusaModule.getCustomLinks().filter(
          (link): link is ModuleJoinerConfig => isObject(link)
        )

        const schema = (dbConfig as any).schema ?? "public"
        // Simulates a table name that was produced by a previous naming convention
        // before the 4-segment convention (e.g. "order_payout" instead of
        // "order_order_payout_payout"). link_module_migrations tracks this stale name.
        const oldTableName = "order_payout"

        // Seed a pre-upgrade DB state: physical table exists under the old name
        // and the tracking table records that old name.
        const seedPlanner = new MigrationsExecutionPlanner([], {
          database: dbConfig,
        })
        const seedOrm = await (seedPlanner as any).createORM()
        try {
          const conn = seedOrm.em.getDriver().getConnection()
          await conn.execute(`
            CREATE TABLE IF NOT EXISTS "${schema}"."link_module_migrations" (
              id SERIAL PRIMARY KEY,
              table_name VARCHAR(255) NOT NULL UNIQUE,
              link_descriptor JSONB NOT NULL DEFAULT '{}'::jsonb,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE "${schema}"."${oldTableName}" (
              "user_id" varchar(255) not null,
              "car_id" varchar(255) not null,
              "id" varchar(255) not null,
              "created_at" timestamptz not null default CURRENT_TIMESTAMP,
              "updated_at" timestamptz not null default CURRENT_TIMESTAMP,
              "deleted_at" timestamptz null,
              constraint "${oldTableName}_pkey" primary key ("user_id", "car_id")
            );

            INSERT INTO "${schema}"."link_module_migrations" (table_name, link_descriptor)
            VALUES (
              '${oldTableName}',
              '{"fromModule":"user","toModule":"car","fromModel":"user","toModel":"car"}'
            );
          `)
        } finally {
          await seedOrm.close(true)
        }

        // Before the fix, renameOldTable generated:
        //   ALTER TABLE "public"."order_payout" RENAME TO "public"."user_user_car_car"
        // which PostgreSQL rejects with ERROR 42601: syntax error at or near "."
        const planner = new MigrationsExecutionPlanner(joinerConfigs, {
          database: dbConfig,
        })
        const actionPlan = await planner.createPlan()

        expect(actionPlan).toHaveLength(1)
        expect(actionPlan[0].tableName).toBe("user_user_car_car")
        // "create" would mean the rename silently failed and the planner treated
        // the table as a brand-new untracked entity.
        expect(actionPlan[0].action).not.toBe("create")
      })
    })
  },
})
