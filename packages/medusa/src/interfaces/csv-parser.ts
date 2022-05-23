import {
  AbstractParser,
  IParser,
  LineContext,
  ParserOptions,
} from "./abstract-parser"
import { AwilixContainer } from "awilix"
import Papa, { ParseConfig } from "papaparse"
import fs from "fs"

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

type CsvSchema<TLine = any> = {
  columns: {
    name: string
    required?: boolean
    mapTo?: string
    validator?: AbstractValidator<TLine>
  }[]
}

interface ICsvParser<TResult> extends IParser<TResult> {
  $$delimiter: string
}

export abstract class CsvParser<
    TSchema extends CsvSchema = CsvSchema,
    TParserResult = any,
    TOutputResult = any
  >
  extends AbstractParser<TSchema, TParserResult, TOutputResult>
  implements ICsvParser<TParserResult>
{
  $$delimiter = ";"

  constructor(
    protected readonly container: AwilixContainer,
    schema: TSchema,
    delimiter?: string
  ) {
    super(schema)
    if (delimiter) {
      this.$$delimiter = delimiter
    }
  }

  public async parse(
    path: string,
    options: ParserOptions = {
      dynamicTyping: true,
      header: true,
    }
  ): Promise<TParserResult[]> {
    const fileStream = fs.createReadStream(path)
    const csvStream = Papa.parse(Papa.NODE_STREAM_INPUT, {
      ...(options as ParseConfig),
    })

    const parsedContent: TParserResult[] = []
    fileStream.pipe(csvStream)
    for await (const chunk of csvStream) {
      parsedContent.push(chunk)
    }

    return parsedContent
  }

  async validateSchema(
    line: TParserResult,
    context: LineContext
  ): Promise<TOutputResult> {
    const outputTuple = {} as TOutputResult

    const tupleKeys = Object.keys(line)

    for (const tupleKey of tupleKeys) {
      const column = this.$$schema.columns.find((column) => {
        return column.name === tupleKey
      })

      if (!column) {
        throw new Error(
          `Unable to to treat column ${tupleKey} from the csv file. No target column found in the provided schema`
        )
      }

      if (column.validator) {
        await column.validator.validate(line[tupleKey], line, {
          line: context.lineNumber,
          column: tupleKey,
        })
      }

      outputTuple[column.mapTo ?? tupleKey] = line[tupleKey]
    }

    return outputTuple
  }
}
