import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { cleanup, render } from "@testing-library/react"
import { OpenAPI } from "types"

// mock data
const mockOperation: OpenAPI.Operation = {
  operationId: "mockOperation",
  summary: "Mock Operation",
  description: "Mock Operation",
  "x-authenticated": false,
  "x-codeSamples": [],
  "x-path": "/store/mock/mock-operation",
  requestBody: { content: {} },
  parameters: [],
  responses: {
    "200": {
      description: "OK",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: { name: { type: "string", properties: {} } },
          },
        },
      },
    },
  },
}
const mockPaths: OpenAPI.PathsObject = {
  "/mock-path": {
    get: mockOperation,
  },
}

// mock functions
const mockCompareOperations = vi.fn((options: unknown) => 0)

// mock components and hooks
vi.mock("@/utils/sort-operations-utils", () => ({
  compareOperations: (options: unknown) => mockCompareOperations(options),
}))

import { RoutesSummary } from ".."

beforeEach(() => {
  vi.clearAllMocks()
  cleanup()
})

describe("rendering", () => {
  test("renders nothing when there are no operations", () => {
    const { container } = render(<RoutesSummary paths={{}} />)
    expect(container).toBeEmptyDOMElement()
  })

  test("renders operation", () => {
    const { container } = render(<RoutesSummary paths={mockPaths} />)
    const operationLink = container.querySelector("[data-testid='link']")
    expect(operationLink).toBeInTheDocument()
    expect(operationLink).toHaveAttribute("href", "/store/mock/mock-operation")
    expect(operationLink).toHaveTextContent("/mock-path")
  })

  test("renders operations in the correct order", () => {
    const modifiedMockPaths: OpenAPI.PathsObject = {
      "/mock-path": {
        get: {
          ...mockOperation,
          operationId: "mockOperation1",
          "x-path": "/store/mock/op-1",
        },
        post: {
          ...mockOperation,
          operationId: "mockOperation2",
          "x-path": "/store/mock/op-2",
        },
      },
    }
    mockCompareOperations.mockReturnValue(-1)
    const { container } = render(<RoutesSummary paths={modifiedMockPaths} />)
    const operationLinks = container.querySelectorAll("[data-testid='link']")
    expect(operationLinks).toHaveLength(2)
    expect(operationLinks[0]).toHaveAttribute("href", "/store/mock/op-2")
    expect(operationLinks[1]).toHaveAttribute("href", "/store/mock/op-1")
  })
})
