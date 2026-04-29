import React from "react"
import { cleanup, render, waitFor } from "@testing-library/react"
import { describe, test, expect, vi, beforeEach } from "vitest"
import type { OpenAPI } from "types"
import { TagOperationParametersObjectProps } from "../../Object"
import { TagOperationParametersDefaultProps } from "../../Default"

// mock data
const mockAnyOfSchema: OpenAPI.SchemaObject = {
  anyOf: [
    { type: "object", properties: {
      name: { type: "string", properties: {} },
    } },
    { type: "string", properties: {} },
  ],
  properties: {}
}

const mockAllOfSchema: OpenAPI.SchemaObject = {
  allOf: [
    { type: "object", properties: {
      name: { type: "string", properties: {} },
    } },
    { type: "string", properties: {} },
  ],
  properties: {}
}

// mock functions
const mockMergeAllOfTypes = vi.fn((schema: OpenAPI.SchemaObject) => schema.allOf?.[0])

// mock components
vi.mock("@/components/Tags/Operation/Parameters/Types/Object", () => ({
  default: ({ schema }: TagOperationParametersObjectProps) => (
    <div data-testid="object" data-description={schema.description}>{JSON.stringify(schema)}</div>
  ),
}))
vi.mock("@/components/Tags/Operation/Parameters/Types/Default", () => ({
  default: ({ schema }: TagOperationParametersDefaultProps) => (
    <div data-testid="default">{JSON.stringify(schema)}</div>
  ),
}))

vi.mock("docs-ui", () => ({
  Loading: () => <div data-testid="loading">Loading...</div>,
}))

vi.mock("@/utils/merge-all-of-types", () => ({
  default: (schema: OpenAPI.SchemaObject) => mockMergeAllOfTypes(schema),
}))

import TagOperationParametersUnion from ".."

beforeEach(() => {
  vi.clearAllMocks()
  cleanup()
})

describe("rendering", () => {
  test("renders default when schema is not an anyOf or allOf type", async () => {
    const modifiedSchema: OpenAPI.SchemaObject = {
      type: "object",
      properties: {
        name: { type: "string", properties: {} },
      },
    }
    const { container } = render(<TagOperationParametersUnion name="test-name" schema={modifiedSchema} />)
    await waitFor(() => {
      const defaultElement = container.querySelector("[data-testid='default']")
      expect(defaultElement).toBeInTheDocument()
      expect(defaultElement).toHaveTextContent(JSON.stringify(modifiedSchema))
    })
  })

  test("renders default when schema is any of and type is not object", async () => {
    const modifiedSchema: OpenAPI.SchemaObject = {
      anyOf: [
        { type: "string", properties: {} },
      ],
      properties: {}
    }
    const { container } = render(<TagOperationParametersUnion name="test-name" schema={modifiedSchema} />)
    await waitFor(() => {
      const defaultElement = container.querySelector("[data-testid='default']")
      expect(defaultElement).toBeInTheDocument()
      expect(defaultElement).toHaveTextContent(JSON.stringify(modifiedSchema))
    })
  })

  test("renders default when schema is any of and type is object and properties is not defined", async () => {
    const modifiedSchema: OpenAPI.SchemaObject = {
      anyOf: [
        { type: "object", properties: {} },
      ],
      properties: {}
    }
    const { container } = render(<TagOperationParametersUnion name="test-name" schema={modifiedSchema} />)
    await waitFor(() => {
      const defaultElement = container.querySelector("[data-testid='default']")
      expect(defaultElement).toBeInTheDocument()
      expect(defaultElement).toHaveTextContent(JSON.stringify(modifiedSchema))
    })
  })

  test("renders any of type schema", async () => {
    const { container } = render(<TagOperationParametersUnion name="test-name" schema={mockAnyOfSchema} />)
    await waitFor(() => {
      const objectElement = container.querySelector("[data-testid='object']")
      expect(objectElement).toBeInTheDocument()
      expect(objectElement).toHaveTextContent(JSON.stringify(mockAnyOfSchema.anyOf![0]))
    })
  })

  test("renders all of type schema", async () => {
    const { container } = render(<TagOperationParametersUnion name="test-name" schema={mockAllOfSchema} />)
    await waitFor(() => {
      const objectElement = container.querySelector("[data-testid='object']")
      expect(objectElement).toBeInTheDocument()
      expect(objectElement).toHaveTextContent(JSON.stringify(mockAllOfSchema.allOf![0]))
    })
    expect(mockMergeAllOfTypes).toHaveBeenCalledWith(mockAllOfSchema)
  })

  test("renders schema description from selected object schema when provided", async () => {
    const modifiedSchema: OpenAPI.SchemaObject = {
      anyOf: [
        { ...mockAllOfSchema.allOf![0], description: "test-description 1" },
        { ...mockAllOfSchema.allOf![1], description: "test-description 2" },
      ],
      properties: {},
    }
    const { container } = render(<TagOperationParametersUnion name="test-name" schema={modifiedSchema} />)
    await waitFor(() => {
      const objectElement = container.querySelector("[data-testid='object']")
      expect(objectElement).toBeInTheDocument()
      expect(objectElement).toHaveAttribute("data-description", "test-description 1")
    })
  })

  test("renders schema description from any item having description when selected object doesn't have description", async () => {
    const modifiedSchema: OpenAPI.SchemaObject = {
      anyOf: [
        { ...mockAllOfSchema.allOf![0] },
        { ...mockAllOfSchema.allOf![1], description: "test-description" },
      ],
      properties: {},
    }
    const { container } = render(<TagOperationParametersUnion name="test-name" schema={modifiedSchema} />)
    await waitFor(() => {
      const objectElement = container.querySelector("[data-testid='object']")
      expect(objectElement).toBeInTheDocument()
      expect(objectElement).toHaveAttribute("data-description", "test-description")
    })
  })
})