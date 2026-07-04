/**
 * Tests for the `acl` configuration option on S3FileService.
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
import { S3FileService } from "../s3-file"

const baseOptions = {
  file_url: "https://media.example.com",
  access_key_id: "test",
  secret_access_key: "test",
  region: "us-east-1",
  bucket: "test-bucket",
}

const logger = { error: jest.fn(), warn: jest.fn(), info: jest.fn() } as any

describe("S3FileService ACL option", () => {
  beforeEach(() => {
    mockS3Send.mockClear()
  })

  it("defaults to public-read for public files when acl is not configured", async () => {
    const service = new S3FileService({ logger }, baseOptions)

    await service.upload({
      filename: "test.png",
      mimeType: "image/png",
      content: Buffer.from("test").toString("base64"),
      access: "public",
    })

    const command = mockS3Send.mock.calls[0][0] as PutObjectCommand
    expect(command.input.ACL).toBe("public-read")
  })

  it("defaults to private when acl is not configured and access is private", async () => {
    const service = new S3FileService({ logger }, baseOptions)

    await service.upload({
      filename: "test.png",
      mimeType: "image/png",
      content: Buffer.from("test").toString("base64"),
      access: "private",
    })

    const command = mockS3Send.mock.calls[0][0] as PutObjectCommand
    expect(command.input.ACL).toBe("private")
  })

  it("defaults to private when acl is not configured and access is undefined", async () => {
    const service = new S3FileService({ logger }, baseOptions)

    await service.upload({
      filename: "test.png",
      mimeType: "image/png",
      content: Buffer.from("test").toString("base64"),
    } as any)

    const command = mockS3Send.mock.calls[0][0] as PutObjectCommand
    expect(command.input.ACL).toBe("private")
  })

  it("omits ACL header when acl is set to false", async () => {
    const service = new S3FileService({ logger }, {
      ...baseOptions,
      acl: false,
    } as any)

    await service.upload({
      filename: "test.png",
      mimeType: "image/png",
      content: Buffer.from("test").toString("base64"),
      access: "public",
    })

    const command = mockS3Send.mock.calls[0][0] as PutObjectCommand
    expect(command.input.ACL).toBeUndefined()
  })

  it("uses the configured canned ACL for all uploads", async () => {
    const service = new S3FileService({ logger }, {
      ...baseOptions,
      acl: "bucket-owner-full-control",
    } as any)

    await service.upload({
      filename: "test.png",
      mimeType: "image/png",
      content: Buffer.from("test").toString("base64"),
      access: "public",
    })

    const command = mockS3Send.mock.calls[0][0] as PutObjectCommand
    expect(command.input.ACL).toBe("bucket-owner-full-control")
  })
})
