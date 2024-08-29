import { OpenApiSchema } from "../../types/index.js"

/**
 * This class has predefined OAS schemas for some types. It's used to bypass
 * the logic of creating a schema for certain types.
 */
class SchemaFactory {
  /**
   * The pre-defined schemas.
   */
  private schemas: Record<string, OpenApiSchema> = {
    $and: {
      type: "array",
      description:
        "Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.",
      items: {
        type: "object",
      },
    },
    $or: {
      type: "array",
      description:
        "Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.",
      items: {
        type: "object",
      },
    },
    BigNumberInput: {
      type: "string",
    },
    BigNumber: {
      type: "string",
    },
  }
  /**
   * Schemas used only for response types.
   */
  private schemasForResponse: Record<string, OpenApiSchema> = {
    created_at: {
      type: "string",
      format: "date-time",
    },
    updated_at: {
      type: "string",
      format: "date-time",
    },
    deleted_at: {
      type: "string",
      format: "date-time",
    },
  }

  /**
   * Try to retrieve the pre-defined schema of a type name.
   *
   * @param name - the name of the type.
   * @param additionalData - Additional data to pass along/override in the predefined schema. For example, a description.
   * @returns The schema, if found.
   */
  public tryGetSchema(
    name: string,
    additionalData?: Partial<OpenApiSchema>,
    type: "request" | "response" | "all" = "all"
  ): OpenApiSchema | undefined {
    const schemasFactory =
      type === "response"
        ? this.mergeSchemas(this.schemasForResponse, this.schemas)
        : this.schemas
    if (!Object.hasOwn(schemasFactory, name)) {
      return
    }

    let schema = Object.assign({}, schemasFactory[name])

    if (additionalData) {
      schema = Object.assign(schema, additionalData)
    }

    return schema
  }

  private mergeSchemas(
    main: Record<string, OpenApiSchema>,
    other: Record<string, OpenApiSchema>
  ): Record<string, OpenApiSchema> {
    const clonedMain = Object.assign({}, main)

    return Object.assign(clonedMain, other)
  }
}

export default SchemaFactory
