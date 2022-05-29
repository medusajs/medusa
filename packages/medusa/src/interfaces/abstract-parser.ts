import { ParseConfig } from "papaparse"

export type ParserOptions = ParseConfig

export interface IParser<TResult> {
  parse(path: string, options?: ParserOptions): Promise<TResult[]>
}

export abstract class AbstractParser<TSchema, TParserResult, TOutputResult>
  implements IParser<TParserResult>
{
  protected readonly $$schema: TSchema

  protected constructor(schema: TSchema) {
    this.$$schema = schema
  }

  public abstract parse(
    path: string,
    options?: ParserOptions
  ): Promise<TParserResult[]>

  public abstract validateSchema(
    data: TParserResult[]
  ): Promise<TOutputResult[]>
}
