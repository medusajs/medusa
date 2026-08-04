import type {
  AccessorFn,
  AccessorFnColumnDef,
  AccessorKeyColumnDef,
  CellContext,
  Column,
  ColumnDef,
  ColumnFilter,
  ColumnSort,
  DeepKeys,
  DeepValue,
  DisplayColumnDef,
  HeaderContext,
  IdentifiedColumnDef,
  IdIdentifier,
  PaginationState,
  Row,
  RowData,
  RowSelectionState,
  SortDirection,
  StringHeaderIdentifier,
  StringOrTemplateHeader,
} from "@tanstack/react-table"

export type DataTableRowData = RowData

export type DataTableRow<TData extends DataTableRowData> = Row<TData>

export type DataTableAction<TData> = {
  label: string
  onClick: (ctx: CellContext<TData, unknown>) => void
  icon?: React.ReactNode
}

export interface DataTableCellContext<TData extends DataTableRowData, TValue>
  extends CellContext<TData, TValue> {}

export interface DataTableHeaderContext<TData extends DataTableRowData, TValue>
  extends HeaderContext<TData, TValue> {}

export type DataTableSortDirection = SortDirection

export interface DataTableActionColumnDef<TData>
  extends Pick<DisplayColumnDef<TData>, "meta"> {
  actions:
    | DataTableAction<TData>[]
    | DataTableAction<TData>[][]
    | ((
        ctx: DataTableCellContext<TData, unknown>
      ) => DataTableAction<TData>[] | DataTableAction<TData>[][])
}

export interface DataTableSelectColumnDef<TData>
  extends Pick<DisplayColumnDef<TData>, "cell" | "header"> {}

export type DataTableSortableColumnDef = {
  /**
   * The label to display in the sorting menu.
   */
  sortLabel?: string
  /**
   * The label to display in the sorting menu when sorting in ascending order.
   */
  sortAscLabel?: string
  /**
   * The label to display in the sorting menu when sorting in descending order.
   */
  sortDescLabel?: string
  /**
   * Whether the column is sortable.
   * @default false
   */
  enableSorting?: boolean
}

export type DataTableColumnAlignment = "left" | "center" | "right"

/**
 * @deprecated Use {@link DataTableColumnAlignment} instead.
 */
export type DataTableHeaderAlignment = DataTableColumnAlignment

export type DataTableAlignableColumnDef = {
  /**
   * The alignment of the header content.
   * @default 'left'
   * @deprecated Use `align`, which aligns both the header and the body cell.
   */
  headerAlign?: DataTableColumnAlignment
  /**
   * The alignment of both the header and the body cell content.
   * @default 'left'
   */
  align?: DataTableColumnAlignment
}

export type DataTableSortableColumnDefMeta = {
  ___sortMetaData?: DataTableSortableColumnDef
}

export type DataTableAlignableColumnDefMeta = {
  ___alignMetaData?: DataTableAlignableColumnDef
}

export type DataTableTruncatableColumnDef = {
  /**
   * Whether a hover tooltip showing the full value is displayed when the body
   * cell content is truncated. Disable it for cells that manage their own
   * overflow.
   * @default true
   */
  truncateTooltip?: boolean
}

export type DataTableTruncatableColumnDefMeta = {
  ___truncateTooltip?: boolean
}

export type DataTableActionColumnDefMeta<TData> = {
  ___actions?:
    | DataTableAction<TData>[]
    | DataTableAction<TData>[][]
    | ((ctx: DataTableCellContext<TData, unknown>) => DataTableAction<TData>[])
}

export interface DataTableColumn<
  TData extends DataTableRowData,
  TValue = unknown
> extends Column<TData, TValue> {}

export type DataTableColumnDef<
  TData extends DataTableRowData,
  TValue = unknown
> = ColumnDef<TData, TValue>

export type DataTableColumnSizing = {
  /**
   * The maximum size of the column.
   */
  maxSize?: number
  /**
   * The minimum size of the column.
   */
  minSize?: number
  /**
   * The size of the column.
   */
  size?: number
}

