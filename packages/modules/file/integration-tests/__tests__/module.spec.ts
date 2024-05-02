import { resolve } from "path"
import { Modules } from "@medusajs/utils"
import { SuiteOptions, moduleIntegrationTestRunner } from "medusa-test-utils"
import { Entity, PrimaryKey } from "@mikro-orm/core"

jest.setTimeout(100000)

// The test runner throws if a model is not passed, so we create a dummy entity
@Entity({ tableName: "dummy_file_entity" })
export default class DummyEntity {
  @PrimaryKey()
  id: string
}

const moduleOptions = {
  providers: [
    {
      resolve: resolve(
        process.cwd() +
          "/integration-tests/__fixtures__/providers/default-provider"
      ),
      options: {
        config: {
          "default-provider": {},
        },
      },
    },
  ],
}

moduleIntegrationTestRunner({
  moduleName: Modules.FILE,
  moduleOptions: moduleOptions,
  moduleModels: [DummyEntity],
  // TODO: Fix the type of service, it complains for some reason if we pass IFileModuleService
  testSuite: ({ service }: SuiteOptions<any>) => {
    describe("File Module Service", () => {
      it("creates and gets a file", async () => {
        const res = await service.create({
          filename: "test.jpg",
          mimeType: "image/jpeg",
          content: Buffer.from("test"),
        })

        expect(res).toEqual({
          id: "test.jpg",
          url: "test.jpg",
        })

        // The fake provider returns the file content as the url
        const downloadUrl = await service.retrieve("test.jpg")
        expect(await new Response(downloadUrl.url).text()).toEqual("test")
      })
    })
  },
})
