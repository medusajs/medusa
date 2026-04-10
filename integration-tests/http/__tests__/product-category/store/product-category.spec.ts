import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { IStoreModuleService } from "@medusajs/types"
import {
    Modules
} from "@medusajs/utils"
import qs from "qs"
import {
    adminHeaders,
    createAdminUser,
    generatePublishableKey,
    generateStoreHeaders,
} from "../../../../helpers/create-admin-user"
import { createAuthenticatedCustomer } from "../../../../modules/helpers/create-authenticated-customer"

jest.setTimeout(30000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, api, getContainer }) => {
    let store
    let appContainer
    let productCategory1
    let productCategory2
    let storeHeaders
    let publishableKey
    let storeHeadersWithCustomer
    let customer

    const createCategory = async (data, productIds) => {
      const response = await api.post(
        "/admin/product-categories",
        data,
        adminHeaders
      )

      await api.post(
        `/admin/product-categories/${response.data.product_category.id}/products`,
        { add: productIds },
        adminHeaders
      )

      const response2 = await api.get(
        `/admin/product-categories/${response.data.product_category.id}?fields=*products`,
        adminHeaders
      )

      return response2.data.product_category
    }


    beforeEach(async () => {
      appContainer = getContainer()
      publishableKey = await generatePublishableKey(appContainer)
      storeHeaders = generateStoreHeaders({ publishableKey })
      await createAdminUser(dbConnection, adminHeaders, appContainer)
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

      const storeModule: IStoreModuleService = appContainer.resolve(
        Modules.STORE
      )
      // A default store is created when the app is started, so we want to delete that one and create one specifically for our tests.
      const defaultId = (await api.get("/admin/stores", adminHeaders)).data
        .stores?.[0]?.id
      if (defaultId) {
        await storeModule.deleteStores(defaultId)
      }

      store = await storeModule.createStores({
        name: "New store",
        supported_currencies: [
          { currency_code: "usd", is_default: true },
          { currency_code: "dkk" },
        ],
      })

    })

    describe("Get product-categories based on publishable key", () => {

      beforeEach(async () => {

        productCategory1 = await createCategory(
          { name: "test", is_internal: false, is_active: true, external_id: "ext-id-1" },
          []
        )


        productCategory2 = await createCategory(
          { name: "test2", is_internal: false, is_active: true, handle: 'test-2', external_id: "ext-id-2" },
          []
        )
      })

       it("returns the external_id on id lookups", async () => {
        const response = await api.get(
          `/store/product-categories/${productCategory1.id}`,
          storeHeaders
        )

        expect(response.status).toBe(200)
        expect(response.data.product_category).toEqual(
          expect.objectContaining({
            id: productCategory1.id,
            external_id: "ext-id-1",
          })
        )
      })

      it("it filters on the external_id field", async () => {



        const searchParam = qs.stringify({
            external_id: "ext-id-2",
        })

        const response = await api.get(
          `/store/product-categories?${searchParam}`,
          storeHeaders
        )

        expect(response.status).toBe(200)
        expect(response.data.product_categories).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: productCategory2.id,
              external_id: "ext-id-2",
            }),
          ])
        )
      })      
    })
  },
})
