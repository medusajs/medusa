import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { cleanup, render } from "@testing-library/react"
import { OpenAPI } from "types"
import { BadgeProps, ExpandableNoticeProps, FeatureFlagNoticeProps } from "docs-ui"

// mock data
const mockName = "test-name"
const mockSchema: OpenAPI.SchemaObject = {
  type: "object",
  properties: {
    name: { type: "string", properties: {} },
  },
}

// mock components
vi.mock("docs-ui", () => ({
  Badge: ({ variant, children, className }: BadgeProps) => (
    <div data-testid="badge" className={className}>{children}</div>
  ),
  ExpandableNotice: ({ type, link }: ExpandableNoticeProps) => (
    <div data-testid="expandable-notice" data-type={type} data-link={link}>
      Expandable Notice
    </div>
  ),
  FeatureFlagNotice: ({ featureFlag, type }: FeatureFlagNoticeProps) => (
    <div data-testid="feature-flag-notice" data-feature-flag={featureFlag} data-type={type}>
      Feature Flag Notice
    </div>
  ),
}))

import TagOperationParametersName from ".."

beforeEach(() => {
  vi.clearAllMocks()
  cleanup()
})

describe("rendering", () => {
  test("renders name", () => {
    const { container } = render(
      <TagOperationParametersName name={mockName} isRequired={false} schema={mockSchema} />
    )
    const nameElement = container.querySelector("[data-testid='name']")
    expect(nameElement).toBeInTheDocument()
    expect(nameElement).toHaveTextContent(mockName)
  })

  test("renders deprecated badge when schema is deprecated", () => {
    const modifiedSchema: OpenAPI.SchemaObject = {
      ...mockSchema,
      deprecated: true,
    }
    const { container } = render(
      <TagOperationParametersName name={mockName} isRequired={false} schema={modifiedSchema} />
    )
    const badgeElement = container.querySelector("[data-testid='badge']")
    expect(badgeElement).toBeInTheDocument()
    expect(badgeElement).toHaveTextContent("deprecated")
  })
  
  test("renders expandable notice when schema is expandable", () => {
    const modifiedSchema: OpenAPI.SchemaObject = {
      ...mockSchema,
      "x-expandable": "expanding-relations",
    }
    const { container } = render(
      <TagOperationParametersName name={mockName} isRequired={false} schema={modifiedSchema} />
    )
    const expandableNoticeElement = container.querySelector("[data-testid='expandable-notice']")
    expect(expandableNoticeElement).toBeInTheDocument()
    expect(expandableNoticeElement).toHaveTextContent("Expandable Notice")
    expect(expandableNoticeElement).toHaveAttribute("data-type", "request")
    expect(expandableNoticeElement).toHaveAttribute("data-link", "#expanding-relations")
  })
  
  test("renders feature flag notice when schema has a feature flag", () => {
    const modifiedSchema: OpenAPI.SchemaObject = {
      ...mockSchema,
      "x-featureFlag": "test-feature-flag",
    }
    const { container } = render(
      <TagOperationParametersName name={mockName} isRequired={false} schema={modifiedSchema} />
    )
    const featureFlagNoticeElement = container.querySelector("[data-testid='feature-flag-notice']")
    expect(featureFlagNoticeElement).toBeInTheDocument()
    expect(featureFlagNoticeElement).toHaveTextContent("Feature Flag Notice")
    expect(featureFlagNoticeElement).toHaveAttribute("data-feature-flag", "test-feature-flag")
    expect(featureFlagNoticeElement).toHaveAttribute("data-type", "type")
  })
  
  test("renders optional span when schema is not required", () => {
    const { container } = render(
      <TagOperationParametersName name={mockName} isRequired={false} schema={mockSchema} />
    )
    const optionalElement = container.querySelector("[data-testid='optional']")
    expect(optionalElement).toBeInTheDocument()
    expect(optionalElement).toHaveTextContent("optional")
  })

  test("does not render deprecated badge when schema is not deprecated", () => {
    const { container } = render(
      <TagOperationParametersName name={mockName} isRequired={false} schema={mockSchema} />
    )
    const badgeElement = container.querySelector("[data-testid='badge']")
    expect(badgeElement).not.toBeInTheDocument()
  })
})

