import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { cleanup, getByTestId, render, waitFor } from "@testing-library/react"
import { OpenAPI } from "types"

// mock data
const mockHttpSecuritySchema: OpenAPI.SecuritySchemeObject = {
  type: "http",
  scheme: "bearer",
  description: "Authentication using Bearer token",
  "x-displayName": "Bearer Token",
}
const mockApiKeySecuritySchema: OpenAPI.SecuritySchemeObject = {
  type: "apiKey",
  name: "Authorization",
  description: "Authentication using API key",
  "x-displayName": "API Key",
  in: "header",
}

// mock components
vi.mock("@/components/MDXContent/Client", () => ({
  default: ({ content }: { content: string }) => (
    <div data-testid="mdx-content-client">{content}</div>
  ),
}))
vi.mock("@/components/MDXContent/Server", () => ({
  default: ({ content }: { content: string }) => (
    <div data-testid="mdx-content-server">{content}</div>
  ),
}))
vi.mock("@/utils/get-security-schema-type-name", () => ({
  default: vi.fn(() => "security-schema-type"),
}))
vi.mock("docs-ui", () => ({
  Loading: () => <div>Loading</div>,
}))

import SecurityDescription from ".."

beforeEach(() => {
  vi.clearAllMocks()
  cleanup()
})

describe("rendering", () => {
  test("renders security information for http security scheme", () => {
    const { getByTestId } = render(
      <SecurityDescription securitySchema={mockHttpSecuritySchema} />
    )
    const titleElement = getByTestId("title")
    expect(titleElement).toBeInTheDocument()
    expect(titleElement).toHaveTextContent(mockHttpSecuritySchema["x-displayName"] as string)
    const securitySchemeTypeElement = getByTestId("security-scheme-type")
    expect(securitySchemeTypeElement).toBeInTheDocument()
    expect(securitySchemeTypeElement).toHaveTextContent("security-schema-type")
    const securitySchemeTypeDetailsElement = getByTestId("security-scheme-type-details")
    expect(securitySchemeTypeDetailsElement).toBeInTheDocument()
    expect(securitySchemeTypeDetailsElement).toHaveTextContent("HTTP Authorization Scheme")
    const securitySchemeTypeDetailsValueElement = getByTestId("security-scheme-type-details-value")
    expect(securitySchemeTypeDetailsValueElement).toBeInTheDocument()
    expect(securitySchemeTypeDetailsValueElement).toHaveTextContent(mockHttpSecuritySchema.scheme)
  })

  test("renders security information for api key security scheme", () => {
    const { getByTestId } = render(
      <SecurityDescription securitySchema={mockApiKeySecuritySchema} />
    )
    const titleElement = getByTestId("title")
    expect(titleElement).toBeInTheDocument()
    expect(titleElement).toHaveTextContent(mockApiKeySecuritySchema["x-displayName"] as string)
    const securitySchemeTypeElement = getByTestId("security-scheme-type")
    expect(securitySchemeTypeElement).toBeInTheDocument()
    expect(securitySchemeTypeElement).toHaveTextContent("security-schema-type")
    const securitySchemeTypeDetailsElement = getByTestId("security-scheme-type-details")
    expect(securitySchemeTypeDetailsElement).toBeInTheDocument()
    expect(securitySchemeTypeDetailsElement).toHaveTextContent("Cookie parameter name")
    const securitySchemeTypeDetailsValueElement = getByTestId("security-scheme-type-details-value")
    expect(securitySchemeTypeDetailsValueElement).toBeInTheDocument()
    expect(securitySchemeTypeDetailsValueElement).toHaveTextContent(mockApiKeySecuritySchema.name)
  })

  test("render description with server component", async () => {
    const { getByTestId } = render(
      <SecurityDescription securitySchema={mockHttpSecuritySchema} isServer={true} />
    )
    await waitFor(() => {
      const mdxContentServerElement = getByTestId("mdx-content-server")
      expect(mdxContentServerElement).toBeInTheDocument()
      expect(mdxContentServerElement).toHaveTextContent(mockHttpSecuritySchema.description as string)
    })
  })

  test("render description with client component", async () => {
    const { getByTestId } = render(
      <SecurityDescription securitySchema={mockHttpSecuritySchema} isServer={false} />
    )
    await waitFor(() => {
      const mdxContentClientElement = getByTestId("mdx-content-client")
      expect(mdxContentClientElement).toBeInTheDocument()
      expect(mdxContentClientElement).toHaveTextContent(mockHttpSecuritySchema.description as string)
    })
  })
})
