import { AwilixContainer } from "awilix"

export type CsvParserContext = {
  line: number
  column: string
}

export interface IValidator<TLine> {
  validate: (
    value: string,
    line: TLine,
    context: CsvParserContext
  ) => Promise<boolean>
}

export abstract class AbstractValidator<TLine> implements IValidator<TLine> {
  constructor(protected readonly container: AwilixContainer) {}

  abstract validate(value: string, line: TLine, context: CsvParserContext)
}

export type CsvSchema<TLine = any> = {
  columns: {
    name: string
    required?: boolean
    mapTo?: string
    validator?: AbstractValidator<TLine>
  }[]
}

export interface ICsvParser<TResult> extends IParser<TResult> {
  $$delimiter: string
}
