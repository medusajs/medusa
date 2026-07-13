import { join } from "path"
import { readFile } from "fs/promises"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"
import { AdminUploadPreSignedUrlRequest } from "@medusajs/types"

jest.setTimeout(30000)

const PRODUCTS_FILE_PATH = join(__dirname, "./__fixtures__", "products.csv")
const getUploadReq = (file: File) => {
  return {
    body: {
      mime_type: file.type,
      originalname: file.name,
      size: file.size,
      access: "public",
    } satisfies AdminUploadPreSignedUrlRequest,
    meta: {
      headers: {
        ...adminHeaders.headers,
      },
    },
  }
}

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api, dbUtils }) => {
    beforeAll(async () => {
      await createAdminUser(dbConnection, adminHeaders, getContainer())

      await dbUtils.snapshot()
    })

    describe("POST /admin/uploads/presigned-urls", () => {
      it("should generate a signed URL to upload a file", async () => {
        const file = new File(
          [await readFile(PRODUCTS_FILE_PATH)],
          "products.csv",
          {
            type: "text/csv",
          }
        )
        const { body, meta } = getUploadReq(file)

        const response = await api.post(
          "/admin/uploads/presigned-urls",
          body,
          meta
        )

        expect(response.data).toEqual(
          expect.objectContaining({
            filename: expect.stringContaining(".csv"),
            extension: "csv",
            mime_type: "text/csv",
            size: file.size,
            url: "/admin/uploads",
          })
        )
        expect(response.status).toEqual(200)
      })

      it("should return error when mime type is invalid", async () => {
        const file = new File(
          [await readFile(PRODUCTS_FILE_PATH)],
          "products.csv"
        )
        const { body, meta } = getUploadReq(file)

        try {
          await api.post("/admin/uploads/presigned-urls", body, meta)
        } catch (error) {
          expect(error.response.data).toEqual({
            code: "invalid_data",
            type: "invalid_data",
            message: 'Invalid file type ""',
          })
          expect(error.response.status).toEqual(400)
        }
      })
    })
  },
})
