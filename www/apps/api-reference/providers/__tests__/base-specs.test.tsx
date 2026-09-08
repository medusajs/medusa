import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { cleanup, render } from "@testing-library/react"
import { OpenAPI } from "types"

// mock data
const mockBaseSpecs: OpenAPI.ExpandedDocument = {
  openapi: "3.0.0",
  info: {
    title: "Test API",
    version: "1.0.0",
  },
  tags: [
    {
      name: "TestTag",
    },
  ],
  paths: {},
  components: {
    securitySchemes: {
      "test-security": {
        type: "http",
        scheme: "bearer",
      },
    },
  },
} as OpenAPI.ExpandedDocument

import BaseSpecsProvider, { useBaseSpecs } from "../base-specs"

// Test component that uses the hook
const TestComponent = () => {
  const { baseSpecs, getSecuritySchema } = useBaseSpecs()
  return (
    <div>
      <div data-testid="base-specs">{baseSpecs ? "present" : "null"}</div>
      <div data-testid="security-schema">
        {getSecuritySchema("test-security") ? "found" : "null"}
      </div>
    </div>
  )
}

describe("BaseSpecsProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    cleanup()
  })

  describe("rendering", () => {
    test("renders children", () => {
      const { getByText } = render(
        <BaseSpecsProvider baseSpecs={mockBaseSpecs}>
          <div>Test Content</div>
        </BaseSpecsProvider>
      )
      expect(getByText("Test Content")).toBeInTheDocument()
    })
  })

  describe("useBaseSpecs hook", () => {
    test("throws error when used outside provider", () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

      expect(() => {
        render(<TestComponent />)
      }).toThrow("useBaseSpecs must be used inside a BaseSpecsProvider")

      consoleSpy.mockRestore()
    })

    test("returns baseSpecs and getSecuritySchema", () => {
      const { getByTestId } = render(
        <BaseSpecsProvider baseSpecs={mockBaseSpecs}>
          <TestComponent />
        </BaseSpecsProvider>
      )
      expect(getByTestId("base-specs")).toHaveTextContent("present")
      expect(getByTestId("security-schema")).toBeInTheDocument()
    })
  })

  describe("getSecuritySchema", () => {
    test("returns security schema when it exists", () => {
      const { getByTestId } = render(
        <BaseSpecsProvider baseSpecs={mockBaseSpecs}>
          <TestComponent />
        </BaseSpecsProvider>
      )
      expect(getByTestId("security-schema")).toHaveTextContent("found")
    })

    test("returns null when security schema does not exist", () => {
      const TestComponent2 = () => {
        const { getSecuritySchema } = useBaseSpecs()
        return (
          <div data-testid="security-schema-2">
            {getSecuritySchema("non-existent") ? "found" : "null"}
          </div>
        )
      }
      const { getByTestId } = render(
        <BaseSpecsProvider baseSpecs={mockBaseSpecs}>
          <TestComponent2 />
        </BaseSpecsProvider>
      )
      expect(getByTestId("security-schema-2")).toHaveTextContent("null")
    })

    test("returns null when security schema is a ref", () => {
      const baseSpecsWithRef: OpenAPI.ExpandedDocument = {
        ...mockBaseSpecs,
        components: {
          securitySchemes: {
            "test-security": {
              $ref: "#/components/securitySchemes/OtherSecurity",
            },
          },
        },
      } as OpenAPI.ExpandedDocument

      const TestComponent3 = () => {
        const { getSecuritySchema } = useBaseSpecs()
        return (
          <div data-testid="security-schema-3">
            {getSecuritySchema("test-security") ? "found" : "null"}
          </div>
        )
      }

      const { getByTestId } = render(
        <BaseSpecsProvider baseSpecs={baseSpecsWithRef}>
          <TestComponent3 />
        </BaseSpecsProvider>
      )
      expect(getByTestId("security-schema-3")).toHaveTextContent("null")
    })
  })
})
