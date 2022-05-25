import { AwilixContainer } from "awilix"
import {
  AbstractParser,
  LineContext,
  ParserOptions,
} from "../interfaces/abstract-parser"
import { CsvSchema, ICsvParser } from "../interfaces/csv-parser"
import Papa, { ParseConfig } from "papaparse"
import fs from "fs"

class CsvParser<
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

  async validateSchema(data: TParserResult[]): Promise<TOutputResult[]> {
    const validatedData = [] as TOutputResult[]
    for (let i = 0; i < data.length; i++) {
      const result = await this._validateLine(data[i], { lineNumber: i + 1 })
      validatedData.push(result)
    }
    return validatedData
  }

  private async _validateLine(
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

export default CsvParser
