import { MigrationsExecutionPlanner } from "../../src"
import { MedusaModule, ModuleJoinerConfig } from "@medusajs/modules-sdk"
import {
  Car,
  carJoinerConfig,
  CarModule,
  User,
  userJoinerConfig,
  UserModule,
} from "../__fixtures__/migrations"
import { defineLink, isObject, Modules } from "@medusajs/utils"
import { moduleIntegrationTestRunner } from "medusa-test-utils"
import { ILinkModule } from "@medusajs/types"

jest.setTimeout(30000)

MedusaModule.setJoinerConfig(userJoinerConfig.serviceName, userJoinerConfig)
MedusaModule.setJoinerConfig(carJoinerConfig.serviceName, carJoinerConfig)

moduleIntegrationTestRunner<ILinkModule>({
  moduleName: Modules.LINK,
  moduleModels: [User, Car],
  testSuite: ({ dbConfig }) => {
    describe("MigrationsExecutionPlanner", () => {
      test("should generate an execution plan", async () => {
        defineLink(UserModule.linkable.user, CarModule.linkable.car)

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

        expect(actionPlan).toHaveLength(1)
        expect(actionPlan[0]).toEqual({
          action: "create",
          linkDescriptor: {
            fromModule: "User",
            toModule: "Car",
            fromModel: "user",
            toModel: "car",
          },
          tableName: "User_user_Car_car",
          sql: 'create table "User_user_Car_car" ("user_id" varchar(255) not null, "car_id" varchar(255) not null, "id" varchar(255) not null, "created_at" timestamptz(0) not null default CURRENT_TIMESTAMP, "updated_at" timestamptz(0) not null default CURRENT_TIMESTAMP, "deleted_at" timestamptz(0) null, constraint "User_user_Car_car_pkey" primary key ("user_id", "car_id"));\ncreate index "IDX_car_id_-8c9667b4" on "User_user_Car_car" ("car_id");\ncreate index "IDX_id_-8c9667b4" on "User_user_Car_car" ("id");\ncreate index "IDX_user_id_-8c9667b4" on "User_user_Car_car" ("user_id");\ncreate index "IDX_deleted_at_-8c9667b4" on "User_user_Car_car" ("deleted_at");\n\n',
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

        expect(actionPlan).toHaveLength(1)
        expect(actionPlan[0]).toEqual({
          action: "update",
          linkDescriptor: {
            fromModule: "User",
            toModule: "Car",
            fromModel: "user",
            toModel: "car",
          },
          tableName: "User_user_Car_car",
          sql: 'alter table "User_user_Car_car" add column "data" jsonb not null;\n\n',
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
          tableName: "User_user_Car_car",
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
          tableName: "User_user_Car_car",
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
