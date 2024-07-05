import { medusaIntegrationTestRunner } from "medusa-test-utils"
import { createRegionsWorkflow } from "@medusajs/core-flows"
import { MedusaContainer, RegionDTO } from "@medusajs/types"
import { createAdminUser } from "../../../../helpers/create-admin-user"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"

jest.setTimeout(200000)

const env = { MEDUSA_FF_MEDUSA_V2: true }
const adminHeaders = {
  headers: { "x-medusa-access-token": "test_token" },
}

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api }) => {
    let container: MedusaContainer
    let region: RegionDTO

    beforeAll(() => {
      container = getContainer()
    })

    beforeEach(async () => {
      await createAdminUser(dbConnection, adminHeaders, container)
    })

    describe("create region workflow", () => {
      it("should create a region", async () => {
        const paymentProviderId = "pp_system_default"

        const data = {
          name: "Test Region",
          currency_code: "usd",
          countries: ["us", "ca"],
          metadata: { foo: "bar" },
          payment_providers: [paymentProviderId],
        }

        let {
          result: [createRegion],
        } = await createRegionsWorkflow(container).run({
          input: {
            regions: [data],
          },
        })

        const remoteQuery = container.resolve(
          ContainerRegistrationKeys.REMOTE_QUERY
        )

        ;[createRegion] = await remoteQuery(
          remoteQueryObjectFromString({
            entryPoint: "region",
            variables: {
              filters: {
                id: createRegion.id,
              },
            },
            fields: [
              "id",
              "name",
              "currency_code",
              "metadata",
              "countries.*",
              "payment_providers.*",
            ],
          })
        )

        expect(createRegion).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            name: data.name,
            currency_code: data.currency_code,
            countries: expect.arrayContaining(
              data.countries.map((iso_2) => expect.objectContaining({ iso_2 }))
            ),
            metadata: data.metadata,
            payment_providers: [
              expect.objectContaining({
                id: paymentProviderId,
              }),
            ],
          })
        )
      })

      it("should revert the created region and payment providers", async () => {
        const paymentProviderId = "pp_system_default"

        const data = {
          name: "Test Region",
          currency_code: "usd",
          countries: ["us", "ca"],
          metadata: { foo: "bar" },
          payment_providers: [paymentProviderId],
        }

        const workflow = createRegionsWorkflow(container)
        workflow.addAction(
          "throw",
          {
            invoke: async function failStep() {
              throw new Error(`Failed to create region`)
            },
          },
          {
            noCompensation: true,
          }
        )

        const { errors } = await workflow.run({
          input: {
            regions: [data],
          },
          throwOnError: false,
        })

        expect(errors).toHaveLength(1)
        expect(errors[0].error.message).toEqual(`Failed to create region`)

        const remoteQuery = container.resolve(
          ContainerRegistrationKeys.REMOTE_QUERY
        )

        const createRegions = await remoteQuery(
          remoteQueryObjectFromString({
            entryPoint: "region",
            fields: [
              "id",
              "name",
              "currency_code",
              "metadata",
              "countries.*",
              "payment_providers.*",
            ],
          })
        )

        expect(createRegions).toHaveLength(0)
      })
    })
  },
})
