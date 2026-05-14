import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { cleanup, render, waitFor } from "@testing-library/react"
import { OpenAPI } from "types"
import { TagOperationParametersDefaultProps } from "../../Default"
import { TagOperationParametersProps } from "../../.."

// mock functions
const mockCheckRequired = vi.fn()

// mock components
vi.mock("@/components/Tags/Operation/Parameters/Types/Default", () => ({
  default: ({ schema }: TagOperationParametersDefaultProps) => (
    <div data-testid="default">{JSON.stringify(schema)}</div>
  ),
}))
vi.mock("@/components/Tags/Operation/Parameters/Nested", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="nested">{children}</div>
  ),
}))
vi.mock("docs-ui", () => ({
  Loading: () => <div data-testid="loading">Loading...</div>,
  Details: ({ children, summaryElm }: { children: React.ReactNode, summaryElm: React.ReactNode }) => (
    <div data-testid="details">
      <div data-testid="summary">{summaryElm}</div>
      <div data-testid="content">{children}</div>
    </div>
  ),
}))
vi.mock("@/components/Tags/Operation/Parameters", () => ({
  default: ({ schemaObject, isRequired, isExpanded }: TagOperationParametersProps) => (
    <div data-testid="parameters">
      {JSON.stringify(schemaObject)} {isRequired ? "required" : "optional"}
    </div>
  ),
}))
vi.mock("@/utils/check-required", () => ({
  default: (schema: OpenAPI.SchemaObject, property: string) => mockCheckRequired(schema, property),
}))

import TagsOperationParametersObject from ".."

beforeEach(() => {
  vi.clearAllMocks()
  cleanup()
})

