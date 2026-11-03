/* eslint-disable @typescript-eslint/no-var-requires */
var mockS3Send: jest.Mock

jest.mock("@aws-sdk/client-s3", () => {
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

import { DeleteObjectCommand } from "@aws-sdk/client-s3"
import { S3FileService } from "../s3-file"

describe("S3FileService.deleteByUrl", () => {
  const logger = {
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  }

  const baseOptions = {
    region: "us-east-1",
    bucket: "test-bucket",
    access_key_id: "test-key",
    secret_access_key: "test-secret",
  }

  beforeEach(() => {
    mockS3Send.mockClear()
    mockS3Send.mockResolvedValue({})
  })

  const upload = (service: S3FileService, filename = "image.png") =>
    service.upload({
      filename,
      mimeType: "image/png",
      content: Buffer.from("content").toString("base64"),
      access: "public",
    })

  const getDeletedKey = () => {
    const command = mockS3Send.mock.calls[0][0] as InstanceType<
      typeof DeleteObjectCommand
    >

    expect(command).toBeInstanceOf(DeleteObjectCommand)
    return command.input.Key
  }

  it("deletes the object matching the uploaded URL", async () => {
    const service = new S3FileService({ logger } as any, {
      ...baseOptions,
      file_url: "https://bucket.s3.amazonaws.com",
      prefix: "public/",
    })

    const { url, key } = await upload(service, "nested/logo one.png")

    mockS3Send.mockClear()

    await service.deleteByUrl(url)

    expect(getDeletedKey()).toBe(key)
  })

  it("supports file URLs with a path", async () => {
    const service = new S3FileService({ logger } as any, {
      ...baseOptions,
      file_url: "https://cdn.example.com/assets",
      prefix: "public/",
    })

    const { url, key } = await upload(service)

    mockS3Send.mockClear()

    await service.deleteByUrl(url)

    expect(getDeletedKey()).toBe(key)
  })

  it("ignores URLs that don't belong to the provider", async () => {
    const service = new S3FileService({ logger } as any, {
      ...baseOptions,
      file_url: "https://bucket.s3.amazonaws.com",
    })

    await service.deleteByUrl(
      "https://bucket.s3.amazonaws.com.evil.com/file.png"
    )
    await service.deleteByUrl("https://example.com/file.png")
    await service.deleteByUrl("not a url")

    expect(mockS3Send).not.toHaveBeenCalled()
  })
})
