import { MedusaModule } from "@zjedene-medusa/framework/modules-sdk"
import { ILinkModule, ModuleJoinerConfig } from "@zjedene-medusa/framework/types"
import { defineLink, isObject, Modules } from "@zjedene-medusa/framework/utils"
import { moduleIntegrationTestRunner } from "@zjedene-medusa/test-utils"
import { MigrationsExecutionPlanner } from "../../src"
import {
  Car,
  carJoinerConfig,
  CarModule,
  CustomModuleImplementationContainingAReallyBigNameThatExceedsPosgresLimitToNameATableModule,
  longNameJoinerConfig,
  User,
  userJoinerConfig,
  UserModule,
} from "../__fixtures__/migrations"

jest.setTimeout(30000)

MedusaModule.setJoinerConfig(userJoinerConfig.serviceName, userJoinerConfig)
MedusaModule.setJoinerConfig(carJoinerConfig.serviceName, carJoinerConfig)
MedusaModule.setJoinerConfig(
  longNameJoinerConfig.serviceName,
  longNameJoinerConfig
)

moduleIntegrationTestRunner<ILinkModule>({
  moduleName: Modules.LINK,
  moduleModels: [User, Car],
  testSuite: ({ dbConfig }) => {
    describe("MigrationsExecutionPlanner", () => {
      test("should generate an execution plan", async () => {
        defineLink(UserModule.linkable.user, CarModule.linkable.car)
        defineLink(
          UserModule.linkable.user,
          CustomModuleImplementationContainingAReallyBigNameThatExceedsPosgresLimitToNameATableModule
            .linkable.veryLongTableNameOfCustomModule
        )

        MedusaModule.getCustomLinks().forEach((linkDefinition: any) => {
          MedusaModule.setCustomLink(
            linkDefinition(MedusaModule.getAllJoinerConfigs())
          )
        })

        /**
         * Expect a create plan
         */

        let joinerConfigs = MedusaModule.getCustomLinks().filter(
          (link): link is ModuleJoinerConfig => isObject(link)
        )

        let planner = new MigrationsExecutionPlanner(joinerConfigs, {
          database: dbConfig,
        })

        let actionPlan = await planner.createPlan()

        await planner.executePlan(actionPlan)

        expect(actionPlan).toHaveLength(2)

        expect(actionPlan[0]).toEqual({
          action: "create",
          linkDescriptor: {
            fromModule: "user",
            toModule: "car",
            fromModel: "user",
            toModel: "car",
          },
          tableName: "user_user_car_car",
          sql:
            "set names 'utf8';\n" +
            "\n" +
            'create table if not exists "user_user_car_car" ("user_id" varchar(255) not null, "car_id" varchar(255) not null, "id" varchar(255) not null, "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null default CURRENT_TIMESTAMP, "deleted_at" timestamptz null, constraint "user_user_car_car_pkey" primary key ("user_id", "car_id"));\n' +
            'create index if not exists "IDX_id_-92128f74" on "user_user_car_car" ("id");\n' +
            'CREATE INDEX IF NOT EXISTS "IDX_user_id_-92128f74" ON "user_user_car_car" ("user_id") WHERE deleted_at IS NULL;\n' +
            'CREATE INDEX IF NOT EXISTS "IDX_car_id_-92128f74" ON "user_user_car_car" ("car_id") WHERE deleted_at IS NULL;\n' +
            'create index if not exists "IDX_deleted_at_-92128f74" on "user_user_car_car" ("deleted_at");\n' +
            "\n",
        })

        expect(actionPlan[1]).toEqual({
          action: "create",
          linkDescriptor: {
            fromModule: "user",
            toModule:
              "CustomModuleImplementationContainingAReallyBigNameThatExceedsPosgresLimitToNameATable",
            fromModel: "user",
            toModel: "very_long_table_name_of_custom_module",
          },
          tableName: "user_user_cust_very_long_tabl_name_of_cust_modu1776e67de",
          sql:
            "set names 'utf8';\n" +
            "\n" +
            'create table if not exists "user_user_cust_very_long_tabl_name_of_cust_modu1776e67de" ("user_id" varchar(255) not null, "very_long_table_name_of_custom_module_id" varchar(255) not null, "id" varchar(255) not null, "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null default CURRENT_TIMESTAMP, "deleted_at" timestamptz null, constraint "user_user_cust_very_long_tabl_name_of_cust_modu1776e67de_pkey" primary key ("user_id", "very_long_table_name_of_custom_module_id"));\n' +
            'create index if not exists "IDX_id_1776e67de" on "user_user_cust_very_long_tabl_name_of_cust_modu1776e67de" ("id");\n' +
            'CREATE INDEX IF NOT EXISTS "IDX_user_id_1776e67de" ON "user_user_cust_very_long_tabl_name_of_cust_modu1776e67de" ("user_id") WHERE deleted_at IS NULL;\n' +
            'CREATE INDEX IF NOT EXISTS "IDX_very_long_table_name_of_custom_module_id_1776e67de" ON "user_user_cust_very_long_tabl_name_of_cust_modu1776e67de" ("very_long_table_name_of_custom_module_id") WHERE deleted_at IS NULL;\n' +
            'create index if not exists "IDX_deleted_at_1776e67de" on "user_user_cust_very_long_tabl_name_of_cust_modu1776e67de" ("deleted_at");\n' +
            "\n",
        })

        /**
         * Expect an update plan
         */
        // @ts-ignore
        MedusaModule.customLinks_.length = 0

        defineLink(UserModule.linkable.user, CarModule.linkable.car, {
          database: {
            extraColumns: {
              data: {
                type: "json",
              },
            },
          },
        })

        MedusaModule.getCustomLinks().forEach((linkDefinition: any) => {
          MedusaModule.setCustomLink(
            linkDefinition(MedusaModule.getAllJoinerConfigs())
          )
        })

        joinerConfigs = MedusaModule.getCustomLinks().filter(
          (link): link is ModuleJoinerConfig => isObject(link)
        )

        planner = new MigrationsExecutionPlanner(joinerConfigs, {
          database: dbConfig,
        })

        actionPlan = await planner.createPlan()
        await planner.executePlan(actionPlan)

        expect(actionPlan).toHaveLength(2)
        expect(actionPlan[0]).toEqual({
          action: "update",
          linkDescriptor: {
            fromModule: "user",
            toModule: "car",
            fromModel: "user",
            toModel: "car",
          },
          tableName: "user_user_car_car",
          sql: 'alter table if exists "user_user_car_car" add column if not exists "data" jsonb not null;',
        })

        /**
         * Expect a noop plan
         */

        actionPlan = await planner.createPlan()
        await planner.executePlan(actionPlan)

        expect(actionPlan).toHaveLength(1)
        expect(actionPlan[0]).toEqual({
          action: "noop",
          linkDescriptor: {
            fromModule: "user",
            toModule: "car",
            fromModel: "user",
            toModel: "car",
          },
          tableName: "user_user_car_car",
        })

        /**
         * Expect a delete plan
         */

        joinerConfigs = []

        planner = new MigrationsExecutionPlanner(joinerConfigs, {
          database: dbConfig,
        })

        actionPlan = await planner.createPlan()

        expect(actionPlan).toHaveLength(1)
        expect(actionPlan[0]).toEqual({
          action: "delete",
          tableName: "user_user_car_car",
          linkDescriptor: {
            toModel: "car",
            toModule: "car",
            fromModel: "user",
            fromModule: "user",
          },
        })
      })
    })
  },
})
