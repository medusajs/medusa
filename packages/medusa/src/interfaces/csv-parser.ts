import { AwilixContainer } from "awilix"

/**
 * Generic validation interface used to run validation logic on every line or record.
 * All different validation objects should implement this interface
 */
export interface ICsvValidator<TCsvLine, TBuiltLine> {
  /**
   *
   * @param value value of column or property
   * @param context includes contextual information such as line number, line, etc.
   */
  validate: (
    value: TBuiltLine,
    context: CsvParserContext<TCsvLine>
  ) => Promise<boolean | never>
}

export type CsvParserContext<TLine> = LineContext<TLine> & {
  column: string
}

export type LineContext<TLine> = {
  lineNumber: number
  line: TLine
}

/**
 * Abstract class implementation of the IValidator interface.
 * All validation objects part of the schema should extend this class.
 */
export abstract class AbstractCsvValidator<TCsvLine, TBuiltLine>
  implements ICsvValidator<TCsvLine, TBuiltLine>
{
  constructor(protected readonly container: AwilixContainer) {}

  abstract validate(
    builtLine: TBuiltLine,
    context: CsvParserContext<TCsvLine>
  ): Promise<boolean | never>
}

export type CsvSchemaColumn<
  TCsvLine,
  TBuiltLine,
  NameAsOptional = false
> = (NameAsOptional extends false
  ? {
      name: string
    }
  : {
      name?: string
    }) & {
  required?: boolean
  validator?: AbstractCsvValidator<TCsvLine, TBuiltLine>
} & (
    | {
        mapTo?: string
        transform?: ColumnTransformer<TCsvLine>
      }
    | {
        match?: RegExp
        reducer?: ColumnReducer<TCsvLine, TBuiltLine>
        transform?: ColumnTransformer<TCsvLine>
      }
  )

export type ColumnTransformer<TCsvLine> = (
  value: string,
  context: CsvParserContext<TCsvLine>
) => unknown

export type ColumnReducer<TCsvLine = unknown, TBuiltLine = unknown> = (
  builtLine: TBuiltLine,
  key: string,
  value: string,
  context: CsvParserContext<TCsvLine>
) => TBuiltLine

export type CsvSchema<TCsvLine = unknown, TBuiltLine = unknown> = {
  columns: CsvSchemaColumn<TCsvLine, TBuiltLine>[]
}
