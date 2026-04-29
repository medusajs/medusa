import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { cleanup, render, waitFor } from "@testing-library/react"
import { OpenAPI } from "types"

// mock data
const mockSpecs: OpenAPI.OpenAPIV3.Document = {
  openapi: "3.0.0",
  info: {
    title: "Test API",
    version: "1.0.0",
  },
  paths: {},
  components: {
    securitySchemes: {
      bearer: {
        type: "http",
        scheme: "bearer",
      },
    },
  },
}

const mockSpecsWithRef: OpenAPI.OpenAPIV3.Document = {
  ...mockSpecs,
  components: {
    securitySchemes: {
      bearer: {
        $ref: "#/components/securitySchemes/bearer",
      },
    },
  },
}

// mock components
vi.mock("@/components/MDXComponents/Security/Description", () => ({
  default: ({ securitySchema }: { securitySchema: OpenAPI.SecuritySchemeObject }) => (
    <div data-testid="security-description">{securitySchema.type}</div>
  ),
}))

import Security from ".."

beforeEach(() => {
  vi.clearAllMocks()
  cleanup()
})

describe("rendering", () => {
  test("does not render when specs is not provided", () => {
    const { container } = render(<Security />)
    const securityDescriptionElements = container.querySelectorAll("[data-testid='security-description']")
    expect(securityDescriptionElements).toHaveLength(0)
  })
  test("renders security information for specs", async () => {
    const { getByTestId } = render(<Security specs={mockSpecs} />)
    await waitFor(() => {
      const securityDescriptionElement = getByTestId("security-description")
      expect(securityDescriptionElement).toBeInTheDocument()
      expect(securityDescriptionElement).toHaveTextContent("http")
    })
  })

  test("does not render when security scheme is a $ref", () => {
    const { container } = render(<Security specs={mockSpecsWithRef} />)
    const securityDescriptionElements = container.querySelectorAll("[data-testid='security-description']")
    expect(securityDescriptionElements).toHaveLength(0)
  })
})