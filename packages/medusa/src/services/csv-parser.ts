import { AwilixContainer } from "awilix"
import Papa from "papaparse"
import { AbstractParser, ParserOptions } from "../interfaces/abstract-parser"
import { CsvSchema } from "../interfaces/csv-parser"

const DEFAULT_PARSE_OPTIONS = {
  dynamicTyping: true,
  header: true,
}
class CsvParser<
  TSchema extends CsvSchema = CsvSchema,
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
    readableStream: NodeJS.ReadableStream,
    options: ParserOptions = DEFAULT_PARSE_OPTIONS
  ): Promise<TParserResult[]> {
    const csvStream = Papa.parse(Papa.NODE_STREAM_INPUT, options)

    const parsedContent: TParserResult[] = []
    readableStream.pipe(csvStream)
    for await (const chunk of csvStream) {
      parsedContent.push(chunk)
    }

    return parsedContent
  }

  async buildData(data: TParserResult[]): Promise<TOutputResult[]> {
    const validatedData = [] as TOutputResult[]
    for (let i = 0; i < data.length; i++) {
      const result = await this._buildLine(data[i], i + 1)
      validatedData.push(result)
    }
    return validatedData
  }

  private async _buildLine(
    line: TParserResult,
    lineNumber: number
  ): Promise<TOutputResult> {
    const outputTuple = {} as TOutputResult
    const columnMap = this._buildColumnMap(this.$$schema.columns)

    const tupleKeys = Object.keys(line)
    for (const tupleKey of tupleKeys) {
      const column = columnMap[tupleKey]

      if (!column) {
        throw new Error(
          `Unable to to treat column ${tupleKey} from the csv file. No target column found in the provided schema`
        )
      }

      const context = {
        line,
        lineNumber,
        column: tupleKey,
      }

      if (column.validator) {
        await column.validator.validate(line[tupleKey], context)
      }

      outputTuple[column.mapTo ?? tupleKey] = column.transformer
        ? column.transformer(line[tupleKey], context)
        : line[tupleKey]
    }

    return outputTuple
  }

  private _buildColumnMap(
    columns: TSchema["columns"]
  ): Record<string, TSchema["columns"][number]> {
    return columns.reduce((map, column) => {
      map[column.name] = column
      return map
    }, {})
  }
}

export default CsvParser
