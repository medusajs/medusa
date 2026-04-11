import ts from "typescript"
import { OpenApiSchema } from "../../types/index.js"

type SchemaMap = Record<
  string,
  OpenApiSchema | ((type: ts.Type) => OpenApiSchema)
>

/**
 * This class has predefined OAS schemas for some types. It's used to bypass
 * the logic of creating a schema for certain types.
 */
class SchemaFactory {
  private checker: ts.TypeChecker
  /**
   * The pre-defined schemas.
   */
  private schemas: SchemaMap = {
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
    difference_due: {
      type: "number",
    },
    refund_amount: {
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
  private schemasForQuery: SchemaMap = {
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
    metadata: {
      type: "object",
      title: "metadata",
      description: "Holds custom key-value pairs.",
      externalDocs: {
        url: "https://docs.medusajs.com/api/store#manage-metadata",
        description: "Learn how to manage metadata",
      },
    },
    OperatorMap: (type) => {
      if (!("typeArguments" in type || "aliasTypeArguments" in type)) {
        return {}
      }
      const typeRef = type as ts.TypeReference
      const typeArgs = typeRef.typeArguments || typeRef.aliasTypeArguments
      if (!typeArgs || typeArgs.length === 0) {
        return {}
      }
      const typeStr = this.checker.typeToString(typeArgs[0])
      return {
        type: "object",
        properties: {
          $and: JSON.parse(JSON.stringify(this.schemas["$and"])),
          $or: JSON.parse(JSON.stringify(this.schemas["$or"])),
          $eq: {
            oneOf: [
              {
                type: typeStr,
                title: "$eq",
                description: "Filter by exact value.",
              },
              {
                type: "array",
                title: "$eq",
                description: "Filter by exact value.",
                items: {
                  type: typeStr,
                },
              },
            ],
          },
          $ne: {
            type: typeStr,
            title: "$ne",
            description: "Filter by not equal to the given value.",
          },
          $in: {
            type: "array",
            title: "$in",
            description: "Filter by values included in the given array.",
            items: {
              type: typeStr,
            },
          },
          $nin: {
            type: "array",
            title: "$nin",
            description: "Filter by values not included in the given array.",
            items: {
              type: typeStr,
            },
          },
          $not: {
            oneOf: [
              {
                type: typeStr,
                title: "$not",
                description: "Filter by not equal to the given value.",
              },
              {
                type: "object",
                title: "$not",
                description:
                  "Filter by values not matching the conditions in this parameter.",
              },
              {
                type: "array",
                title: "$not",
                description:
                  "Filter by values not matching the conditions in this parameter.",
                items: {
                  type: typeStr,
                },
              },
            ],
          },
          $gt: {
            type: typeStr,
            title: "$gt",
            description: "Filter by values greater than the given value.",
          },
          $gte: {
            type: typeStr,
            title: "$gte",
            description:
              "Filter by values greater than or equal to the given value.",
          },
          $lt: {
            type: typeStr,
            title: "$lt",
            description: "Filter by values less than the given value.",
          },
          $lte: {
            type: typeStr,
            title: "$lte",
            description:
              "Filter by values less than or equal to the given value.",
          },
          $like: {
            type: typeStr,
            title: "$like",
            description: "Apply a `like` filter. Useful for strings only.",
          },
          $re: {
            type: typeStr,
            title: "$re",
            description: "Apply a regex filter. Useful for strings only.",
          },
          $ilike: {
            type: typeStr,
            title: "$ilike",
            description:
              "Apply a case-insensitive `like` filter. Useful for strings only.",
          },
          $fulltext: {
            type: typeStr,
            title: "$fulltext",
            description: "Filter to apply on full-text properties.",
          },
          $overlap: {
            type: "array",
            title: "$overlap",
            description:
              "Filter to apply on array properties to find overlapping values.",
            items: {
              type: typeStr,
            },
          },
          $contains: {
            type: "array",
            title: "$contains",
            description:
              "Filter to apply on array properties to find contained values.",
            items: {
              type: typeStr,
            },
          },
          $contained: {
            type: "array",
            title: "$contained",
            description:
              "Filter to apply on array properties to find contained values.",
            items: {
              type: typeStr,
            },
          },
          $exists: {
            type: "boolean",
            title: "$exists",
            description: "Filter by whether a value exists or not.",
          },
        },
      } as OpenApiSchema
    },
  }

  /**
   * Schemas used only for response types.
   */
  private schemasForResponse: SchemaMap = {
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

  constructor({ checker }: { checker: ts.TypeChecker }) {
    this.checker = checker
  }

  /**
   * Try to retrieve the pre-defined schema of a type name.
   *
   * @param name - the name of the type.
   * @param additionalData - Additional data to pass along/override in the predefined schema. For example, a description.
   * @returns The schema, if found.
   */
  public tryGetSchema({
    name,
    additionalData,
    context = "all",
    type,
  }: {
    name: string
    additionalData?: Partial<OpenApiSchema>
    context?: "request" | "query" | "response" | "all"
    type?: ts.Type
  }): OpenApiSchema | undefined {
    const schemasFactory =
      context === "response"
        ? this.mergeSchemas(this.schemasForResponse, this.schemas)
        : context === "query"
          ? this.mergeSchemas(this.schemasForQuery, this.schemas)
          : this.mergeSchemas(this.schemas)
    const key = Object.hasOwn(schemasFactory, name)
      ? name
      : additionalData?.title || ""
    if (!Object.hasOwn(schemasFactory, key)) {
      return
    }

    let schema: OpenApiSchema | undefined

    if (typeof schemasFactory[key] === "function") {
      if (!type) {
        return
      }

      schema = schemasFactory[key](type)
    } else {
      schema = Object.assign({}, schemasFactory[key])
    }

    if (additionalData) {
      schema = Object.assign(schema, {
        ...additionalData,
        // keep the description
        description: schema.description || additionalData.description,
      })
    }

    return schema
  }

  private mergeSchemas(...schemas: SchemaMap[]): SchemaMap {
    return schemas.reduce((merged, schema) => {
      Object.entries(schema).forEach(([key, value]) => {
        merged[key] =
          typeof value === "function"
            ? value
            : JSON.parse(JSON.stringify(value))
      })
      return merged
    }, {} as SchemaMap)
  }
}

export default SchemaFactory