describe("object type schema description formatting", () => {
  test("formats description for object type schema without title and no nullable", () => {
    const { container } = render(
      <TagOperationParametersName name={mockName} isRequired={false} schema={mockSchema} />
    )
    const typeDescriptionElement = container.querySelector("[data-testid='type-description']")
    expect(typeDescriptionElement).toBeInTheDocument()
    expect(typeDescriptionElement).toHaveTextContent("object")
  })

  test("formats description for object type schema with title and no nullable", () => {
    const modifiedSchema: OpenAPI.SchemaObject = {
      ...mockSchema,
      title: "test-title",
    }
    const { container } = render(
      <TagOperationParametersName name={mockName} isRequired={false} schema={modifiedSchema} />
    )
    const typeDescriptionElement = container.querySelector("[data-testid='type-description']")
    expect(typeDescriptionElement).toBeInTheDocument()
    expect(typeDescriptionElement).toHaveTextContent("object (test-title)")
  })

  test("formats description for object type schema with no title and nullable", () => {
    const modifiedSchema: OpenAPI.SchemaObject = {
      ...mockSchema,
      nullable: true,
    }
    const { container } = render(
      <TagOperationParametersName name={mockName} isRequired={false} schema={modifiedSchema} />
    )
    const typeDescriptionElement = container.querySelector("[data-testid='type-description']")
    expect(typeDescriptionElement).toBeInTheDocument()
    expect(typeDescriptionElement).toHaveTextContent("object or null")
  })

  test("formats description for object type schema with title and nullable", () => {
    const modifiedSchema: OpenAPI.SchemaObject = {
      ...mockSchema,
      title: "test-title",
      nullable: true,
    }
    const { container } = render(
      <TagOperationParametersName name={mockName} isRequired={false} schema={modifiedSchema} />
    )
    const typeDescriptionElement = container.querySelector("[data-testid='type-description']")
    expect(typeDescriptionElement).toBeInTheDocument()
    expect(typeDescriptionElement).toHaveTextContent("object (test-title) or null")
  })
})