describe("rendering", () => {
  test("does not render when schema is not an object", () => {
    const modifiedSchema: OpenAPI.SchemaObject = {
      type: "array",
      items: { type: "string", properties: {} },
      properties: {},
    }
    const { container } = render(<TagsOperationParametersObject schema={modifiedSchema} />)
    expect(container).toBeEmptyDOMElement()
  })

  test("does not render when schema type is undefined", () => {
    const modifiedSchema: OpenAPI.SchemaObject = {
      type: undefined,
      properties: {},
    }
    const { container } = render(<TagsOperationParametersObject schema={modifiedSchema} />)
    expect(container).toBeEmptyDOMElement()
  })

  test("does not render when properties is empty and additionalProperties is empty and name is not provided", () => {
    const modifiedSchema: OpenAPI.SchemaObject = {
      type: "object",
      properties: {},
      additionalProperties: undefined,
    }
    const { container } = render(<TagsOperationParametersObject schema={modifiedSchema} />)
    expect(container).toBeEmptyDOMElement()
  })
  
  test("renders description only when properties is empty and additionalProperties is empty and name is provided", async () => {
    const modifiedSchema: OpenAPI.SchemaObject = {
      type: "object",
      properties: {},
      additionalProperties: undefined,
    }
    const { container } = render(<TagsOperationParametersObject schema={modifiedSchema} name="test-name" />)
    await waitFor(() => {
      const defaultElement = container.querySelector("[data-testid='default']")
      expect(defaultElement).toBeInTheDocument()
      expect(defaultElement).toHaveTextContent("object")
      const parametersElement = container.querySelector("[data-testid='parameters']")
      expect(parametersElement).not.toBeInTheDocument()
    })
  })

  test("renders parameters only when topLevel is true", async () => {
    const modifiedSchema: OpenAPI.SchemaObject = {
      type: "object",
      properties: {
        name: { type: "string", properties: {} },
      },
    }
    const { container } = render(<TagsOperationParametersObject schema={modifiedSchema} topLevel={true} />)
    await waitFor(() => {
      const parametersElement = container.querySelector("[data-testid='parameters']")
      expect(parametersElement).toBeInTheDocument()
      expect(parametersElement).toHaveTextContent(JSON.stringify({
        type: "string",
        properties: {},
        parameterName: "name",
      }))
      const nestedElement = container.querySelector("[data-testid='nested']")
      expect(nestedElement).not.toBeInTheDocument()
      const detailsElement = container.querySelector("[data-testid='details']")
      expect(detailsElement).not.toBeInTheDocument()
    })
  })

  test("renders description and properties when properties is not empty", async () => {
    const modifiedSchema: OpenAPI.SchemaObject = {
      type: "object",
      properties: {
        name: { type: "string", properties: {} },
      },
    }
    const { container } = render(<TagsOperationParametersObject schema={modifiedSchema} />)
    await waitFor(() => {
      const descriptionElement = container.querySelector("[data-testid='default']")
      expect(descriptionElement).toBeInTheDocument()
      expect(descriptionElement).toHaveTextContent(JSON.stringify(modifiedSchema))
      const parametersElement = container.querySelector("[data-testid='parameters']")
      expect(parametersElement).toBeInTheDocument()
      expect(parametersElement).toHaveTextContent(JSON.stringify({
        type: "string",
        properties: {},
        parameterName: "name",
      }))
      const nestedElement = container.querySelector("[data-testid='nested']")
      expect(nestedElement).toBeInTheDocument()
    })
  })

  test("renders description and properties when additionalProperties is not empty", async () => {
    const modifiedSchema: OpenAPI.SchemaObject = {
      type: "object",
      properties: {},
      additionalProperties: { type: "object", properties: {
        name: { type: "string", properties: {} },
      } },
    }
    const { container } = render(<TagsOperationParametersObject schema={modifiedSchema} />)
    await waitFor(() => {
      const descriptionElement = container.querySelector("[data-testid='default']")
      expect(descriptionElement).toBeInTheDocument()
      expect(descriptionElement).toHaveTextContent("object")
    })
  })

  test("renders description in summary when isExpanded is true", async () => {
    const modifiedSchema: OpenAPI.SchemaObject = {
      type: "object",
      properties: {
        name: { type: "string", properties: {} },
      },
    }
    const { container } = render(<TagsOperationParametersObject schema={modifiedSchema} isExpanded={true} />)
    await waitFor(() => {
      const summaryElement = container.querySelector("summary")
      expect(summaryElement).toBeInTheDocument()
      const descriptionElement = summaryElement?.querySelector("[data-testid='default']")
      expect(descriptionElement).toBeInTheDocument()
      expect(descriptionElement).toHaveTextContent("object")
    })
  })
})

