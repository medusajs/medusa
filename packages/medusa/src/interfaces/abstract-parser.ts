import { ParseConfig } from "papaparse"

export type ParserOptions = ParseConfig

/**
 * Generic parsing interface. All different parsing implementations (csv, json, etc.) should implement this interface
 */
export interface IParser<TResult> {
  /**
   *
   * @param readableStream readable stream to parse
   * @param options options used for parsing by underlying parsing implementation
   */
  parse(
    readableStream: NodeJS.ReadableStream,
    options?: ParserOptions
  ): Promise<TResult[]>
}

/**
 * Abstract class implementation of the IParser interface. All different parsing implementations should extend this class
 */
export abstract class AbstractParser<TSchema, TParserResult, TOutputResult>
  implements IParser<TParserResult>
{
  protected readonly $$schema: TSchema

  protected constructor(schema: TSchema) {
    this.$$schema = schema
  }

  public abstract parse(
    readableStream: NodeJS.ReadableStream,
    options?: ParserOptions
  ): Promise<TParserResult[]>

  /**
   *
   * @param data data to be built after parsing. Includes validation according to schema, transformation of values, etc.
   */
  public abstract buildData(data: TParserResult[]): Promise<TOutputResult[]>
}
