"use client"

import { createColumnHelper as createColumnHelperTanstack } from "@tanstack/react-table"
import * as React from "react"
import { DataTableActionCell } from "../components/data-table-action-cell"
import {
  DataTableSelectCell,
  DataTableSelectHeader,
} from "../components/data-table-select-cell"
import {
  DataTableActionColumnDef,
  DataTableColumnHelper,
  DataTableSelectColumnDef,
  DataTableSortableColumnDef,
  DataTableSortableColumnDefMeta,
  DataTableAlignableColumnDef,
  DataTableAlignableColumnDefMeta,
} from "../types"

const createDataTableColumnHelper = <
  TData,
>(): DataTableColumnHelper<TData> => {
  const { accessor: accessorTanstack, display } =
    createColumnHelperTanstack<TData>()

  return {
    accessor: (accessor, column) => {
      const {
        sortLabel,
        sortAscLabel,
        sortDescLabel,
        headerAlign,
        align,
        meta,
        enableSorting,
        ...rest
      } = column as any & DataTableSortableColumnDef & DataTableAlignableColumnDef

      const extendedMeta: DataTableSortableColumnDefMeta & DataTableAlignableColumnDefMeta = {
        ___sortMetaData: { sortLabel, sortAscLabel, sortDescLabel },
        ___alignMetaData: { headerAlign, align },
        ...(meta || {}),
      }

      return accessorTanstack(accessor, {
        ...rest,
        enableSorting: enableSorting ?? false,
        meta: extendedMeta,
      })
    },
    display,
    action: ({ actions, ...props }: DataTableActionColumnDef<TData>) =>
      display({
        id: "action",
        cell: (ctx) => <DataTableActionCell ctx={ctx} />,
        meta: {
          ___actions: actions,
          ...(props.meta || {}),
        },
        ...props,
      }),
    select: (props?: DataTableSelectColumnDef<TData>) =>
      display({
        id: "select",
        header: props?.header
          ? props.header
          : (ctx) => <DataTableSelectHeader ctx={ctx} />,
        cell: props?.cell
          ? props.cell
          : (ctx) => <DataTableSelectCell ctx={ctx} />,
      }),
  }
}

const helper = createColumnHelperTanstack()

helper.accessor("name", {
  meta: {},
})

export { createDataTableColumnHelper }