describe("parameters rendering", () => {
  test("renders parameters when not empty", async () => {
    const modifiedSchema: OpenAPI.SchemaObject = {
      type: "object",
      properties: {
        name: { type: "string", properties: {} },
      },
    }
    const { container } = render(<TagsOperationParametersObject schema={modifiedSchema} />)
    await waitFor(() => {
      const parametersElement = container.querySelector("[data-testid='parameters']")
      expect(parametersElement).toBeInTheDocument()
      expect(parametersElement).toHaveTextContent(JSON.stringify({
        type: "string",
        properties: {},
        parameterName: "name",
      }))
    })
  })

  test("renders parameters when additionalProperties is not empty", async () => {
    const modifiedSchema: OpenAPI.SchemaObject = {
      type: "object",
      properties: {},
      additionalProperties: { type: "object", properties: {
        name: { type: "string", properties: {} },
      } },
    }
    const { container } = render(<TagsOperationParametersObject schema={modifiedSchema} />)
    await waitFor(() => {
      const parametersElement = container.querySelector("[data-testid='parameters']")
      expect(parametersElement).toBeInTheDocument()
      expect(parametersElement).toHaveTextContent(JSON.stringify({
        type: "string",
        properties: {},
        parameterName: "name",
      }))
    })
  })

  test("gives precedence to properties over additionalProperties", async () => {
    const modifiedSchema: OpenAPI.SchemaObject = {
      type: "object",
      properties: {
        name: { type: "string", properties: {} },
      },
      additionalProperties: { type: "number", properties: {} },
    }
    const { container } = render(<TagsOperationParametersObject schema={modifiedSchema} />)
    await waitFor(() => {
      const parametersElement = container.querySelector("[data-testid='parameters']")
      expect(parametersElement).toBeInTheDocument()
      expect(parametersElement).toHaveTextContent(JSON.stringify({
        type: "string",
        properties: {},
        parameterName: "name",
      }))
    })
  })

  test("sorts properties to show required fields first", async () => {
    mockCheckRequired.mockReturnValue(false)
    const modifiedSchema: OpenAPI.SchemaObject = {
      type: "object",
      properties: {
        name: { type: "string", properties: {}, isRequired: false },
        age: { type: "number", properties: {}, isRequired: true },
      },
    }
    const { container } = render(<TagsOperationParametersObject schema={modifiedSchema} />)
    await waitFor(() => {
      const parametersElement = container.querySelectorAll("[data-testid='parameters']")
      expect(parametersElement).toHaveLength(2)
      expect(parametersElement[0]).toHaveTextContent(JSON.stringify({
        type: "number",
        properties: {},
        isRequired: true,
        parameterName: "age",
      }))
      expect(parametersElement[1]).toHaveTextContent(JSON.stringify({
        type: "string",
        properties: {},
        isRequired: false,
        parameterName: "name",
      }))
    })
  })

  test("adds hr between properties", async () => {
    const modifiedSchema: OpenAPI.SchemaObject = {
      type: "object",
      properties: {
        name: { type: "string", properties: {} },
        age: { type: "number", properties: {} },
      },
    }
    const { container } = render(<TagsOperationParametersObject schema={modifiedSchema} />)
    await waitFor(() => {
      const hrElements = container.querySelectorAll("hr")
      expect(hrElements).toHaveLength(1)
      expect(hrElements[0]).toBeInTheDocument()
      expect(hrElements[0]).toHaveClass("bg-medusa-border-base my-0")
    })
  })

  test("renders property as required when the property's isRequired is true", async () => {
    const modifiedSchema: OpenAPI.SchemaObject = {
      type: "object",
      properties: {
        name: { type: "string", properties: {}, isRequired: true },
      },
    }
    const { container } = render(<TagsOperationParametersObject schema={modifiedSchema} />)
    await waitFor(() => {
      const parametersElement = container.querySelector("[data-testid='parameters']")
      expect(parametersElement).toBeInTheDocument()
      expect(parametersElement).toHaveTextContent("required")
    })
  })

  test("renders property as required when property's isRequired is true and checkRequired returns true", async () => {
    const modifiedSchema: OpenAPI.SchemaObject = {
      type: "object",
      properties: {
        name: { type: "string", properties: {}, isRequired: true },
      },
    }
    mockCheckRequired.mockReturnValue(true)
    const { container } = render(<TagsOperationParametersObject schema={modifiedSchema} />)
    await waitFor(() => {
      const parametersElement = container.querySelector("[data-testid='parameters']")
      expect(parametersElement).toBeInTheDocument()
      expect(parametersElement).toHaveTextContent("required")
    })
  })

  test("renders property as optional when the property's isRequired is false and checkRequired returns false", async () => {
    const modifiedSchema: OpenAPI.SchemaObject = {
      type: "object",
      properties: {
        name: { type: "string", properties: {}, isRequired: false },
      },
    }
    mockCheckRequired.mockReturnValue(false)
    const { container } = render(<TagsOperationParametersObject schema={modifiedSchema} />)
    await waitFor(() => {
      const parametersElement = container.querySelector("[data-testid='parameters']")
      expect(parametersElement).toBeInTheDocument()
      expect(parametersElement).toHaveTextContent("optional")
    })
  })
})