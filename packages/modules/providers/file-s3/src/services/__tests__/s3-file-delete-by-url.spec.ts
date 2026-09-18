/**
 * `deleteByUrl` resolves an object key from the public URL that the provider
 * itself produced on upload, since a product image only records its URL.
 */

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

jest.mock("@aws-sdk/s3-request-presigner", () => ({
  getSignedUrl: jest
    .fn()
    .mockResolvedValue("https://bucket.s3.amazonaws.com/signed"),
}))

jest.mock("@aws-sdk/lib-storage", () => ({
  Upload: jest.fn().mockImplementation(() => ({
    done: jest.fn().mockResolvedValue(undefined),
  })),
}))

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
    file_url: "https://mybucket.s3.amazonaws.com",
    region: "us-east-1",
    bucket: "test-bucket",
    access_key_id: "test-key",
    secret_access_key: "test-secret",
  }

  const makeService = (options: Record<string, unknown> = {}) =>
    new S3FileService(
      { logger } as any,
      {
        ...baseOptions,
        ...options,
      } as any
    )

  beforeEach(() => {
    mockS3Send.mockClear()
    mockS3Send.mockResolvedValue({})
  })

  it.each([
    ["image.png", ""],
    ["my document.png", ""],
    ["Q&A file.png", ""],
    ["vendor_123/logo.png", "public/"],
    ["deep/nested/pic.png", "uploads/2024/"],
  ])(
    "round-trips the URL produced by upload() back to its object key (%s)",
    async (filename, prefix) => {
      const service = makeService({ prefix })

      const uploaded = await service.upload({
        filename,
        mimeType: "image/png",
        content: Buffer.from("test").toString("base64"),
        access: "public",
      } as any)

      mockS3Send.mockClear()

      await service.deleteByUrl(uploaded.url)

      expect(mockS3Send).toHaveBeenCalledTimes(1)
      const command = mockS3Send.mock.calls[0][0] as InstanceType<
        typeof DeleteObjectCommand
      >
      expect(command).toBeInstanceOf(DeleteObjectCommand)
      expect(command.input.Key).toBe(uploaded.key)
      expect(command.input.Bucket).toBe("test-bucket")
    }
  )

  it("deletes the object a plain URL points at", async () => {
    const service = makeService()

    await service.deleteByUrl(
      "https://mybucket.s3.amazonaws.com/prefix/nested/img.png"
    )

    const command = mockS3Send.mock.calls[0][0] as InstanceType<
      typeof DeleteObjectCommand
    >
    expect(command.input.Key).toBe("prefix/nested/img.png")
  })

  it("decodes percent-encoded segments without decoding the separators", async () => {
    const service = makeService()

    await service.deleteByUrl(
      "https://mybucket.s3.amazonaws.com/a%2Bb/c%26d%20e.png"
    )

    const command = mockS3Send.mock.calls[0][0] as InstanceType<
      typeof DeleteObjectCommand
    >
    expect(command.input.Key).toBe("a+b/c&d e.png")
  })

  it("rejects a URL that does not belong to the configured file URL", async () => {
    const service = makeService()

    await expect(
      service.deleteByUrl("https://other.example.com/image.png")
    ).rejects.toThrow("is not managed by this file provider")

    expect(mockS3Send).not.toHaveBeenCalled()
  })

  it("rejects a URL that merely shares the file URL as a prefix", async () => {
    const service = makeService()

    await expect(
      service.deleteByUrl(
        "https://mybucket.s3.amazonaws.com.evil.com/image.png"
      )
    ).rejects.toThrow("is not managed by this file provider")

    expect(mockS3Send).not.toHaveBeenCalled()
  })
})