describe("array type schema description formatting", () => {
  test("formats description for array type schema with no items and not nullable", () => {
    const arraySchema: OpenAPI.ArraySchemaObject = {
      type: "array",
      // @ts-expect-error - we are testing the case where items is undefined
      items: undefined,
    }
    const { container } = render(
      <TagOperationParametersName name={mockName} isRequired={false} schema={arraySchema as OpenAPI.SchemaObject} />
    )
    const typeDescriptionElement = container.querySelector("[data-testid='type-description']")
    expect(typeDescriptionElement).toBeInTheDocument()
    expect(typeDescriptionElement).toHaveTextContent("Array")
  })

  test("formats description for array type schema with no items and nullable", () => {
    const arraySchema: OpenAPI.ArraySchemaObject = {
      type: "array",
      // @ts-expect-error - we are testing the case where items is undefined
      items: undefined,
      nullable: true,
    }
    const { container } = render(
      <TagOperationParametersName name={mockName} isRequired={false} schema={arraySchema as OpenAPI.SchemaObject} />
    )
    const typeDescriptionElement = container.querySelector("[data-testid='type-description']")
    expect(typeDescriptionElement).toBeInTheDocument()
    expect(typeDescriptionElement).toHaveTextContent("Array or null")
  })

  test("formats description for array with object items (with title) and not nullable", () => {
    const arraySchema: OpenAPI.ArraySchemaObject = {
      type: "array",
      items: {
        type: "object",
        title: "test-title",
        properties: {}
      },
      properties: {},
    }
    const { container } = render(
      <TagOperationParametersName name={mockName} isRequired={false} schema={arraySchema as OpenAPI.SchemaObject} />
    )
    const typeDescriptionElement = container.querySelector("[data-testid='type-description']")
    expect(typeDescriptionElement).toBeInTheDocument()
    expect(typeDescriptionElement).toHaveTextContent("Array of objects (test-title)")
  })

  test("formats description for array with object items (with title) and nullable", () => {
    const arraySchema: OpenAPI.ArraySchemaObject = {
      type: "array",
      items: {
        type: "object",
        title: "test-title",
        properties: {},
      },
      properties: {},
      nullable: true,
    }

    const { container } = render(
      <TagOperationParametersName name={mockName} isRequired={false} schema={arraySchema as OpenAPI.SchemaObject} />
    )
    const typeDescriptionElement = container.querySelector("[data-testid='type-description']")
    expect(typeDescriptionElement).toBeInTheDocument()
    expect(typeDescriptionElement).toHaveTextContent("Array of objects (test-title) or null")
  })

  test("formats description for array with object items (without title) and not nullable", () => {
    const arraySchema: OpenAPI.ArraySchemaObject = {
      type: "array",
      items: {
        type: "object",
        properties: {},
      },
      properties: {},
    }
    const { container } = render(
      <TagOperationParametersName name={mockName} isRequired={false} schema={arraySchema as OpenAPI.SchemaObject} />
    )
    const typeDescriptionElement = container.querySelector("[data-testid='type-description']")
    expect(typeDescriptionElement).toBeInTheDocument()
    expect(typeDescriptionElement).toHaveTextContent("Array of objects")
  })

  test("formats description for array with object items (without title) and nullable", () => {
    const arraySchema: OpenAPI.ArraySchemaObject = {
      type: "array",
      items: {
        type: "object",
        properties: {},
      },
      properties: {},
      nullable: true,
    }
    const { container } = render(
      <TagOperationParametersName name={mockName} isRequired={false} schema={arraySchema as OpenAPI.SchemaObject} />
    )
    const typeDescriptionElement = container.querySelector("[data-testid='type-description']")
    expect(typeDescriptionElement).toBeInTheDocument()
    expect(typeDescriptionElement).toHaveTextContent("Array of objects or null")
  })

  test("formats description for array with any items and not nullable", () => {
    const arraySchema: OpenAPI.ArraySchemaObject = {
      type: "array",
      items: {
        type: "string",
        properties: {},
      },
      properties: {},
    }
    const { container } = render(
      <TagOperationParametersName name={mockName} isRequired={false} schema={arraySchema as OpenAPI.SchemaObject} />
    )
    const typeDescriptionElement = container.querySelector("[data-testid='type-description']")
    expect(typeDescriptionElement).toBeInTheDocument()
    expect(typeDescriptionElement).toHaveTextContent("Array of strings")
  })

  test("formats description for array with any items and nullable", () => {
    const arraySchema: OpenAPI.ArraySchemaObject = {
      type: "array",
      items: {
        type: "string",
        properties: {},
      },
      properties: {},
      nullable: true,
    }
    const { container } = render(
      <TagOperationParametersName name={mockName} isRequired={false} schema={arraySchema as OpenAPI.SchemaObject} />
    )
    const typeDescriptionElement = container.querySelector("[data-testid='type-description']")
    expect(typeDescriptionElement).toBeInTheDocument()
    expect(typeDescriptionElement).toHaveTextContent("Array of strings or null")
  })

  test("formats description for array with items of no type and not nullable", () => {
    const arraySchema: OpenAPI.ArraySchemaObject = {
      type: "array",
      items: {
        properties: {},
      },
      properties: {},
    }
    const { container } = render(
      <TagOperationParametersName name={mockName} isRequired={false} schema={arraySchema as OpenAPI.SchemaObject} />
    )
    const typeDescriptionElement = container.querySelector("[data-testid='type-description']")
    expect(typeDescriptionElement).toBeInTheDocument()
    expect(typeDescriptionElement).toHaveTextContent("Array of objects")
  })

  test("formats description for array with items of no type and nullable", () => {
    const arraySchema: OpenAPI.ArraySchemaObject = {
      type: "array",
      items: {
        properties: {},
      },
      properties: {},
      nullable: true,
    }
    const { container } = render(
      <TagOperationParametersName name={mockName} isRequired={false} schema={arraySchema as OpenAPI.SchemaObject} />
    )
    const typeDescriptionElement = container.querySelector("[data-testid='type-description']")
    expect(typeDescriptionElement).toBeInTheDocument()
    expect(typeDescriptionElement).toHaveTextContent("Array of objects or null")
  })
})

