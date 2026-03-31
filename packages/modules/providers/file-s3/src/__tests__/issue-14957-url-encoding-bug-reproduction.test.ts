/**
 * ISSUE #14957: Inconsistent URL Encoding Bug Reproduction
 *
 * BUG: S3FileService constructs file URLs inconsistently:
 * 1. upload() uses encodeURIComponent(fileKey) - encodes '/' as '%2F'
 * 2. getUploadStream() uses NO encoding - leaves spaces raw
 *
 * EXPECTED: Both methods should encode path segments separately, preserving '/' separators
 *
 * REPRODUCTION: Upload a file with spaces in name and a prefix containing '/'
 */

import { S3FileService } from "../services/s3-file"

// Mock the S3 client
const mockSend = jest.fn()
jest.mock("@aws-sdk/client-s3", () => {
  const originalModule = jest.requireActual("@aws-sdk/client-s3")
  return {
    ...originalModule,
    S3Client: jest.fn().mockImplementation(() => ({
      send: mockSend,
    })),
  }
})

// Mock @aws-sdk/lib-storage Upload
jest.mock("@aws-sdk/lib-storage", () => {
  return {
    Upload: jest.fn().mockImplementation(() => ({
      done: jest.fn().mockResolvedValue({
        url: "https://test.s3.amazonaws.com/test-key",
        key: "test-key",
      }),
    })),
  }
})

describe("ISSUE #14957: Inconsistent URL Encoding", () => {
  const mockLogger = {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  }

  const s3Service = new S3FileService(
    { logger: mockLogger as any },
    {
      file_url: "https://cdn.example.com",
      access_key_id: "test-key",
      secret_access_key: "test-secret",
      region: "us-east-1",
      bucket: "test-bucket",
      prefix: "uploads/products/", // Prefix contains '/' - key to reproducing the bug
    }
  )

  beforeEach(() => {
    mockSend.mockClear()
  })

  it("should reproduce ISSUE #14957: inconsistent URL encoding between upload() and getUploadStream()", async () => {
    // Arrange
    mockSend.mockResolvedValueOnce({
      $metadata: { httpStatusCode: 200 },
    })
    const filename = "my product.jpg" // Contains space to trigger encoding bugs

    // Act: Use both methods with identical configuration
    const uploadResult = await s3Service.upload({
      filename,
      mimeType: "image/jpeg",
      content: "test",
      access: "public",
    })

    const streamResult = await s3Service.getUploadStream({
      filename,
      mimeType: "image/jpeg",
      access: "public",
    })

    // Assert: Verify the inconsistency bug
    console.log("── ISSUE #14957: URL Encoding Inconsistency ──")
    console.log("upload() URL:         ", uploadResult.url)
    console.log("getUploadStream() URL:", streamResult.url)
    console.log("─────────────────────────────────────────────")

    // BUG #1: upload() uses encodeURIComponent() which encodes '/' as '%2F'
    expect(uploadResult.url).toContain("%2F")

    // BUG #2: getUploadStream() uses NO encoding, leaving spaces raw
    expect(streamResult.url).toContain(" ")

    // BUG #3: Inconsistency - two different encoding schemes for the same file
    expect(uploadResult.url).not.toEqual(streamResult.url)
  })
})
