import { medusaIntegrationTestRunner } from "medusa-test-utils"
import { updateRegionsWorkflow } from "@medusajs/core-flows"
import {ContainerLike, MedusaContainer, RegionDTO} from "@medusajs/types"
import { createAdminUser } from "../../../../helpers/create-admin-user"

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

      region = (
        await api.post(
          `/admin/regions`,
          {
            name: "Test Region",
            currency_code: "usd",
            countries: ["us", "ca"],
            metadata: { foo: "bar" },
          },
          adminHeaders
        )
      ).data.region
    })

    describe("update region workflow", () => {
      it("should update a region", async () => {
        const updateData = {
          name: "United States update",
        }

        const {
          result: [updatedRegion],
        } = await updateRegionsWorkflow(container).run({
          input: {
            selector: { id: region.id },
            update: updateData,
          },
        })

        expect(updatedRegion).toEqual(
          expect.objectContaining({
            id: region.id,
            name: updateData.name,
          })
        )
      })

      it("should revert region update and payment providers update when it fails", async () => {
        const paymentProviderId = "pp_system_default"
        const paymentProvider2Id = "pp_system_default_2"
        const updateData = {
          name: "United States update",
          payment_providers: [paymentProviderId, paymentProvider2Id],
        }

        const workflow = updateRegionsWorkflow(container)
        workflow.addAction(
          "throw",
          {
            invoke: async function failStep() {
              throw new Error(`Failed to update region`)
            },
          },
          {
            noCompensation: true,
          }
        )

        const { errors } = await workflow.run({
          input: {
            selector: { id: region.id },
            update: updateData,
          },
          throwOnError: false,
        })

        expect(errors).toHaveLength(1)
        expect(errors[0].error.message).toEqual(`Failed to update region`)

        const updatedRegion = (
          await api.get(
            `/admin/regions/${region.id}?fields=*payment_providers`,
            adminHeaders
          )
        ).data.region

        expect(updatedRegion).toEqual(
          expect.objectContaining({
            id: region.id,
            name: region.name,
            payment_providers: [],
          })
        )
      })
    })
  },
})
