import React from "react"
import { cleanup, render, waitFor } from "@testing-library/react"
import { describe, test, expect, vi, beforeEach } from "vitest"
import type { OpenAPI } from "types"
import { TagOperationParametersUnionProps } from "../Types/Union"
import { TagOperationParametersArrayProps } from "../Types/Array"
import { TagOperationParamatersOneOfProps } from "../Types/OneOf"
import { TagOperationParametersObjectProps } from "../Types/Object"
import { TagOperationParametersDefaultProps } from "../Types/Default"

// mock functions
const mockCheckRequired = vi.fn()

// mock components
vi.mock("@/components/Tags/Operation/Parameters/Types/Union", () => ({
  default: ({ schema, isRequired, name }: TagOperationParametersUnionProps) => (
    <div data-testid="union" data-required={isRequired} data-name={name}>{JSON.stringify(schema)}</div>
  ),
}))
vi.mock("@/components/Tags/Operation/Parameters/Types/OneOf", () => ({
  default: ({ schema, isRequired }: TagOperationParamatersOneOfProps) => (
    <div data-testid="one-of" data-required={isRequired}>{JSON.stringify(schema)}</div>
  ),
}))
vi.mock("@/components/Tags/Operation/Parameters/Types/Array", () => ({
  default: ({ schema, isRequired, name }: TagOperationParametersArrayProps) => (
    <div data-testid="array" data-required={isRequired} data-name={name}>{JSON.stringify(schema)}</div>
  ),
}))
vi.mock("@/components/Tags/Operation/Parameters/Types/Object", () => ({
  default: ({ schema, isRequired, name }: TagOperationParametersObjectProps) => (
    <div data-testid="object" data-required={isRequired} data-name={name}>{JSON.stringify(schema)}</div>
  ),
}))
vi.mock("@/components/Tags/Operation/Parameters/Types/Default", () => ({
  default: ({ schema, isRequired, name }: TagOperationParametersDefaultProps) => (
    <div data-testid="default" data-required={isRequired} data-name={name}>{JSON.stringify(schema)}</div>
  ),
}))
vi.mock("@/utils/check-required", () => ({
  default: (schema: OpenAPI.SchemaObject) => mockCheckRequired(schema),
}))
vi.mock("docs-utils", () => ({
  Loading: () => <div data-testid="loading">Loading...</div>,
}))

import TagOperationParameters from ".."

beforeEach(() => {
  vi.clearAllMocks()
  cleanup()
})