describe("union type schema description formatting", () => {
  test("formats description for union type schema with allOf and not nullable", () => {
    const unionSchema: OpenAPI.SchemaObject = {
      allOf: [
        { type: "object", properties: {} },
        { type: "string", properties: {} },
      ],
      properties: {},
    }
    const { container } = render(
      <TagOperationParametersName name={mockName} isRequired={false} schema={unionSchema} />
    )
    const typeDescriptionElement = container.querySelector("[data-testid='type-description']")
    expect(typeDescriptionElement).toBeInTheDocument()
    expect(typeDescriptionElement).toHaveTextContent("object or string")
  })

  test("formats description for union type schema with allOf and nullable", () => {
    const unionSchema: OpenAPI.SchemaObject = {
      allOf: [
        { type: "object", properties: {} },
        { type: "string", properties: {} },
      ],
      properties: {},
      nullable: true,
    }

    const { container } = render(
      <TagOperationParametersName name={mockName} isRequired={false} schema={unionSchema} />
    )
    const typeDescriptionElement = container.querySelector("[data-testid='type-description']")
    expect(typeDescriptionElement).toBeInTheDocument()
    expect(typeDescriptionElement).toHaveTextContent("object or string or null")
  })

  test("formats description for union type schema with anyOf and not nullable", () => {
    const unionSchema: OpenAPI.SchemaObject = {
      anyOf: [
        { type: "object", properties: {} },
        { type: "string", properties: {} },
      ],
      properties: {},
    }

    const { container } = render(
      <TagOperationParametersName name={mockName} isRequired={false} schema={unionSchema} />
    )
    const typeDescriptionElement = container.querySelector("[data-testid='type-description']")
    expect(typeDescriptionElement).toBeInTheDocument()
    expect(typeDescriptionElement).toHaveTextContent("object or string")
  })

  test("formats description for union type schema with anyOf and nullable", () => {
    const unionSchema: OpenAPI.SchemaObject = {
      anyOf: [
        { type: "object", properties: {} },
        { type: "string", properties: {} },
      ],
      properties: {},
      nullable: true,
    }

    const { container } = render(
      <TagOperationParametersName name={mockName} isRequired={false} schema={unionSchema} />
    )
    const typeDescriptionElement = container.querySelector("[data-testid='type-description']")
    expect(typeDescriptionElement).toBeInTheDocument()
    expect(typeDescriptionElement).toHaveTextContent("object or string or null")
  })
  
  test("formats description for union type schema with same types and not nullable", () => {
    const unionSchema: OpenAPI.SchemaObject = {
      anyOf: [
        { type: "object", properties: {} },
        { type: "object", properties: {} },
      ],
      properties: {},
      nullable: true,
    }

    const { container } = render(
      <TagOperationParametersName name={mockName} isRequired={false} schema={unionSchema} />
    )
    const typeDescriptionElement = container.querySelector("[data-testid='type-description']")
    expect(typeDescriptionElement).toBeInTheDocument()
    expect(typeDescriptionElement).toHaveTextContent("object")
  })

  test("formats description for union type schema with same types and nullable", () => {
    const unionSchema: OpenAPI.SchemaObject = {
      anyOf: [
        { type: "object", properties: {} },
        { type: "object", properties: {} },
      ],
      properties: {},
      nullable: true,
    }
    const { container } = render(
      <TagOperationParametersName name={mockName} isRequired={false} schema={unionSchema} />
    )
    const typeDescriptionElement = container.querySelector("[data-testid='type-description']")
    expect(typeDescriptionElement).toBeInTheDocument()
    expect(typeDescriptionElement).toHaveTextContent("object or null")
  })

  test("gives precedence to allOf over anyOf", () => {
    const unionSchema: OpenAPI.SchemaObject = {
      allOf: [
        { type: "object", properties: {} },
      ],
      anyOf: [
        { type: "string", properties: {} },
      ],
      properties: {},
    }

    const { container } = render(
      <TagOperationParametersName name={mockName} isRequired={false} schema={unionSchema} />
    )
    const typeDescriptionElement = container.querySelector("[data-testid='type-description']")
    expect(typeDescriptionElement).toBeInTheDocument()
    expect(typeDescriptionElement).toHaveTextContent("object")
    expect(typeDescriptionElement).not.toHaveTextContent("string")
  })
})

