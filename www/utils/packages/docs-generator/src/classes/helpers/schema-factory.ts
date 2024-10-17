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
    IBigNumber: {
      type: "number",
    },
    BigNumberValue: {
      type: "number",
    },
    File: {
      type: "object",
      description: "A File to upload.",
      externalDocs: {
        url: "https://developer.mozilla.org/en-US/docs/Web/API/File",
        description: "Learn more about the File API",
      },
    },
    FileList: {
      type: "array",
      description: "list of files to upload.",
      items: {
        type: "object",
        description: "A File to upload.",
        externalDocs: {
          url: "https://developer.mozilla.org/en-US/docs/Web/API/File",
          description: "Learn more about the File API",
        },
      },
    },
  }

  /**
   * Schemas used only for query types
   */
  private schemasForQuery: Record<string, OpenApiSchema> = {
    expand: {
      type: "string",
      title: "expand",
      description:
        "Comma-separated relations that should be expanded in the returned data.",
    },
    fields: {
      type: "string",
      title: "fields",
      description:
        "Comma-separated fields that should be included in the returned data. If a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default fields. Without prefix it will replace the entire default fields.",
      externalDocs: {
        url: "#select-fields-and-relations",
      },
    },
    offset: {
      type: "number",
      title: "offset",
      description: "The number of items to skip when retrieving a list.",
      externalDocs: {
        url: "#pagination",
      },
    },
    limit: {
      type: "number",
      title: "limit",
      description: "Limit the number of items returned in the list.",
      externalDocs: {
        url: "#pagination",
      },
    },
    order: {
      type: "string",
      title: "order",
      description:
        "The field to sort the data by. By default, the sort order is ascending. To change the order to descending, prefix the field name with `-`.",
      externalDocs: {
        url: "#pagination",
      },
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
    type: "request" | "query" | "response" | "all" = "all"
  ): OpenApiSchema | undefined {
    const schemasFactory =
      type === "response"
        ? this.mergeSchemas(this.schemasForResponse, this.schemas)
        : type === "query"
          ? this.mergeSchemas(this.schemasForQuery, this.schemas)
          : this.cloneSchema(this.schemas)
    const key = Object.hasOwn(schemasFactory, name)
      ? name
      : additionalData?.title || ""
    if (!Object.hasOwn(schemasFactory, key)) {
      return
    }

    let schema = Object.assign({}, schemasFactory[key])

    if (additionalData) {
      schema = Object.assign(schema, {
        ...additionalData,
        // keep the description
        description: schema.description || additionalData.description,
      })
    }

    return schema
  }

  private mergeSchemas(
    main: Record<string, OpenApiSchema>,
    other: Record<string, OpenApiSchema>
  ): Record<string, OpenApiSchema> {
    return Object.assign(this.cloneSchema(main), this.cloneSchema(other))
  }

  private cloneSchema(
    schema: Record<string, OpenApiSchema>
  ): Record<string, OpenApiSchema> {
    return JSON.parse(JSON.stringify(schema))
  }
}

export default SchemaFactory
