import { S3FileService } from "../s3-file"

describe("S3FileService getPresignedUploadUrl", () => {
  const service = new S3FileService({ logger: console } as any, {
    file_url: "https://mybucket.s3.amazonaws.com",
    region: "us-east-1",
    bucket: "test-bucket",
    access_key_id: "test-key",
    secret_access_key: "test-secret",
  })

  const getSignedHeaders = async (size?: number) => {
    const { url } = await service.getPresignedUploadUrl({
      filename: "image.png",
      mimeType: "image/png",
      size,
    })
    return new URL(url).searchParams.get("X-Amz-SignedHeaders")
  }

  it("signs the size so S3 rejects an upload of any other size", async () => {
    expect(await getSignedHeaders(1234)).toContain("content-length")
  })

  it("doesn't sign a size when none is given", async () => {
    expect(await getSignedHeaders()).not.toContain("content-length")
  })
})
