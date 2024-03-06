import { ModuleRegistrationName, Modules } from "@medusajs/modules-sdk"
import {
  IApiKeyModuleService,
  ISalesChannelModuleService,
} from "@medusajs/types"
import { remoteQueryObjectFromString } from "@medusajs/utils"
import { medusaIntegrationTestRunner } from "medusa-test-utils"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("Publishable keys and sales channel link", () => {
      let appContainer
      let apiKeyModule: IApiKeyModuleService
      let scModuleService: ISalesChannelModuleService
      let remoteQuery
      let remoteLink

      beforeAll(async () => {
        appContainer = getContainer()
        apiKeyModule = appContainer.resolve(ModuleRegistrationName.API_KEY)
        scModuleService = appContainer.resolve(
          ModuleRegistrationName.SALES_CHANNEL
        )
        remoteQuery = appContainer.resolve("remoteQuery")
        remoteLink = appContainer.resolve("remoteLink")
      })

      it("should query api key and sales channels link with remote query", async () => {
        const salesChannel = await scModuleService.create({
          name: "Webshop",
        })

        const apiKeys = await apiKeyModule.create([
          {
            title: "Api key",
            type: "publishable",
            created_by: "test",
          },
          {
            title: "Api key 2",
            type: "publishable",
            created_by: "test",
          },
        ])

        await remoteLink.create([
          {
            [Modules.API_KEY]: {
              publishable_key_id: apiKeys[0].id,
            },
            [Modules.SALES_CHANNEL]: {
              sales_channel_id: salesChannel.id,
            },
          },
          {
            [Modules.API_KEY]: {
              publishable_key_id: apiKeys[1].id,
            },
            [Modules.SALES_CHANNEL]: {
              sales_channel_id: salesChannel.id,
            },
          },
        ])

        const queryObject = remoteQueryObjectFromString({
          entryPoint: "api_key",
          variables: {
            filters: { token: apiKeys[0].token },
          },
          fields: ["id", "sales_channels.id"],
        })
        const keyLinks = await remoteQuery(queryObject)

        expect(keyLinks).toHaveLength(1)
        expect(keyLinks).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: apiKeys[0].id,
              sales_channels: expect.arrayContaining([
                expect.objectContaining({ id: salesChannel.id }),
              ]),
            }),
          ])
        )
      })
    })
  },
})
