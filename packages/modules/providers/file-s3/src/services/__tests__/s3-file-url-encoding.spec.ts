/**
 * URL encoding for S3 object keys is implemented in S3FileService (upload / streams).
 * These tests exercise the real service with a mocked S3 client `send` implementation.
 */

/* eslint-disable @typescript-eslint/no-var-requires */
var mockS3Send: jest.Mock

jest.mock("@aws-sdk/client-s3", () => {
  const actual = jest.requireActual("@aws-sdk/client-s3") as typeof import("@aws-sdk/client-s3")
  mockS3Send = jest.fn().mockResolvedValue({})
  return {
    ...actual,
    S3Client: jest.fn().mockImplementation(() => ({
      send: (...args: unknown[]) => mockS3Send(...args),
    })),
  }
})

jest.mock("@aws-sdk/s3-request-presigner", () => ({
  getSignedUrl: jest.fn().mockResolvedValue("https://bucket.s3.amazonaws.com/signed"),
}))

jest.mock("@aws-sdk/lib-storage", () => ({
  Upload: jest.fn().mockImplementation(() => ({
    done: jest.fn().mockResolvedValue(undefined),
  })),
}))

import { PutObjectCommand } from "@aws-sdk/client-s3"
import { Upload } from "@aws-sdk/lib-storage"
import { S3FileService } from "../s3-file"

const UploadMock = Upload as jest.MockedClass<typeof Upload>

describe("S3FileService URL encoding", () => {
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

  beforeEach(() => {
    mockS3Send.mockClear()
    mockS3Send.mockResolvedValue({})
    UploadMock.mockClear()
  })

  it("preserves path separators in upload() URLs (no %2F between prefix segments)", async () => {
    const service = new S3FileService({ logger } as any, {
      ...baseOptions,
      prefix: "public/",
    })

    const result = await service.upload({
      filename: "image.jpg",
      mimeType: "image/jpeg",
      content: Buffer.from("test").toString("base64"),
      access: "public",
    })

    expect(result.url).not.toContain("%2F")
    expect(result.url).toMatch(/public\/image-[^/]+\.jpg$/)

    expect(mockS3Send).toHaveBeenCalledTimes(1)
    const command = mockS3Send.mock.calls[0][0] as InstanceType<typeof PutObjectCommand>
    expect(command.input.Key).toMatch(/^public\/image-/)
  })

  it("encodes special characters inside a path segment (e.g. spaces) while keeping slashes", async () => {
    const service = new S3FileService({ logger } as any, {
      ...baseOptions,
      prefix: "uploads/2024/",
    })

    const result = await service.upload({
      filename: "my document.jpg",
      mimeType: "image/jpeg",
      content: Buffer.from("x").toString("base64"),
      access: "public",
    })

    expect(result.url).not.toContain("%2F")
    expect(result.url).toContain("uploads/2024/")
    expect(result.url).toMatch(/my%20document-[^/]+\.jpg$/)

    const command = mockS3Send.mock.calls[0][0] as InstanceType<typeof PutObjectCommand>
    expect(command.input.Key).toMatch(/^uploads\/2024\/my document-/)
  })

  it("encodes characters such as & within a segment", async () => {
    const service = new S3FileService({ logger } as any, {
      ...baseOptions,
      prefix: "docs/",
    })

    const result = await service.upload({
      filename: "Q&A file.pdf",
      mimeType: "application/pdf",
      content: Buffer.from("pdf").toString("base64"),
      access: "public",
    })

    expect(result.url).not.toContain("%2F")
    expect(result.url).toContain("docs/")
    expect(result.url).toMatch(/Q%26A%20file-[^/]+\.pdf$/)

    const command = mockS3Send.mock.calls[0][0] as InstanceType<typeof PutObjectCommand>
    expect(command.input.Key).toMatch(/^docs\/Q&A file-/)
  })

  it("preserves path separators in getUploadStream() URLs (no %2F) and encodes special characters in segments", async () => {
    const service = new S3FileService({ logger } as any, {
      ...baseOptions,
      prefix: "uploads/2024/",
    })

    const { writeStream, promise, url } = await service.getUploadStream({
      filename: "my document.jpg",
      mimeType: "image/jpeg",
      access: "public",
    })

    writeStream.end()
    const result = await promise

    expect(result.url).toBe(url)
    expect(result.url).not.toContain("%2F")
    expect(result.url).toContain("uploads/2024/")
    expect(result.url).toMatch(/my%20document-[^/]+\.jpg$/)

    expect(UploadMock).toHaveBeenCalledTimes(1)
    const uploadArgs = UploadMock.mock.calls[0][0] as { params: { Key: string } }
    expect(uploadArgs.params.Key).toMatch(/^uploads\/2024\/my document-/)
  })
})
