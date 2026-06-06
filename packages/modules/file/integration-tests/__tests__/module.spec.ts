import { IFileModuleService } from "@zjedene-medusa/framework/types"
import { Module, Modules } from "@zjedene-medusa/framework/utils"
import { moduleIntegrationTestRunner } from "@zjedene-medusa/test-utils"
import { FileModuleService } from "@services"
import { resolve } from "path"

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

moduleIntegrationTestRunner<IFileModuleService>({
  moduleName: Modules.FILE,
  moduleOptions: moduleOptions,
  testSuite: ({ service }) => {
    describe("File Module Service", () => {
      it(`should export the appropriate linkable configuration`, () => {
        const linkable = Module(Modules.FILE, {
          service: FileModuleService,
        }).linkable

        expect(Object.keys(linkable)).toEqual(["file"])

        Object.keys(linkable).forEach((key) => {
          delete linkable[key].toJSON
        })

        expect(linkable).toEqual({
          file: {
            id: {
              entity: "File",
              field: "file",
              linkable: "file_id",
              primaryKey: "id",
              serviceName: "file",
            },
          },
        })
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

      it("generates a presigned upload URL", async () => {
        const res = await service.getUploadFileUrls({
          filename: "test.jpg",
          mimeType: "image/jpeg",
        })

        expect(res).toEqual({
          url: "presigned-url/test.jpg",
          key: "test.jpg",
        })
      })

      it("fails to get a presigned upload URL if a filename isn't provided", async () => {
        const err = await service
          .getUploadFileUrls({
            filename: "",
            mimeType: "image/jpeg",
          })
          .catch((err) => err)

        expect(err.message).toEqual(
          "File name is required to get a presigned upload URL"
        )
      })
    })
  },
})