describe("oneOf type schema description formatting", () => {
  test("formats description for oneOf type schema with one item (without title) and not nullable", () => {
    const oneOfSchema: OpenAPI.SchemaObject = {
      oneOf: [
        { type: "object", properties: {} },
      ],
      properties: {},
    }
    const { container } = render(
      <TagOperationParametersName name={mockName} isRequired={false} schema={oneOfSchema} />
    )
    const typeDescriptionElement = container.querySelector("[data-testid='type-description']")
    expect(typeDescriptionElement).toBeInTheDocument()
    expect(typeDescriptionElement).toHaveTextContent("object")
  })

  test("formats description for oneOf type schema with one item (without title) and nullable", () => {
    const oneOfSchema: OpenAPI.SchemaObject = {
      oneOf: [
        { type: "object", properties: {} },
      ],
      properties: {},
      nullable: true,
    }
    const { container } = render(
      <TagOperationParametersName name={mockName} isRequired={false} schema={oneOfSchema} />
    )
    const typeDescriptionElement = container.querySelector("[data-testid='type-description']")
    expect(typeDescriptionElement).toBeInTheDocument()
    expect(typeDescriptionElement).toHaveTextContent("object or null")
  })

  test("formats description for oneOf type schema with one item (with title) and not nullable", () => {
    const oneOfSchema: OpenAPI.SchemaObject = {
      oneOf: [
        { type: "object", title: "test-title", properties: {} },
      ],
      properties: {},
    }
    const { container } = render(
      <TagOperationParametersName name={mockName} isRequired={false} schema={oneOfSchema} />
    )
    const typeDescriptionElement = container.querySelector("[data-testid='type-description']")
    expect(typeDescriptionElement).toBeInTheDocument()
    expect(typeDescriptionElement).toHaveTextContent("test-title")
  })

  test("formats description for oneOf type schema with one item (with title) and nullable", () => {
    const oneOfSchema: OpenAPI.SchemaObject = {
      oneOf: [
        { type: "object", title: "test-title", properties: {} },
      ],
      properties: {},
      nullable: true,
    }
    const { container } = render(
      <TagOperationParametersName name={mockName} isRequired={false} schema={oneOfSchema} />
    )
    const typeDescriptionElement = container.querySelector("[data-testid='type-description']")
    expect(typeDescriptionElement).toBeInTheDocument()
    expect(typeDescriptionElement).toHaveTextContent("test-title or null")
  })

  test("formats description for oneOf type schema with array items (with type) and not nullable", () => {
    const oneOfSchema: OpenAPI.SchemaObject = {
      oneOf: [
        { type: "array", items: { type: "string", properties: {} }, properties: {} },
      ],
      properties: {},
    }
    const { container } = render(
      <TagOperationParametersName name={mockName} isRequired={false} schema={oneOfSchema} />
    )
    const typeDescriptionElement = container.querySelector("[data-testid='type-description']")
    expect(typeDescriptionElement).toBeInTheDocument()
    expect(typeDescriptionElement).toHaveTextContent("array of strings")
  })

  test("formats description for oneOf type schema with array items (with type) and nullable", () => {
    const oneOfSchema: OpenAPI.SchemaObject = {
      oneOf: [
        { type: "array", items: { type: "string", properties: {} }, properties: {} },
      ],
      properties: {},
      nullable: true,
    }
    const { container } = render(
      <TagOperationParametersName name={mockName} isRequired={false} schema={oneOfSchema} />
    )
    const typeDescriptionElement = container.querySelector("[data-testid='type-description']")
    expect(typeDescriptionElement).toBeInTheDocument()
    expect(typeDescriptionElement).toHaveTextContent("array of strings or null")
  })

  test("formats description for oneOf type schema with array items (without type) and not nullable", () => {
    const oneOfSchema: OpenAPI.SchemaObject = {
      oneOf: [
        { type: "array", items: { properties: {} }, properties: {} },
      ],
      properties: {},
    }
    const { container } = render(
      <TagOperationParametersName name={mockName} isRequired={false} schema={oneOfSchema} />
    )
    const typeDescriptionElement = container.querySelector("[data-testid='type-description']")
    expect(typeDescriptionElement).toBeInTheDocument()
    expect(typeDescriptionElement).toHaveTextContent("array")
  })

  test("formats description for oneOf type schema with array items (without type) and nullable", () => {
    const oneOfSchema: OpenAPI.SchemaObject = {
      oneOf: [
        { type: "array", items: { properties: {} }, properties: {} },
      ],
      properties: {},
      nullable: true,
    }

    const { container } = render(
      <TagOperationParametersName name={mockName} isRequired={false} schema={oneOfSchema} />
    )
    const typeDescriptionElement = container.querySelector("[data-testid='type-description']")
    expect(typeDescriptionElement).toBeInTheDocument()
    expect(typeDescriptionElement).toHaveTextContent("array or null")
  })

  test("formats description for oneOf type schema with mixed items and not nullable", () => {
    const oneOfSchema: OpenAPI.SchemaObject = {
      oneOf: [
        { type: "object", properties: {} },
        { type: "array", items: { type: "string", properties: {} }, properties: {} },
      ],
      properties: {},
    }

    const { container } = render(
      <TagOperationParametersName name={mockName} isRequired={false} schema={oneOfSchema} />
    )
    const typeDescriptionElement = container.querySelector("[data-testid='type-description']")
    expect(typeDescriptionElement).toBeInTheDocument()
    expect(typeDescriptionElement).toHaveTextContent("object or array of strings")
  })

  test("formats description for oneOf type schema with mixed items and nullable", () => {
    const oneOfSchema: OpenAPI.SchemaObject = {
      oneOf: [
        { type: "object", properties: {} },
        { type: "array", items: { type: "string", properties: {} }, properties: {} },
      ],
      properties: {},
      nullable: true,
    }
    const { container } = render(
      <TagOperationParametersName name={mockName} isRequired={false} schema={oneOfSchema} />
    )
    const typeDescriptionElement = container.querySelector("[data-testid='type-description']")
    expect(typeDescriptionElement).toBeInTheDocument()
    expect(typeDescriptionElement).toHaveTextContent("object or array of strings or null")
  })
})

