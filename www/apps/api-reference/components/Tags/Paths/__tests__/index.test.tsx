import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { cleanup, render } from "@testing-library/react"
import { OpenAPI } from "types"

// mock data
const mockTag: OpenAPI.TagObject = {
  name: "mockTag",
  description: "Mock Tag",
}
const mockOperation: OpenAPI.Operation = {
  operationId: "mockOperation",
  summary: "Mock Operation",
  description: "Mock Operation",
  "x-authenticated": false,
  "x-codeSamples": [],
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
const mockUseLoading = vi.fn(() => ({
  loading: false,
}))
const mockCompareOperations = vi.fn((options: unknown) => 0)

// mock components and hooks
vi.mock("react", async () => {
  const actual = await vi.importActual<typeof React>("react")

  return {
    ...actual,
    Suspense: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  }
})
vi.mock("@/providers/loading", () => ({
  useLoading: () => mockUseLoading(),
}))
vi.mock("@/components/DividedLoading", () => ({
  default: (className: string) => (
    <div data-testid="divided-loading" className={className}>
      Loading...
    </div>
  ),
}))
vi.mock("@/utils/sort-operations-utils", () => ({
  compareOperations: (options: unknown) => mockCompareOperations(options),
}))
vi.mock("@/components/Tags/Operation", () => ({
  default: (props: TagOperationProps) => (
    <div
      data-testid="operation-container"
      data-method={props.method}
      data-endpoint-path={props.endpointPath}
      data-operation-id={props.operation.operationId}
    >
      Operation
    </div>
  ),
}))

import TagPaths from ".."
import { TagOperationProps } from "../../Operation"

beforeEach(() => {
  vi.clearAllMocks()
  cleanup()
})

describe("rendering", () => {
  test("renders loading when loading is true", () => {
    mockUseLoading.mockReturnValue({ loading: true })
    const { container } = render(<TagPaths tag={mockTag} paths={mockPaths} />)
    const dividedLoadingElement = container.querySelector(
      "[data-testid='divided-loading']"
    )
    expect(dividedLoadingElement).toBeInTheDocument()
  })

  test("does not render loading when loading is false", () => {
    mockUseLoading.mockReturnValue({ loading: false })
    const { container } = render(<TagPaths tag={mockTag} paths={mockPaths} />)
    const dividedLoadingElement = container.querySelector(
      "[data-testid='divided-loading']"
    )
    expect(dividedLoadingElement).not.toBeInTheDocument()
  })

  test("renders operations", () => {
    const { container } = render(<TagPaths tag={mockTag} paths={mockPaths} />)
    const operationElements = container.querySelectorAll(
      "[data-testid='operation-container']"
    )
    expect(operationElements).toHaveLength(1)
    expect(operationElements[0]).toHaveAttribute("data-method", "get")
    expect(operationElements[0]).toHaveAttribute(
      "data-endpoint-path",
      "/mock-path"
    )
    expect(operationElements[0]).toHaveAttribute(
      "data-operation-id",
      "mockOperation"
    )
  })

  test("renders operations in the correct order", () => {
    mockCompareOperations.mockReturnValue(-1)
    const modifiedMockPaths: OpenAPI.PathsObject = {
      "/mock-path": {
        get: {
          ...mockOperation,
          operationId: "mockOperation1",
        },
        post: {
          ...mockOperation,
          operationId: "mockOperation2",
        },
      },
    }
    const { container } = render(
      <TagPaths tag={mockTag} paths={modifiedMockPaths} />
    )
    const operationElements = container.querySelectorAll(
      "[data-testid='operation-container']"
    )
    expect(operationElements).toHaveLength(2)
    expect(operationElements[0]).toHaveAttribute(
      "data-operation-id",
      "mockOperation2"
    )
    expect(operationElements[1]).toHaveAttribute(
      "data-operation-id",
      "mockOperation1"
    )
  })
})
