import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { cleanup, render } from "@testing-library/react"
import { OpenAPI } from "types"
import { TagOperationParametersProps } from "../../../Parameters"

// mock data
const mockResponses: OpenAPI.ResponsesObject = {
  "200": {
    description: "success",
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
}

// mock components
vi.mock("@/components/Tags/Operation/Parameters", () => ({
  default: (props: TagOperationParametersProps) => (
    <div data-testid="parameters" {...props}>
      {Object.entries(props.schemaObject.properties).map(([key, property]) => (
        <div key={key} data-testid={"property"}>
          {key}
        </div>
      ))}
    </div>
  ),
}))
vi.mock("docs-ui", () => ({
  Badge: ({ variant, children }: { variant: string, children: React.ReactNode }) => (
    <div data-testid="badge" data-variant={variant}>{children}</div>
  ),
  DetailsSummary: ({ 
    title,
    badge,
    ...props }: { title: string, [key: string]: any }) => (
    <div data-testid={props["data-testid"]} data-title={title}>
      {title}
      {badge}
    </div>
  ),
  Details: ({
    children,
    summaryElm,
    ...props
  }: { children: React.ReactNode, [key: string]: any }) => (
    <div data-testid={props["data-testid"]}>{summaryElm}{children}</div>
  ),
}))

import TagsOperationDescriptionSectionResponses from ".."

beforeEach(() => {
  vi.clearAllMocks()
  cleanup()
})

describe("rendering", () => {
  test("renders success response with content", () => {
    const { container } = render(
      <TagsOperationDescriptionSectionResponses responses={mockResponses} />
    )
    const successResponse = container.querySelector("[data-testid='response-success']")
    expect(successResponse).toBeInTheDocument()
    const successResponseParameters = container.querySelector("[data-testid='response-success-parameters']")
    expect(successResponseParameters).toBeInTheDocument()
    const successResponseParametersProperties = successResponseParameters!.querySelectorAll("[data-testid='property']")
    expect(successResponseParametersProperties).toHaveLength(1)
    expect(successResponseParametersProperties[0]).toHaveTextContent("name")
    const successResponseBadge = container.querySelector("[data-testid='badge']")
    expect(successResponseBadge).toBeInTheDocument()
    expect(successResponseBadge).toHaveTextContent("Success")
    expect(successResponseBadge).toHaveAttribute("data-variant", "green")
  })

  test("renders error response with content", () => {
    const modifiedResponses: OpenAPI.ResponsesObject = {
      "400": {
        description: "error",
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
    }
    const { container } = render(
      <TagsOperationDescriptionSectionResponses responses={modifiedResponses} />
    )
    const errorResponse = container.querySelector("[data-testid='response-error']")
    expect(errorResponse).toBeInTheDocument()
    const errorResponseParameters = container.querySelector("[data-testid='response-error-parameters']")
    expect(errorResponseParameters).toBeInTheDocument()
    const errorResponseParametersProperties = errorResponseParameters!.querySelectorAll("[data-testid='property']")
    expect(errorResponseParametersProperties).toHaveLength(1)
    expect(errorResponseParametersProperties[0]).toHaveTextContent("name")
    const errorResponseBadge = container.querySelector("[data-testid='badge']")
    expect(errorResponseBadge).toBeInTheDocument()
    expect(errorResponseBadge).toHaveTextContent("Error")
    expect(errorResponseBadge).toHaveAttribute("data-variant", "red")
  })

  test("renders empty success response", () => {
    const modifiedResponses: OpenAPI.ResponsesObject = {
      "204": {
        description: "empty",
        content: {},
      },
    }
    const { container } = render(
      <TagsOperationDescriptionSectionResponses responses={modifiedResponses} />
    )
    const emptyResponse = container.querySelector("[data-testid='response-empty']")
    expect(emptyResponse).toBeInTheDocument()
    const emptyResponseBadge = container.querySelector("[data-testid='badge']")
    expect(emptyResponseBadge).toBeInTheDocument()
    expect(emptyResponseBadge).toHaveTextContent("Success")
    expect(emptyResponseBadge).toHaveAttribute("data-variant", "green")
  })

  test("renders empty error response", () => {
    const modifiedResponses: OpenAPI.ResponsesObject = {
      "400": {
        description: "empty",
        content: {},
      },
    }
    const { container } = render(
      <TagsOperationDescriptionSectionResponses responses={modifiedResponses} />
    )
    const emptyResponse = container.querySelector("[data-testid='response-empty']")
    expect(emptyResponse).toBeInTheDocument()
    const emptyResponseBadge = container.querySelector("[data-testid='badge']")
    expect(emptyResponseBadge).toBeInTheDocument()
    expect(emptyResponseBadge).toHaveTextContent("Error")
    expect(emptyResponseBadge).toHaveAttribute("data-variant", "red")
  })
})