type DataTableColumnIdentifiers<TData extends DataTableRowData, TValue> =
  | IdIdentifier<TData, TValue>
  | StringHeaderIdentifier

export type DataTableDisplayColumnDef<
  TData extends DataTableRowData,
  TValue = unknown
> = Pick<
  DisplayColumnDef<TData, TValue>,
  "meta" | "header" | "cell" | "minSize" | "maxSize" | "size"
> &
  DataTableColumnIdentifiers<TData, TValue>

export interface DataTableIdentifiedColumnDef<
  TData extends DataTableRowData,
  TValue
> extends Pick<
    IdentifiedColumnDef<TData, TValue>,
    "meta" | "header" | "cell" | "minSize" | "maxSize" | "size"
  > {
  id?: string
  header?: StringOrTemplateHeader<TData, TValue>
}

export interface DataTableColumnHelper<TData> {
  /**
   * Create a accessor column.
   *
   * @param accessor The accessor to create the column for.
   * @param column The column to create for the accessor.
   * @returns The created accessor.
   */
  accessor: <
    TAccessor extends AccessorFn<TData> | DeepKeys<TData>,
    TValue extends TAccessor extends AccessorFn<TData, infer TReturn>
      ? TReturn
      : TAccessor extends DeepKeys<TData>
      ? DeepValue<TData, TAccessor>
      : never
  >(
    accessor: TAccessor,
    column: TAccessor extends AccessorFn<TData>
      ? DataTableDisplayColumnDef<TData, TValue> &
          DataTableSortableColumnDef &
          DataTableAlignableColumnDef &
          DataTableTruncatableColumnDef
      : DataTableIdentifiedColumnDef<TData, TValue> &
          DataTableSortableColumnDef &
          DataTableAlignableColumnDef &
          DataTableTruncatableColumnDef
  ) => TAccessor extends AccessorFn<TData>
    ? AccessorFnColumnDef<TData, TValue>
    : AccessorKeyColumnDef<TData, TValue>
  /**
   * Create a display column.
   *
   * @param column The column to create the display for.
   * @returns The created display column.
   */
  display: (column: DataTableDisplayColumnDef<TData>) => DisplayColumnDef<TData>
  /**
   * Create an action column.
   *
   * @param props The props to create the action column for.
   * @returns The created action column.
   */
  action: (
    props: DataTableActionColumnDef<TData>
  ) => DisplayColumnDef<TData, unknown>
  /**
   * Create a select column.
   *
   * @param props The props to create the select column for.
   * @returns The created select column.
   */
  select: (
    props?: DataTableSelectColumnDef<TData>
  ) => DisplayColumnDef<TData, unknown>
}

export interface DataTableSortingState extends ColumnSort {}
export interface DataTableRowSelectionState extends RowSelectionState {}
export interface DataTablePaginationState extends PaginationState {}
export type DataTableFilteringState<
  T extends Record<string, unknown> = Record<string, unknown>
> = {
  [K in keyof T]: T[K]
}

export type DataTableFilterType =
  | "radio"
  | "select"
  | "date"
  | "multiselect"
  | "string"
  | "number"
  | "custom"
export type DataTableFilterOption<T = string> = {
  label: string
  value: T
}

interface DataTableBaseFilterProps {
  type: DataTableFilterType
  label: string
}

export interface DataTableRadioFilterProps extends DataTableBaseFilterProps {
  type: "radio"
  options: DataTableFilterOption[]
}

export interface DataTableSelectFilterProps extends DataTableBaseFilterProps {
  type: "select"
  options: DataTableFilterOption[]
}

