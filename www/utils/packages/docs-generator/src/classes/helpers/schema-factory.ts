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
    BigNumberInput: {
      type: "string",
    },
    BigNumber: {
      type: "string",
    },
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
    additionalData?: Partial<OpenApiSchema>
  ): OpenApiSchema | undefined {
    if (!Object.hasOwn(this.schemas, name)) {
      return
    }

    let schema = Object.assign({}, this.schemas[name])

    if (additionalData) {
      schema = Object.assign(schema, additionalData)
    }

    return schema
  }
}

export default SchemaFactory
