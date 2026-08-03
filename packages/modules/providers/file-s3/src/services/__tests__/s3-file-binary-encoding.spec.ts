/**
 * Regression tests for #14120: binary file content (e.g. an image produced via
 * `buffer.toString("binary")`, as the upload docs instruct) must not be
 * corrupted by a UTF-8 decode, while UTF-8 text content (CSV special characters
 * from #13649) and base64 content must still be handled correctly. Exercises the
 * real service with a mocked S3 client `send`.
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

import { PutObjectCommand } from "@aws-sdk/client-s3"
import { S3FileService } from "../s3-file"

describe("S3FileService content decoding (#14120)", () => {
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

  const uploadedBody = async (file: any): Promise<Buffer> => {
    const service = new S3FileService({ logger } as any, baseOptions)
    await service.upload(file)
    const command = mockS3Send.mock.calls[0][0] as InstanceType<
      typeof PutObjectCommand
    >
    return command.input.Body as Buffer
  }

  beforeEach(() => {
    mockS3Send.mockClear()
    mockS3Send.mockResolvedValue({})
  })

  it("preserves binary image bytes passed via buffer.toString('binary') (no UTF-8 corruption)", async () => {
    const png = Buffer.from([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0xff, 0x80,
    ])

    const body = await uploadedBody({
      filename: "image.png",
      mimeType: "image/png",
      content: png.toString("binary"),
      access: "public",
    })

    // Before the fix the leading 0x89 was re-encoded to the UTF-8 sequence
    // 0xC2 0x89, corrupting the file.
    expect(Buffer.compare(body, png)).toBe(0)
    expect([body[0], body[1], body[2], body[3]]).toEqual([
      0x89, 0x50, 0x4e, 0x47,
    ])
  })

  it("decodes base64-encoded content back to the original bytes", async () => {
    const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x00, 0xfe])

    const body = await uploadedBody({
      filename: "image.png",
      mimeType: "image/png",
      content: png.toString("base64"),
      access: "public",
    })

    expect(Buffer.compare(body, png)).toBe(0)
  })

  it("preserves UTF-8 special characters in text/CSV content (guards #13649)", async () => {
    const csv = "name,city\nJoão,São Paulo\n"

    const body = await uploadedBody({
      filename: "data.csv",
      mimeType: "text/csv",
      content: csv,
      access: "public",
    })

    expect(Buffer.compare(body, Buffer.from(csv, "utf8"))).toBe(0)
  })
})
