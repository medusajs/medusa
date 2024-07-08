import { resolve } from "path"
import { moduleIntegrationTestRunner } from "medusa-test-utils"
import { Entity, PrimaryKey } from "@mikro-orm/core"
import { IFileModuleService } from "@medusajs/types"
import { Module, Modules } from "@medusajs/utils"
import { FileModuleService } from "@services"

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
      id: "default-provider",
    },
  ],
}

moduleIntegrationTestRunner<IFileModuleService>({
  moduleName: Modules.FILE,
  moduleOptions: moduleOptions,
  moduleModels: [DummyEntity],
  testSuite: ({ service }) => {
    describe("File Module Service", () => {
      it(`should export the appropriate linkable configuration`, () => {
        const linkable = Module(Modules.FILE, {
          service: FileModuleService,
        }).linkable

        expect(Object.keys(linkable)).toEqual([])

        Object.keys(linkable).forEach((key) => {
          delete linkable[key].toJSON
        })

        expect(linkable).toEqual({})
      })

      it("creates and gets a file", async () => {
        const res = await service.createFiles({
          filename: "test.jpg",
          mimeType: "image/jpeg",
          content: Buffer.from("test"),
        })

        expect(res).toEqual({
          id: "test.jpg",
          url: "test.jpg",
        })

        // The fake provider returns the file content as the url
        const downloadUrl = await service.retrieveFile("test.jpg")
        expect(await new Response(downloadUrl.url).text()).toEqual("test")
      })
    })
  },
})
