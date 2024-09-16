import { MedusaModule } from "@medusajs/modules-sdk"
import { ILinkModule, ModuleJoinerConfig } from "@medusajs/types"
import { Modules, defineLink, isObject } from "@medusajs/utils"
import { moduleIntegrationTestRunner } from "medusa-test-utils"
import { MigrationsExecutionPlanner } from "../../src"
import {
  Car,
  CarModule,
  CustomModuleImplementationContainingAReallyBigNameThatExceedsPosgresLimitToNameATableModule,
  User,
  UserModule,
  carJoinerConfig,
  longNameJoinerConfig,
  userJoinerConfig,
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
            fromModule: "User",
            toModule: "Car",
            fromModel: "user",
            toModel: "car",
          },
          tableName: "user_user_car_car",
          sql: 'create table "user_user_car_car" ("user_id" varchar(255) not null, "car_id" varchar(255) not null, "id" varchar(255) not null, "created_at" timestamptz(0) not null default CURRENT_TIMESTAMP, "updated_at" timestamptz(0) not null default CURRENT_TIMESTAMP, "deleted_at" timestamptz(0) null, constraint "user_user_car_car_pkey" primary key ("user_id", "car_id"));\ncreate index "IDX_car_id_-8c9667b4" on "user_user_car_car" ("car_id");\ncreate index "IDX_id_-8c9667b4" on "user_user_car_car" ("id");\ncreate index "IDX_user_id_-8c9667b4" on "user_user_car_car" ("user_id");\ncreate index "IDX_deleted_at_-8c9667b4" on "user_user_car_car" ("deleted_at");\n\n',
        })

        /**
         * Expect an update plan
         */
        ;(MedusaModule as any).customLinks_.length = 0

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
            fromModule: "User",
            toModule: "Car",
            fromModel: "user",
            toModel: "car",
          },
          tableName: "user_user_car_car",
          sql: 'alter table "user_user_car_car" add column "data" jsonb not null;\n\n',
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
            fromModule: "User",
            toModule: "Car",
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
            toModule: "Car",
            fromModel: "user",
            fromModule: "User",
          },
        })
      })
    })
  },
})
