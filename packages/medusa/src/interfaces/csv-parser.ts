import { AwilixContainer } from "awilix"

export type LineContext = {
  lineNumber: number
}

export type CsvParserContext = LineContext & {
  column: string
}

export interface IValidator<TLine> {
  validate: (
    value: string,
    line: TLine,
    context: CsvParserContext
  ) => Promise<boolean | never>
}

export abstract class AbstractCsvValidator<TLine> implements IValidator<TLine> {
  constructor(protected readonly container: AwilixContainer) {}

  abstract validate(
    value: string,
    line: TLine,
    context: CsvParserContext
  ): Promise<boolean | never>
}

export type CsvSchema<TLine = unknown> = {
  columns: {
    name: string
    required?: boolean
    mapTo?: string
    validator?: AbstractCsvValidator<TLine>
  }[]
}