describe("rendering", () => {
  test("renders union when schema is anyOf", async () => {
    const modifiedSchema: OpenAPI.SchemaObject = {
      anyOf: [
        { type: "object", properties: {} },
        { type: "string", properties: {} },
      ],
      properties: {},
    }
    const { container } = render(<TagOperationParameters schemaObject={modifiedSchema} />)
    await waitFor(() => {
      const unionElement = container.querySelector("[data-testid='union']")
      expect(unionElement).toBeInTheDocument()
      expect(unionElement).toHaveTextContent(JSON.stringify(modifiedSchema))
    })
  })

  test("renders union when schema is allOf", async () => {
    const modifiedSchema: OpenAPI.SchemaObject = {
      allOf: [
        { type: "object", properties: {} },
        { type: "string", properties: {} },
      ],
      properties: {},
    }
    const { container } = render(<TagOperationParameters schemaObject={modifiedSchema} />)
    await waitFor(() => {
      const unionElement = container.querySelector("[data-testid='union']")
      expect(unionElement).toBeInTheDocument()
      expect(unionElement).toHaveTextContent(JSON.stringify(modifiedSchema))
    })
    expect(container.querySelector("[data-testid='object']")).not.toBeInTheDocument()
    expect(container.querySelector("[data-testid='array']")).not.toBeInTheDocument()
    expect(container.querySelector("[data-testid='default']")).not.toBeInTheDocument()
    expect(container.querySelector("[data-testid='one-of']")).not.toBeInTheDocument()
  })

  test("renders oneOf when schema is oneOf", async () => {
    const modifiedSchema: OpenAPI.SchemaObject = {
      oneOf: [
        { type: "object", properties: {} },
        { type: "string", properties: {} },
      ],
      properties: {},
    }
    const { container } = render(<TagOperationParameters schemaObject={modifiedSchema} />)
    await waitFor(() => {
      const oneOfElement = container.querySelector("[data-testid='one-of']")
      expect(oneOfElement).toBeInTheDocument()
      expect(oneOfElement).toHaveTextContent(JSON.stringify(modifiedSchema))
    })
    expect(container.querySelector("[data-testid='union']")).not.toBeInTheDocument()
    expect(container.querySelector("[data-testid='object']")).not.toBeInTheDocument()
    expect(container.querySelector("[data-testid='array']")).not.toBeInTheDocument()
    expect(container.querySelector("[data-testid='default']")).not.toBeInTheDocument()
  })

  test("renders array when schema is array", async () => {
    const modifiedSchema: OpenAPI.SchemaObject = {
      type: "array",
      items: { type: "string", properties: {} },
      properties: {},
    }
    const { container } = render(<TagOperationParameters schemaObject={modifiedSchema} />)
    await waitFor(() => {
      const arrayElement = container.querySelector("[data-testid='array']")
      expect(arrayElement).toBeInTheDocument()
      expect(arrayElement).toHaveTextContent(JSON.stringify(modifiedSchema))
    })
    expect(container.querySelector("[data-testid='union']")).not.toBeInTheDocument()
    expect(container.querySelector("[data-testid='object']")).not.toBeInTheDocument()
    expect(container.querySelector("[data-testid='one-of']")).not.toBeInTheDocument()
    expect(container.querySelector("[data-testid='default']")).not.toBeInTheDocument()
  })

  test("renders object when schema is object", async () => {
    const modifiedSchema: OpenAPI.SchemaObject = {
      type: "object",
      properties: {
        name: { type: "string", properties: {} },
      },
    }
    const { container } = render(<TagOperationParameters schemaObject={modifiedSchema} />)
    await waitFor(() => {
      const objectElement = container.querySelector("[data-testid='object']")
      expect(objectElement).toBeInTheDocument()
      expect(objectElement).toHaveTextContent(JSON.stringify(modifiedSchema))
    })
    expect(container.querySelector("[data-testid='union']")).not.toBeInTheDocument()
    expect(container.querySelector("[data-testid='one-of']")).not.toBeInTheDocument()
    expect(container.querySelector("[data-testid='array']")).not.toBeInTheDocument()
    expect(container.querySelector("[data-testid='default']")).not.toBeInTheDocument()
  })

  test("renders object when schema's type is undefined", async () => {
    const modifiedSchema: OpenAPI.SchemaObject = {
      type: undefined,
      properties: {}
    }
    const { container } = render(<TagOperationParameters schemaObject={modifiedSchema} />)
    await waitFor(() => {
      const objectElement = container.querySelector("[data-testid='object']")
      expect(objectElement).toBeInTheDocument()
      expect(objectElement).toHaveTextContent(JSON.stringify(modifiedSchema))
    })
    expect(container.querySelector("[data-testid='union']")).not.toBeInTheDocument()
    expect(container.querySelector("[data-testid='one-of']")).not.toBeInTheDocument()
    expect(container.querySelector("[data-testid='array']")).not.toBeInTheDocument()
    expect(container.querySelector("[data-testid='default']")).not.toBeInTheDocument()
  })

  test("renders default when schema is not an anyOf, allOf, oneOf, array, or object", async () => {
    const modifiedSchema: OpenAPI.SchemaObject = {
      type: "string",
      properties: {},
    }
    const { container } = render(<TagOperationParameters schemaObject={modifiedSchema} />)
    await waitFor(() => {
      const defaultElement = container.querySelector("[data-testid='default']")
      expect(defaultElement).toBeInTheDocument()
      expect(defaultElement).toHaveTextContent(JSON.stringify(modifiedSchema))
    })
    expect(container.querySelector("[data-testid='union']")).not.toBeInTheDocument()
    expect(container.querySelector("[data-testid='one-of']")).not.toBeInTheDocument()
    expect(container.querySelector("[data-testid='array']")).not.toBeInTheDocument()
    expect(container.querySelector("[data-testid='object']")).not.toBeInTheDocument()
  })

  test("adds className when provided", async () => {
    const modifiedSchema: OpenAPI.SchemaObject = {
      type: "string",
      properties: {},
    }
    const { container } = render(<TagOperationParameters schemaObject={modifiedSchema} className="test-class" />)
    const parametersElement = container.querySelector("[data-testid='parameters']")
    expect(parametersElement).toBeInTheDocument()
    expect(parametersElement).toHaveClass("test-class")
  })
})

