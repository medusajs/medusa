import { moduleIntegrationTestRunner } from "@zjedene-medusa/test-utils"
import { Modules } from "@zjedene-medusa/framework/utils"
import { resolve } from "path"
import { IAnalyticsModuleService } from "@zjedene-medusa/types"
import { AnalyticsProviderServiceFixtures } from "../__fixtures__/providers/default-provider"

jest.setTimeout(100000)

const moduleOptions = {
  providers: [
    {
      resolve: resolve(
        process.cwd() +
          "/integration-tests/__fixtures__/providers/default-provider"
      ),
      id: "default-provider",
    },
  ],
}

moduleIntegrationTestRunner<IAnalyticsModuleService>({
  moduleName: Modules.ANALYTICS,
  moduleOptions: moduleOptions,
  testSuite: ({ service }) => {
    describe("Analytics Module Service", () => {
      let spies: {
        track: jest.SpyInstance
        identify: jest.SpyInstance
      }

      beforeAll(async () => {
        spies = {
          track: jest.spyOn(
            AnalyticsProviderServiceFixtures.prototype,
            "track"
          ),
          identify: jest.spyOn(
            AnalyticsProviderServiceFixtures.prototype,
            "identify"
          ),
        }
      })

      afterEach(async () => {
        jest.clearAllMocks()
      })

      it("should call the provider's track method", async () => {
        await service.track({
          event: "test-event",
          actor_id: "test-user",
          properties: {
            test: "test",
          },
        })

        expect(spies.track).toHaveBeenCalledWith({
          event: "test-event",
          actor_id: "test-user",
          properties: {
            test: "test",
          },
        })
      })

      it("should call the provider's identify method to identify an actor", async () => {
        await service.identify({
          actor_id: "test-user",
          properties: {
            test: "test",
          },
        })

        expect(spies.identify).toHaveBeenCalledWith({
          actor_id: "test-user",
          properties: {
            test: "test",
          },
        })
      })

      it("should call the provider's identify method to identify a group", async () => {
        await service.identify({
          group: {
            type: "organization",
            id: "test-organization",
          },
          properties: {
            test: "test",
          },
        })

        expect(spies.identify).toHaveBeenCalledWith({
          group: {
            type: "organization",
            id: "test-organization",
          },
          properties: {
            test: "test",
          },
        })
      })
    })
  },
})
