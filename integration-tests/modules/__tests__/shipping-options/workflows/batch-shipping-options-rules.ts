import {
  batchShippingOptionRulesWorkflow,
  createShippingOptionsWorkflow,
} from "@medusajs/core-flows"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  BatchWorkflowInput,
  CreateShippingOptionRuleDTO,
  FulfillmentSetDTO,
  FulfillmentWorkflow,
  IFulfillmentModuleService,
  IRegionModuleService,
  ServiceZoneDTO,
  ShippingProfileDTO,
  UpdateShippingOptionRuleDTO,
} from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  RuleOperator,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { medusaIntegrationTestRunner } from "medusa-test-utils"

jest.setTimeout(100000)

const env = { MEDUSA_FF_MEDUSA_V2: true }
const provider_id = "manual_test-provider"

async function createShippingOptionFixture({
  container,
  serviceZone,
  shippingProfile,
}) {
  const regionService = container.resolve(
    ModuleRegistrationName.REGION
  ) as IRegionModuleService

  const [region] = await regionService.createRegions([
    {
      name: "Test region",
      currency_code: "eur",
      countries: ["fr"],
    },
  ])

  const shippingOptionData: FulfillmentWorkflow.CreateShippingOptionsWorkflowInput =
    {
      name: "Test shipping option",
      price_type: "flat",
      service_zone_id: serviceZone.id,
      shipping_profile_id: shippingProfile.id,
      provider_id,
      type: {
        code: "manual-type",
        label: "Manual Type",
        description: "Manual Type Description",
      },
      prices: [
        {
          currency_code: "usd",
          amount: 10,
        },
        {
          region_id: region.id,
          amount: 100,
        },
      ],
      rules: [
        {
          attribute: "total",
          operator: RuleOperator.EQ,
          value: "100",
        },
        {
          attribute: "is_store",
          operator: RuleOperator.EQ,
          value: "true",
        },
      ],
    }

  const { result } = await createShippingOptionsWorkflow(container).run({
    input: [shippingOptionData],
  })

  const remoteQuery = container.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const remoteQueryObject = remoteQueryObjectFromString({
    entryPoint: "shipping_option",
    variables: {
      id: result[0].id,
    },
    fields: [
      "id",
      "name",
      "price_type",
      "service_zone_id",
      "shipping_profile_id",
      "provider_id",
      "data",
      "metadata",
      "type.*",
      "created_at",
      "updated_at",
      "deleted_at",
      "shipping_option_type_id",
      "prices.*",
      "rules.*",
    ],
  })

  const [createdShippingOption] = await remoteQuery(remoteQueryObject)

  return createdShippingOption
}

medusaIntegrationTestRunner({
  env,
  testSuite: ({ getContainer }) => {
    let service: IFulfillmentModuleService
    let container

    beforeAll(() => {
      container = getContainer()
      service = container.resolve(ModuleRegistrationName.FULFILLMENT)
    })

    describe("Fulfillment workflows", () => {
      let fulfillmentSet: FulfillmentSetDTO
      let serviceZone: ServiceZoneDTO
      let shippingProfile: ShippingProfileDTO

      beforeEach(async () => {
        shippingProfile = await service.createShippingProfiles({
          name: "test",
          type: "default",
        })

        fulfillmentSet = await service.createFulfillmentSets({
          name: "Test fulfillment set",
          type: "manual_test",
        })

        serviceZone = await service.createServiceZones({
          name: "Test service zone",
          fulfillment_set_id: fulfillmentSet.id,
          geo_zones: [
            {
              type: "country",
              country_code: "US",
            },
          ],
        })
      })

      it("should create, update and delete rules in batch", async () => {
        const shippingOption = await createShippingOptionFixture({
          container,
          serviceZone,
          shippingProfile,
        })

        expect(shippingOption.rules).toHaveLength(2)

        const ruleToUpdate = shippingOption.rules.find((rule) => {
          return rule.attribute === "is_store"
        })
        const ruleToDelete = shippingOption.rules.find((rule) => {
          return rule.attribute === "total"
        })

        const workflowInput: BatchWorkflowInput<
          CreateShippingOptionRuleDTO,
          UpdateShippingOptionRuleDTO
        > = {
          create: [
            {
              shipping_option_id: shippingOption.id,
              attribute: "new_attribute",
              operator: RuleOperator.EQ,
              value: "100",
            },
          ],
          update: [
            {
              ...ruleToUpdate,
              value: "false",
            },
          ],
          delete: [ruleToDelete.id],
        }

        await batchShippingOptionRulesWorkflow(container).run({
          input: workflowInput,
        })

        const remoteQuery = container.resolve(
          ContainerRegistrationKeys.REMOTE_QUERY
        )

        const remoteQueryObject = remoteQueryObjectFromString({
          entryPoint: "shipping_option",
          variables: {
            id: shippingOption.id,
          },
          fields: ["id", "rules.*"],
        })

        const [updatedShippingOption] = await remoteQuery(remoteQueryObject)

        const newAttrRule = updatedShippingOption.rules.find((rule) => {
          return rule.attribute === "new_attribute"
        })
        const updatedRule = updatedShippingOption.rules.find((rule) => {
          return rule.attribute === "is_store"
        })

        expect(updatedShippingOption.rules).toHaveLength(2)
        expect(newAttrRule).toEqual(
          expect.objectContaining({
            attribute: "new_attribute",
            operator: "eq",
            value: 100,
          })
        )
        expect(updatedRule).toEqual(
          expect.objectContaining({
            value: "false",
          })
        )
      })

      it("should revert the shipping options rules batch actions", async () => {
        const shippingOption = await createShippingOptionFixture({
          container,
          serviceZone,
          shippingProfile,
        })

        expect(shippingOption.rules).toHaveLength(2)

        const ruleToUpdate = shippingOption.rules.find((rule) => {
          return rule.attribute === "is_store"
        })
        const ruleToDelete = shippingOption.rules.find((rule) => {
          return rule.attribute === "total"
        })

        const workflowInput: BatchWorkflowInput<
          CreateShippingOptionRuleDTO,
          UpdateShippingOptionRuleDTO
        > = {
          create: [
            {
              shipping_option_id: shippingOption.id,
              attribute: "new_attribute",
              operator: RuleOperator.EQ,
              value: "100",
            },
          ],
          update: [
            {
              ...ruleToUpdate,
              value: "false",
            },
          ],
          delete: [ruleToDelete.id],
        }

        const workflow = batchShippingOptionRulesWorkflow(container)

        workflow.addAction(
          "throw",
          {
            invoke: async function failStep() {
              throw new Error(`Failed to update shipping option rules`)
            },
          },
          {
            noCompensation: true,
          }
        )

        const { errors } = await workflow.run({
          input: workflowInput,
          throwOnError: false,
        })

        expect(errors).toHaveLength(1)
        expect(errors[0].error.message).toEqual(
          `Failed to update shipping option rules`
        )

        const remoteQuery = container.resolve(
          ContainerRegistrationKeys.REMOTE_QUERY
        )

        const remoteQueryObject = remoteQueryObjectFromString({
          entryPoint: "shipping_option",
          variables: {
            id: shippingOption.id,
          },
          fields: ["id", "rules.*"],
        })

        const [updatedShippingOption] = await remoteQuery(remoteQueryObject)

        expect(updatedShippingOption.rules).toHaveLength(2)
        expect(updatedShippingOption.rules).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              attribute: "is_store",
              operator: "eq",
              value: "true",
            }),
            expect.objectContaining({
              attribute: "total",
              operator: "eq",
              value: 100,
            }),
          ])
        )
      })
    })
  },
})
