import { difference } from "lodash"
import Papa, { ParseConfig } from "papaparse"

import { AbstractParser } from "../interfaces/abstract-parser"
import { CsvParserContext, CsvSchema } from "../interfaces/csv-parser"

const DEFAULT_PARSE_OPTIONS = {
  dynamicTyping: true,
  header: true,
}

class CsvParser<
  TSchema extends CsvSchema<TParserResult, TOutputResult> = CsvSchema,
  TParserResult extends object = Record<string, unknown>,
  TOutputResult = unknown
> extends AbstractParser<TSchema, TParserResult, ParseConfig, TOutputResult> {
  protected readonly $$delimiter: string = ";"

  constructor(schema: TSchema, delimiter?: string) {
    super(schema)
    if (delimiter) {
      this.$$delimiter = delimiter
    }
  }

  public async parse(
    readableStream: NodeJS.ReadableStream,
    options: ParseConfig = DEFAULT_PARSE_OPTIONS
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
      const builtLine = await this._buildLine(data[i], i + 1)
      validatedData.push(builtLine)
    }
    return validatedData
  }

  private async _buildLine(
    line: TParserResult,
    lineNumber: number
  ): Promise<TOutputResult> {
    let outputTuple = {} as TOutputResult
    const columnMap = this.buildColumnMap_(this.$$schema.columns)
    const requiredColumnsMap = this.buildColumnMap_(
      this.$$schema.columns.filter((col) => col.required)
    )

    const tupleKeys = Object.keys(line)

    /**
     * map which keeps track of the columns processed
     * used to detect any missing columns which are present in the schema but not in the line
     */
    const processedColumns = {}
    for (const tupleKey of tupleKeys) {
      const column = this.resolveColumn_(tupleKey, columnMap)

      /**
       * if the tupleKey does not correspond to any column defined in the schema
       */
      if (!column) {
        throw new Error(
          `Unable to treat column ${tupleKey} from the csv file. No target column found in the provided schema`
        )
      }

      processedColumns[column.name] = true

      /**
       * if the value corresponding to the tupleKey is empty and the column is required in the schema
       */
      if (!line[tupleKey] && column.required) {
        throw new Error(
          `No value found for target column "${column.name}" in line ${lineNumber} of the given csv file`
        )
      }

      const context = {
        line,
        lineNumber,
        column: column.name,
        tupleKey,
      }

      outputTuple = this.resolveTuple_(outputTuple, column, context)
    }

    /**
     * missing columns = columns defined (& required) in the schema - columns present in the line
     */
    const missingColumns = difference(
      Object.keys(requiredColumnsMap),
      Object.keys(processedColumns)
    )

    if (missingColumns.length > 0) {
      throw new Error(
        `Missing column(s) ${formatMissingColumns(
          missingColumns
        )} from the given csv file`
      )
    }

    /**
     * Runs the validation defined in the schema columns
     */
    for (const column of this.$$schema.columns) {
      const context = {
        line,
        lineNumber,
        column: column.name,
      }

      if (column.validator) {
        await column.validator.validate(outputTuple, context)
      }
    }

    return outputTuple
  }

  private buildColumnMap_(
    columns: TSchema["columns"]
  ): Record<string, TSchema["columns"][number]> {
    return columns.reduce((map, column) => {
      if (typeof column.name === "string") {
        map[column.name] = column
      }
      return map
    }, {})
  }

  private resolveColumn_(
    tupleKey: string,
    columnMap: Record<string, TSchema["columns"][number]>
  ): TSchema["columns"][number] | undefined {
    if (columnMap[tupleKey]) {
      return columnMap[tupleKey]
    }

    const matchedColumn = this.$$schema.columns.find((column) => {
      return "match" in column &&
        typeof column.match === "object" &&
        column.match instanceof RegExp
        ? column.match.test(tupleKey)
        : false
    })

    return matchedColumn
  }

  private resolveTuple_(
    tuple: TOutputResult,
    column: TSchema["columns"][number],
    context: CsvParserContext<TParserResult> & { tupleKey: string }
  ): TOutputResult {
    const outputTuple = { ...tuple }
    const { tupleKey, ...csvContext } = context
    const { line } = csvContext

    let resolvedKey = tupleKey
    /**
     * if match is provided, then we should call the reducer if it's defined
     * otherwise, before using the mapTo property, we should make sure match was not provided
     */
    if ("match" in column && column.reducer) {
      return column.reducer(outputTuple, tupleKey, line[tupleKey], csvContext)
    } else if (!("match" in column) && "mapTo" in column && column.mapTo) {
      resolvedKey = column.mapTo
    }

    const resolvedValue = column.transform
      ? column.transform(line[tupleKey], csvContext)
      : line[tupleKey]

    outputTuple[resolvedKey] = resolvedValue

    return outputTuple
  }
}

const formatMissingColumns = (list: string[]): string =>
  list.reduce(
    (text, curr, i, array) =>
      text + (i < array.length - 1 ? `"${curr}", ` : `"${curr}"`),
    ""
  )

export default CsvParser
