/**
 * The AWS SDK and the S3 client are only loaded when a file operation runs,
 * so an app that boots with the S3 provider configured doesn't pay for them.
 */

var mockLoads: string[] = []
var mockS3Send: jest.Mock

jest.mock("@aws-sdk/client-s3", () => {
  mockLoads.push("@aws-sdk/client-s3")
  const actual = jest.requireActual(
    "@aws-sdk/client-s3"
  ) as typeof import("@aws-sdk/client-s3")
  mockS3Send = jest.fn().mockResolvedValue({})
  return {
    ...actual,
    S3Client: jest.fn().mockImplementation(() => ({
      send: (...args: unknown[]) => mockS3Send(...args),
    })),
  }
})

jest.mock("@aws-sdk/s3-request-presigner", () => {
  mockLoads.push("@aws-sdk/s3-request-presigner")
  return { getSignedUrl: jest.fn().mockResolvedValue("https://signed") }
})

jest.mock("@aws-sdk/lib-storage", () => {
  mockLoads.push("@aws-sdk/lib-storage")
  return {
    Upload: jest.fn().mockImplementation(() => ({
      done: jest.fn().mockResolvedValue(undefined),
    })),
  }
})

import { S3FileService } from "../s3-file"

const baseOptions = {
  file_url: "https://media.example.com",
  access_key_id: "test",
  secret_access_key: "test",
  region: "us-east-1",
  bucket: "test-bucket",
}

const logger = { error: jest.fn(), warn: jest.fn(), info: jest.fn() } as any

describe("S3FileService lazy client", () => {
  it("doesn't load the AWS SDK when the provider is loaded and created", () => {
    new S3FileService({ logger }, baseOptions)

    expect(mockLoads).toEqual([])
  })

  it("still validates its options when created", () => {
    expect(
      () =>
        new S3FileService({ logger }, { ...baseOptions, access_key_id: "" })
    ).toThrow("Access key ID and secret access key are required")
    expect(mockLoads).toEqual([])
  })

  it("creates one client on first use and reuses it", async () => {
    const service = new S3FileService({ logger }, baseOptions)
    const upload = {
      filename: "test.png",
      mimeType: "image/png",
      content: Buffer.from("test").toString("base64"),
    }

    await service.upload(upload)
    await service.upload(upload)

    const { S3Client } = jest.requireMock("@aws-sdk/client-s3")
    expect(mockLoads).toEqual(["@aws-sdk/client-s3"])
    expect(S3Client).toHaveBeenCalledTimes(1)
    expect(mockS3Send).toHaveBeenCalledTimes(2)
  })
})
