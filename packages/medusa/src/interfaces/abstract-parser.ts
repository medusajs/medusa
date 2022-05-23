import { ParseConfig } from "papaparse"

export interface IParser<TResult> {
  parse(path: string): Promise<TResult[]>
}

export type LineContext = {
  lineNumber: number
}

export type ParserOptions = ParseConfig

export abstract class AbstractParser<TSchema, TParserResult, TOutputResult>
  implements IParser<TParserResult>
{
  protected $$schema: TSchema

  protected constructor(schema: TSchema) {
    this.$$schema = schema
  }

  public abstract parse(
    path: string,
    options?: ParserOptions
  ): Promise<TParserResult[]>

  public abstract validateSchema(
    line: TParserResult,
    context: LineContext
  ): Promise<TOutputResult>
}
