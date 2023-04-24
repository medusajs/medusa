import React, { useMemo } from "react"
import { Column } from "react-table"
import { Post } from "@medusajs/medusa"
import moment from "moment"
import Tooltip from "../../atoms/tooltip"
import Table from "../../molecules/table"
import StatusIndicator from "../../fundamentals/status-indicator"
import Badge from "../../fundamentals/badge"
import { HomeIcon } from "@heroicons/react/20/solid"

const statusDisplay = {
  draft: <StatusIndicator title="Draft" variant="default" />,
  published: <StatusIndicator title="Published" variant="success" />,
}

const usePostTableColumns: () => Column<Post>[] = () =>
  useMemo<Column<Post>[]>(
    () => [
      {
        Header: "Title",
        accessor: "title",
        Cell: ({ cell: { value }, row: { index, original } }) => (
          <Table.Cell key={index} className="w-[20%]">
            <div className="flex items-center gap-2">
              {original.is_home_page && (
                <Badge
                  variant="primary"
                  className="inline-flex gap-1 items-center justify-center w-7 h-7 !p-0"
                >
                  <HomeIcon className="flex-0 w-4 h-4" />
                </Badge>
              )}
              <div className="truncate max-w-[240px] pr-4">
                {value || "(Untitled)"}
              </div>
            </div>
          </Table.Cell>
        ),
      },
      {
        Header: "Handle",
        accessor: "handle",
        Cell: ({ cell: { value }, row: { index } }) => (
          <Table.Cell key={index} className="w-[20%]">
            <div className="truncate max-w-[280px]">
              {typeof value === "string" ? `/${value}` : "(no handle)"}
            </div>
          </Table.Cell>
        ),
      },
      {
        Header: <div className="px-4">Status</div>,
        accessor: "status",
        Cell: ({ cell: { value }, row: { index } }) => (
          <Table.Cell key={index} className="px-4">
            {statusDisplay[value]}
          </Table.Cell>
        ),
      },
      {
        Header: <div className="px-4">Date created</div>,
        accessor: "created_at",
        Cell: ({ cell: { value }, row: { index } }) => (
          <Table.Cell key={index} className="px-4">
            <Tooltip content={moment(value).format("DD MMM YYYY hh:mm a")}>
              {moment(value).format("DD MMM YYYY")}
            </Tooltip>
          </Table.Cell>
        ),
      },
      {
        Header: <div className="px-4">Last updated</div>,
        accessor: "updated_at",
        Cell: ({ cell: { value }, row: { index } }) => (
          <Table.Cell key={index} className="px-4">
            <Tooltip content={moment(value).format("DD MMM YYYY hh:mm a")}>
              {moment(value).format("DD MMM YYYY")}
            </Tooltip>
          </Table.Cell>
        ),
      },
      {
        Header: "",
        id: "settings-col",
      },
    ],
    []
  )

export default usePostTableColumns