describe("isRequired", () => {
  test("sets parameter as required when isRequired is true", async () => {
    const modifiedSchema: OpenAPI.SchemaObject = {
      type: "string",
      properties: {},
    }
    const { container } = render(<TagOperationParameters schemaObject={modifiedSchema} isRequired={true} />)
    await waitFor(() => {
      const defaultElement = container.querySelector("[data-testid='default']")
      expect(defaultElement).toBeInTheDocument()
      expect(defaultElement).toHaveAttribute("data-required", "true")
    })
  })

  test("sets parameter as required when isRequired is false and checkRequired returns true", async () => {
    const modifiedSchema: OpenAPI.SchemaObject = {
      type: "string",
      properties: {},
    }
    mockCheckRequired.mockReturnValue(true)
    const { container } = render(<TagOperationParameters schemaObject={modifiedSchema} isRequired={false} />)
    await waitFor(() => {
      const defaultElement = container.querySelector("[data-testid='default']")
      expect(defaultElement).toBeInTheDocument()
      expect(defaultElement).toHaveAttribute("data-required", "true")
    })
  })
  
  test("sets parameter as optional when isRequired is false and checkRequired returns false", async () => {
    const modifiedSchema: OpenAPI.SchemaObject = {
      type: "string",
      properties: {},
    }
    mockCheckRequired.mockReturnValue(false)
    const { container } = render(<TagOperationParameters schemaObject={modifiedSchema} isRequired={false} />)
    await waitFor(() => {
      const defaultElement = container.querySelector("[data-testid='default']")
      expect(defaultElement).toBeInTheDocument()
      expect(defaultElement).toHaveAttribute("data-required", "false")
    })
  })
})

describe("parameterName", () => {
  test("sets parameter name to parameterName when provided", async () => {
    const modifiedSchema: OpenAPI.SchemaObject = {
      type: "string",
      properties: {},
      parameterName: "test-name",
    }
    const { container } = render(<TagOperationParameters schemaObject={modifiedSchema} />)
    await waitFor(() => {
      const defaultElement = container.querySelector("[data-testid='default']")
      expect(defaultElement).toBeInTheDocument()
      expect(defaultElement).toHaveAttribute("data-name", "test-name")
    })
  })

  test("sets parameter name to title when parameterName is not provided", async () => {
    const modifiedSchema: OpenAPI.SchemaObject = {
      type: "string",
      properties: {},
      title: "test-title",
    }
    const { container } = render(<TagOperationParameters schemaObject={modifiedSchema} />)
    await waitFor(() => {
      const defaultElement = container.querySelector("[data-testid='default']")
      expect(defaultElement).toBeInTheDocument()
      expect(defaultElement).toHaveAttribute("data-name", "test-title")
    })
  })

  test("sets parameter name to empty string when parameterName is not provided and title is not provided", async () => {
    const modifiedSchema: OpenAPI.SchemaObject = {
      type: "string",
      properties: {},
    }
    const { container } = render(<TagOperationParameters schemaObject={modifiedSchema} />)
    await waitFor(() => {
      const defaultElement = container.querySelector("[data-testid='default']")
      expect(defaultElement).toBeInTheDocument()
      expect(defaultElement).toHaveAttribute("data-name", "")
    })
  })

  test("gives precedence to parameterName over title", async () => {
    const modifiedSchema: OpenAPI.SchemaObject = {
      type: "string",
      properties: {},
      parameterName: "test-name",
      title: "test-title",
    }
    const { container } = render(<TagOperationParameters schemaObject={modifiedSchema} />)
    await waitFor(() => {
      const defaultElement = container.querySelector("[data-testid='default']")
      expect(defaultElement).toBeInTheDocument()
      expect(defaultElement).toHaveAttribute("data-name", "test-name")
    })
  })
})