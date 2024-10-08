import fs from "fs/promises"
import axios from "axios"
import { S3FileService } from "../../src/services/s3-file"
jest.setTimeout(100000)

// Note: This test hits the S3 service, and it is mainly meant to be run manually after setting all the envvars below.
// We can also set up some test buckets in our pipeline to run this test, but it is not really that important to do so for now.
describe.skip("S3 File Plugin", () => {
  let s3Service: S3FileService
  let fixtureImagePath: string
  beforeAll(() => {
    fixtureImagePath =
      process.cwd() + "/integration-tests/__fixtures__/catphoto.jpg"

    s3Service = new S3FileService(
      {
        logger: console as any,
      },
      {
        endpoint: process.env.S3_TEST_ENDPOINT ?? "",
        file_url: process.env.S3_TEST_FILE_URL ?? "",
        access_key_id: process.env.S3_TEST_ACCESS_KEY_ID ?? "",
        secret_access_key: process.env.S3_TEST_SECRET_ACCESS_KEY ?? "",
        region: process.env.S3_TEST_REGION ?? "",
        bucket: process.env.S3_TEST_BUCKET ?? "",
        prefix: "tests/",
        additional_client_config: process.env.S3_TEST_ENDPOINT?.includes(
          "localhost"
        )
          ? {
              sslEnabled: false,
              s3ForcePathStyle: true,
            }
          : {},
      }
    )
  })
  ;(["public", "private"] as const).forEach((access) => {
    it("uploads, reads, and then deletes a file successfully", async () => {
      const fileContent = await fs.readFile(fixtureImagePath)
      const fixtureAsBinary = fileContent.toString("binary")

      const resp = await s3Service.upload({
        filename: "catphoto.jpg",
        mimeType: "image/jpeg",
        content: fixtureAsBinary,
        access,
      })

      expect(resp).toEqual({
        key: expect.stringMatching(/tests\/catphoto.*\.jpg/),
        url: expect.stringMatching(/https:\/\/.*\.jpg/),
      })

      const urlResp = await axios.get(resp.url).catch((e) => e.response)
      expect(urlResp.status).toEqual(access === "public" ? 200 : 403)

      const signedUrl = await s3Service.getPresignedDownloadUrl({
        fileKey: resp.key,
      })

      const signedUrlFile = Buffer.from(
        await axios
          .get(signedUrl, { responseType: "arraybuffer" })
          .then((r) => r.data)
      )

      expect(signedUrlFile.toString("binary")).toEqual(fixtureAsBinary)

      await s3Service.delete({ fileKey: resp.key })

      // TODO: Currently the presignedURL will be returned even if the file doesn't exist. Should we check for existence first?
      const deletedFileUrl = await s3Service.getPresignedDownloadUrl({
        fileKey: resp.key,
      })

      const { response } = await axios
        .get(deletedFileUrl, { responseType: "arraybuffer" })
        .catch((e) => e)

      expect(response.status).toEqual(404)
    })
  })
})
