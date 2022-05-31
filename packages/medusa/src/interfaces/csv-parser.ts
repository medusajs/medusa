import { AwilixContainer } from "awilix"

/**
 * Generic validation interface used to run validation logic on every line or record.
 * All different validation objects should implement this interface
 */
export interface ICsvValidator<TLine> {
  /**
   *
   * @param value value of column or property
   * @param context includes contextual information such as line number, line, etc.
   */
  validate: (
    value: string,
    context: CsvParserContext<TLine>
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
export abstract class AbstractCsvValidator<TLine>
  implements ICsvValidator<TLine>
{
  constructor(protected readonly container: AwilixContainer) {}

  abstract validate(
    value: string,
    context: CsvParserContext<TLine>
  ): Promise<boolean | never>
}

export type CsvSchema<TLine = unknown> = {
  columns: {
    name: string
    required?: boolean
    mapTo?: string
    validator?: AbstractCsvValidator<TLine>
    transformer?: <T>(value: string, context: CsvParserContext<TLine>) => T
  }[]
}
