import { AwilixContainer } from "awilix"
import fs from "fs"
import Papa from "papaparse"
import { AbstractParser, ParserOptions } from "../interfaces/abstract-parser"
import { CsvSchema, LineContext } from "../interfaces/csv-parser"

const buildColumnMap = <TSchema extends CsvSchema>(
  columns: TSchema["columns"]
): Record<string, TSchema["columns"][number]> =>
  columns.reduce((map, column) => {
    map[column.name] = column
    return map
  }, {})

class CsvParser<
  TLine = unknown,
  TSchema extends CsvSchema<TLine> = CsvSchema<TLine>,
  TParserResult = unknown,
  TOutputResult = unknown
> extends AbstractParser<TSchema, TParserResult, TOutputResult> {
  protected $$delimiter = ";"

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
    const csvStream = Papa.parse(Papa.NODE_STREAM_INPUT, options)

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
    const columnMap = buildColumnMap(this.$$schema.columns)

    const tupleKeys = Object.keys(line)

    for (const tupleKey of tupleKeys) {
      const column = columnMap[tupleKey]

      if (!column) {
        throw new Error(
          `Unable to to treat column ${tupleKey} from the csv file. No target column found in the provided schema`
        )
      }

      if (column.validator) {
        await column.validator.validate(line[tupleKey], line, {
          ...context,
          column: tupleKey,
        })
      }

      outputTuple[column.mapTo ?? tupleKey] = line[tupleKey]
    }

    return outputTuple
  }
}

export default CsvParser
