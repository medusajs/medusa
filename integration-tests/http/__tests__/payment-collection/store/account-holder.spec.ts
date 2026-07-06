import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  adminHeaders,
  createAdminUser,
  generatePublishableKey,
  generateStoreHeaders,
} from "../../../../helpers/create-admin-user"
import { getProductFixture } from "../../../../helpers/fixtures"
import { createAuthenticatedCustomer } from "../../../../modules/helpers/create-authenticated-customer"

jest.setTimeout(60000)

// pp_account-holder_test.createAccountHolder returns { id: customer.id }, so
// repeated inits for the same customer resolve to the same
// (provider_id, external_id) - mirroring a provider whose create is idempotent
// (e.g. Stripe). Its initiatePayment fails when the session data carries
// `fail: true`, letting us drive a workflow rollback after the account holder
// has been created and linked.
const providerId = "pp_account-holder_test"

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    let storeHeadersWithCustomer
    let customer
    let region
    let salesChannel
    let product

    const fetchAccountHolders = async () => {
      const query = getContainer().resolve(ContainerRegistrationKeys.QUERY)
      const {
        data: [result],
      } = await query.graph({
        entity: "customer",
        fields: [
          "id",
          "account_holders.id",
          "account_holders.provider_id",
          "account_holders.external_id",
        ],
        filters: { id: customer.id },
      })

      return result?.account_holders ?? []
    }

    const createPaymentCollection = async () => {
      const cart = (
        await api.post(
          "/store/carts",
          {
            region_id: region.id,
            items: [{ variant_id: product.variants[0].id, quantity: 1 }],
            sales_channel_id: salesChannel.id,
          },
          storeHeadersWithCustomer
        )
      ).data.cart

      return (
        await api.post(
          "/store/payment-collections",
          { cart_id: cart.id },
          storeHeadersWithCustomer
        )
      ).data.payment_collection
    }

    beforeEach(async () => {
      const container = getContainer()
      const publishableKey = await generatePublishableKey(container)
      const storeHeaders = generateStoreHeaders({ publishableKey })
      await createAdminUser(dbConnection, adminHeaders, container)

      const result = await createAuthenticatedCustomer(api, storeHeaders, {
        first_name: "tony",
        last_name: "stark",
        email: "tony@stark-industries.com",
      })
      customer = result.customer

      storeHeadersWithCustomer = {
        headers: {
          ...storeHeaders.headers,
          authorization: `Bearer ${result.jwt}`,
        },
      }

      region = (
        await api.post(
          "/admin/regions",
          { name: "United States", currency_code: "usd", countries: ["us"] },
          adminHeaders
        )
      ).data.region

      salesChannel = (
        await api.post("/admin/sales-channels", { name: "Web" }, adminHeaders)
      ).data.sales_channel

      const shippingProfile = (
        await api.post(
          `/admin/shipping-profiles`,
          { name: "Test", type: "default" },
          adminHeaders
        )
      ).data.shipping_profile

      product = (
        await api.post(
          "/admin/products",
          getProductFixture({
            title: "test",
            status: "published",
            shipping_profile_id: shippingProfile.id,
            variants: [
              {
                title: "Test variant",
                manage_inventory: false,
                prices: [
                  {
                    amount: 150,
                    currency_code: "usd",
                    rules: { region_id: region.id },
                  },
                ],
              },
            ],
          }),
          adminHeaders
        )
      ).data.product
    })

    describe("POST /store/payment-collections/:id/payment-sessions (account holder)", () => {
      it("reuses the account holder after a failed init instead of colliding on the unique index", async () => {
        const paymentCollection = await createPaymentCollection()

        // First init fails inside the workflow, after createPaymentAccountHolderStep
        // has created the holder and createRemoteLinkStep has linked it to the
        // customer. The provider rejects the session (data.fail), so the workflow
        // rolls back.
        await expect(
          api.post(
            `/store/payment-collections/${paymentCollection.id}/payment-sessions`,
            { provider_id: providerId, data: { fail: true } },
            storeHeadersWithCustomer
          )
        ).rejects.toThrow()

        // The customer link to the holder must survive the rollback
        // (createRemoteLinkStep runs with noCompensation). Without it the holder
        // is orphaned - present in the DB but unreachable through
        // customer.account_holders - so the next init re-creates the same
        // provider customer and collides on the unique (provider_id, external_id).
        const holdersAfterFailure = await fetchAccountHolders()
        expect(holdersAfterFailure).toHaveLength(1)
        expect(holdersAfterFailure[0]).toEqual(
          expect.objectContaining({
            provider_id: providerId,
            external_id: customer.id,
          })
        )

        // Second init succeeds: the linked holder short-circuits the provider
        // create, so there is no insert to collide and no "already exists" error.
        const {
          data: { payment_collection },
        } = await api.post(
          `/store/payment-collections/${paymentCollection.id}/payment-sessions`,
          { provider_id: providerId },
          storeHeadersWithCustomer
        )

        expect(payment_collection.payment_sessions).toEqual([
          expect.objectContaining({
            provider_id: providerId,
            status: "pending",
            amount: 150,
          }),
        ])

        // Still exactly one holder - the orphan was reused, not duplicated.
        const holdersAfterSuccess = await fetchAccountHolders()
        expect(holdersAfterSuccess).toHaveLength(1)
        expect(holdersAfterSuccess[0].id).toBe(holdersAfterFailure[0].id)
      })
    })
  },
})
