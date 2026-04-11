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
      }
    },
  },
}

// mock components
vi.mock("docs-ui", () => ({
  Badge: ({ variant, children }: { variant: string, children: React.ReactNode }) => (
    <div data-testid="badge" data-variant={variant}>{children}</div>
  ),
}))
vi.mock("@/components/Tags/Operation/CodeSection/Responses/Sample", () => ({
  default: () => <div data-testid="sample">Sample</div>,
}))

import TagsOperationCodeSectionResponses from ".."

beforeEach(() => {
  vi.clearAllMocks()
  cleanup()
})

describe("rendering", () => {
  test("renders response code badge", () => {
    const { getByTestId } = render(
      <TagsOperationCodeSectionResponses operation={mockOperation} />
    )
    const badgeElement = getByTestId("badge")
    expect(badgeElement).toBeInTheDocument()
    expect(badgeElement).toHaveTextContent("200")
    expect(badgeElement).toHaveAttribute("data-variant", "green")
  })

  test("doesn't render when no response is available", () => {
    const mockOperation: OpenAPI.Operation = {
      operationId: "mockOperation",
      summary: "Mock Operation",
      description: "Mock Operation",
      "x-authenticated": false,
      "x-codeSamples": [],
      requestBody: {
        content: {},
      },
      parameters: [],
      responses: {},
    }
    const { container } = render(
      <TagsOperationCodeSectionResponses operation={mockOperation} />
    )
    expect(container).toBeEmptyDOMElement()
  })

  test("renders sample component", () => {
    const { getByTestId } = render(
      <TagsOperationCodeSectionResponses operation={mockOperation} />
    )
    const sampleElement = getByTestId("sample")
    expect(sampleElement).toBeInTheDocument()
    expect(sampleElement).toHaveTextContent("Sample")
  })
})