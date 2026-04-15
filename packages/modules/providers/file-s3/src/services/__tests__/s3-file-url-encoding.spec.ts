describe("S3 URL encoding", () => {
  function encodeFileKey(fileKey: string): string {
    return fileKey
      .split("/")
      .map((segment) => encodeURIComponent(segment))
      .join("/")
  }

  it("should preserve path separators in fileKey", () => {
    const result = encodeFileKey("public/image.jpg")
    expect(result).toBe("public/image.jpg")
    expect(result).not.toContain("%2F")
  })

  it("should encode special characters within segments", () => {
    const result = encodeFileKey("public/image file.jpg")
    expect(result).toBe("public/image%20file.jpg")
  })

  it("should handle deeply nested paths", () => {
    const result = encodeFileKey("uploads/2024/03/my document.pdf")
    expect(result).toBe("uploads/2024/03/my%20document.pdf")
  })

  it("should handle fileKey with no separators", () => {
    const result = encodeFileKey("simple-file.jpg")
    expect(result).toBe("simple-file.jpg")
  })

  it("should handle special characters like ampersand", () => {
    const result = encodeFileKey("docs/Q&A file.pdf")
    expect(result).toBe("docs/Q%26A%20file.pdf")
  })
})