export interface DataTableDateFilterProps extends DataTableBaseFilterProps {
  type: "date"
  /**
   * The format of the date.
   * @default "date"
   */
  format?: "date" | "date-time"
  /**
   * The label to display for the range option.
   */
  rangeOptionLabel?: string
  /**
   * The label to display for the start of the range option.
   */
  rangeOptionStartLabel?: string
  /**
   * The label to display for the end of the range option.
   */
  rangeOptionEndLabel?: string
  /**
   * Whether to disable the range option.
   */
  disableRangeOption?: boolean
  /**
   * A function to format the date value.
   *
   * @example
   * ```tsx
   * formatDateValue={(value) => value.toLocaleDateString()}
   * ```
   */
  formatDateValue?: (value: Date) => string
  /**
   * The options to display in the filter.
   *
   * @example
   * ```tsx
   * options: [
   *   { label: "Today", value: { $gte: new Date().toISOString() } },
   *   { label: "Yesterday", value: { $gte: new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toISOString() } },
   * ]
   * ```
   */
  options: DataTableFilterOption<DataTableDateComparisonOperator>[]
}

export interface DataTableMultiselectFilterProps
  extends DataTableBaseFilterProps {
  type: "multiselect"
  options: DataTableFilterOption[]
  /**
   * Whether to show a search input for the options.
   * @default true
   */
  searchable?: boolean
}

export interface DataTableStringFilterProps extends DataTableBaseFilterProps {
  type: "string"
  /**
   * Placeholder text for the input.
   */
  placeholder?: string
}

export interface DataTableNumberFilterProps extends DataTableBaseFilterProps {
  type: "number"
  /**
   * Placeholder text for the input.
   */
  placeholder?: string
  /**
   * Whether to include comparison operators.
   * @default true
   */
  includeOperators?: boolean
}

export interface DataTableCustomFilterProps extends DataTableBaseFilterProps {
  type: "custom"
  /**
   * Custom render function for the filter.
   */
  render: (props: {
    value: any
    onChange: (value: any) => void
    onRemove: () => void
  }) => React.ReactNode
}

export type DataTableFilterProps =
  | DataTableRadioFilterProps
  | DataTableSelectFilterProps
  | DataTableDateFilterProps
  | DataTableMultiselectFilterProps
  | DataTableStringFilterProps
  | DataTableNumberFilterProps
  | DataTableCustomFilterProps

export type DataTableFilter<
  T extends DataTableFilterProps = DataTableFilterProps
> = T & {
  id: string
}

export enum DataTableEmptyState {
  EMPTY = "EMPTY",
  FILTERED_EMPTY = "FILTERED_EMPTY",
  POPULATED = "POPULATED",
}

export type DataTableDateComparisonOperator = {
  /**
   * The filtered date must be greater than or equal to this value.
   */
  $gte?: string
  /**
   * The filtered date must be less than or equal to this value.
   */
  $lte?: string
  /**
   * The filtered date must be less than this value.
   */
  $lt?: string
  /**
   * The filtered date must be greater than this value.
   */
  $gt?: string
}

export type DataTableNumberComparisonOperator = {
  /**
   * The filtered number must be greater than or equal to this value.
   */
  $gte?: number
  /**
   * The filtered number must be less than or equal to this value.
   */
  $lte?: number
  /**
   * The filtered number must be less than this value.
   */
  $lt?: number
  /**
   * The filtered number must be greater than this value.
   */
  $gt?: number
  /**
   * The filtered number must be equal to this value.
   */
  $eq?: number
}

type DataTableCommandAction = (
  selection: DataTableRowSelectionState
) => void | Promise<void>

export interface DataTableCommand {
  /**
   * The label to display in the command bar.
   */
  label: string
  /**
   * The action to perform when the command is selected.
   */
  action: DataTableCommandAction
  /**
   * The shortcut to use for the command.
   *
   * @example "i"
   */
  shortcut: string
}

export type DataTableEmptyStateContent = {
  /**
   * The heading to display in the empty state.
   */
  heading?: string
  /**
   * The description to display in the empty state.
   */
  description?: string
  /**
   * A custom component to display in the empty state, if provided it will override the heading and description.
   */
  custom?: React.ReactNode
}

export type DataTableEmptyStateProps = {
  /**
   * The empty state to display when the table is filtered, but no rows are found.
   */
  filtered?: DataTableEmptyStateContent
  /**
   * The empty state to display when the table is empty.
   */
  empty?: DataTableEmptyStateContent
}

export interface DataTableColumnFilter extends ColumnFilter {}
