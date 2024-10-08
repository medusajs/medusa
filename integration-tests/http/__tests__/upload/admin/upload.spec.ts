import { medusaIntegrationTestRunner } from "medusa-test-utils"
import FormData from "form-data"
import fs from "fs/promises"
import os from "os"
import path from "path"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(30000)

const getUploadReq = (files: { name: string; content: string }[]) => {
  const form = new FormData()
  files.forEach((file) => {
    form.append("files", Buffer.from(file.content), file.name)
  })

  return {
    form,
    meta: {
      headers: {
        ...adminHeaders.headers,
        ...form.getHeaders(),
      },
    },
  }
}

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    afterAll(async () => {
      await fs.rm(path.join(os.tmpdir(), "uploads"), { recursive: true })
    })

    beforeEach(async () => {
      await createAdminUser(dbConnection, adminHeaders, getContainer())
    })

    describe("POST /admin/uploads", () => {
      it("uploads a single file successfully", async () => {
        const { form, meta } = getUploadReq([
          { name: "first.jpeg", content: "first content" },
          { name: "second.jpeg", content: "second content" },
        ])
        const response = await api.post("/admin/uploads", form, meta)

        expect(response.status).toEqual(200)
        expect(response.data.files).toHaveLength(2)
        expect(response.data.files).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              url: expect.any(String),
            }),
          ])
        )
      })
    })

    describe("GET /admin/uploads/:id", () => {
      let fileKey = ""
      beforeEach(async () => {
        const { form, meta } = getUploadReq([
          { name: "test.jpeg", content: "test content" },
        ])

        fileKey = (await api.post("/admin/uploads", form, meta)).data.files[0]
          .id
      })

      it("gets a URL to the requested file successfully", async () => {
        const response = await api.get(
          `/admin/uploads/${fileKey}`,
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.file.url).toEqual(
          expect.stringContaining(`/static/${fileKey}`)
        )
      })
    })

    describe("DELETE /admin/uploads/:id", () => {
      let fileKey = ""
      beforeEach(async () => {
        const { form, meta } = getUploadReq([
          { name: "test.jpeg", content: "test content" },
        ])

        fileKey = (await api.post("/admin/uploads", form, meta)).data.files[0]
          .id
      })

      it("deletes the specified file successfully", async () => {
        const response = await api.delete(
          `/admin/uploads/${fileKey}`,
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data).toEqual({
          id: fileKey,
          object: "file",
          deleted: true,
        })

        const { response: err } = await api
          .get(`/admin/uploads/${fileKey}`, adminHeaders)
          .catch((e) => e)

        expect(err.status).toEqual(404)
        expect(err.data.message).toEqual(`File with key ${fileKey} not found`)
      })
    })
  },
})
