import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { cleanup, render, waitFor } from "@testing-library/react"
import { OpenAPI } from "types"

// mock data
const mockOperation: OpenAPI.Operation = {
  operationId: "mockOperation",
  summary: "Mock Operation",
  description: "Mock Operation",
  "x-authenticated": false,
  "x-codeSamples": [
    {
      label: "Request Sample 1",
      lang: "javascript",
      source: "console.log('Request Sample 1')",
    }
  ],
  requestBody: {
    content: {},
  },
  parameters: [],
  responses: {
    "200": {
      description: "OK",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              name: { type: "string", properties: {} },
            },
          },
        },
      },
    },
  },
}

// mock components
vi.mock("@/components/MethodLabel", () => ({
  default: ({ method }: { method: string }) => (
    <div data-testid="method-label" data-method={method}>{method}</div>
  ),
}))
vi.mock("@/components/Tags/Operation/CodeSection/RequestSamples", () => ({
  default: () => <div data-testid="request-samples">Request Samples</div>,
}))
vi.mock("@/components/Tags/Operation/CodeSection/Responses", () => ({
  default: () => <div data-testid="responses">Responses</div>,
}))
vi.mock("docs-ui", () => ({
  CopyButton: ({ text }: { text: string }) => (
    <div data-testid="copy-button" data-text={text}>{text}</div>
  ),
}))

import TagsOperationCodeSection from ".."

beforeEach(() => {
  vi.clearAllMocks()
  cleanup()
})

describe("rendering", () => {
  test("renders method label, request samples, and responses", async () => {
    const { getByTestId } = render(
      <TagsOperationCodeSection operation={mockOperation} method="GET" endpointPath="/api/v1/users" />
    )
    const methodLabelElement = getByTestId("method-label")
    expect(methodLabelElement).toBeInTheDocument()
    expect(methodLabelElement).toHaveTextContent("GET")
    const endpointPathElement = getByTestId("endpoint-path")
    expect(endpointPathElement).toBeInTheDocument()
    expect(endpointPathElement).toHaveTextContent("/api/v1/users")
    const responsesElement = getByTestId("responses")
    expect(responsesElement).toBeInTheDocument()
    const copyButtonElement = getByTestId("copy-button")
    expect(copyButtonElement).toBeInTheDocument()
    expect(copyButtonElement).toHaveTextContent("/api/v1/users")

    await waitFor(() => {
      const requestSamplesElement = getByTestId("request-samples")
      expect(requestSamplesElement).toBeInTheDocument()
    })
  })

  test("doesn't render request samples when no code samples are available", () => {
    const modifiedOperation: OpenAPI.Operation = {
      ...mockOperation,
      "x-codeSamples": [],
    }
    const { container } = render(
      <TagsOperationCodeSection operation={modifiedOperation} method="GET" endpointPath="/api/v1/users" />
    )
    const requestSamplesElement = container.querySelector("[data-testid='request-samples']")
    expect(requestSamplesElement).not.toBeInTheDocument()
  })

  test("renders code section with className", () => {
    const { getByTestId } = render(
      <TagsOperationCodeSection operation={mockOperation} method="GET" endpointPath="/api/v1/users" className="test-class" />
    )
    const codeSectionElement = getByTestId("code-section")
    expect(codeSectionElement).toHaveClass("test-class")
  })
})