describe("default type schema description formatting", () => {
  test("formats description for default type schema with type, no nullable, no format", () => {
    const defaultSchema: OpenAPI.SchemaObject = {
      type: "string",
      properties: {}
    }
    const { container } = render(
      <TagOperationParametersName name={mockName} isRequired={false} schema={defaultSchema} />
    )
    const typeDescriptionElement = container.querySelector("[data-testid='type-description']")
    expect(typeDescriptionElement).toBeInTheDocument()
    expect(typeDescriptionElement).toHaveTextContent("string")
  })

  test("formats description for default type schema with type, nullable, no format", () => {
    const defaultSchema: OpenAPI.SchemaObject = {
      type: "string",
      properties: {},
      nullable: true,
    }
    const { container } = render(
      <TagOperationParametersName name={mockName} isRequired={false} schema={defaultSchema} />
    )
    const typeDescriptionElement = container.querySelector("[data-testid='type-description']")
    expect(typeDescriptionElement).toBeInTheDocument()
    expect(typeDescriptionElement).toHaveTextContent("string or null")
  })

  test("formats description for default type schema with type, no nullable, with format", () => {
    const defaultSchema: OpenAPI.SchemaObject = {
      type: "string",
      properties: {},
      format: "date-time",
    }
    const { container } = render(
      <TagOperationParametersName name={mockName} isRequired={false} schema={defaultSchema} />
    )
    const typeDescriptionElement = container.querySelector("[data-testid='type-description']")
    expect(typeDescriptionElement).toBeInTheDocument()
    expect(typeDescriptionElement).toHaveTextContent("string <date-time>")
  })

  test("formats description for default type schema with type, nullable, with format", () => {
    const defaultSchema: OpenAPI.SchemaObject = {
      type: "string",
      properties: {},
      format: "date-time",
      nullable: true,
    }
    const { container } = render(
      <TagOperationParametersName name={mockName} isRequired={false} schema={defaultSchema} />
    )
    const typeDescriptionElement = container.querySelector("[data-testid='type-description']")
    expect(typeDescriptionElement).toBeInTheDocument()
    expect(typeDescriptionElement).toHaveTextContent("string <date-time> or null")
  })

  test("formats description for default type schema without type and no nullable, no format", () => {
    const defaultSchema: OpenAPI.SchemaObject = {
      properties: {}
    }
    const { container } = render(
      <TagOperationParametersName name={mockName} isRequired={false} schema={defaultSchema} />
    )
    const typeDescriptionElement = container.querySelector("[data-testid='type-description']")
    expect(typeDescriptionElement).toBeInTheDocument()
    expect(typeDescriptionElement).toHaveTextContent("any")
  })

  test("formats description for default type schema without type and nullable, no format", () => {
    const defaultSchema: OpenAPI.SchemaObject = {
      properties: {},
      nullable: true,
    }
    const { container } = render(
      <TagOperationParametersName name={mockName} isRequired={false} schema={defaultSchema} />
    )
    const typeDescriptionElement = container.querySelector("[data-testid='type-description']")
    expect(typeDescriptionElement).toBeInTheDocument()
    expect(typeDescriptionElement).toHaveTextContent("any or null")
  })

  test("formats description for default type schema without type and no nullable, with format", () => {
    const defaultSchema: OpenAPI.SchemaObject = {
      properties: {},
      format: "date-time",
    }
    const { container } = render(
      <TagOperationParametersName name={mockName} isRequired={false} schema={defaultSchema} />
    )
    const typeDescriptionElement = container.querySelector("[data-testid='type-description']")
    expect(typeDescriptionElement).toBeInTheDocument()
    expect(typeDescriptionElement).toHaveTextContent("any <date-time>")
  })

  test("formats description for default type schema without type and nullable, with format", () => {
    const defaultSchema: OpenAPI.SchemaObject = {
      properties: {},
      format: "date-time",
      nullable: true,
    }
    const { container } = render(
      <TagOperationParametersName name={mockName} isRequired={false} schema={defaultSchema} />
    )
    const typeDescriptionElement = container.querySelector("[data-testid='type-description']")
    expect(typeDescriptionElement).toBeInTheDocument()
    expect(typeDescriptionElement).toHaveTextContent("any <date-time> or null")
  })
})