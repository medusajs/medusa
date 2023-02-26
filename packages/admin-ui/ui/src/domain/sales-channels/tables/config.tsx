import React from "react"

import IndeterminateCheckbox from "../../../components/molecules/indeterminate-checkbox"
import ImagePlaceholder from "../../../components/fundamentals/image-placeholder"

export const SALES_CHANNEL_PRODUCTS_TABLE_COLUMNS = [
  {
    width: 30,
    id: "selection",
    Header: ({ getToggleAllPageRowsSelectedProps }) => (
      <span className="flex justify-center">
        <IndeterminateCheckbox {...getToggleAllPageRowsSelectedProps()} />
      </span>
    ),
    Cell: ({ row }) => {
      return (
        <span
          onClick={(e) => e.stopPropagation()}
          className="flex justify-center"
        >
          <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
        </span>
      )
    },
  },
  {
    Header: "Name",
    accessor: "title",
    Cell: ({ row: { original } }) => {
      return (
        <div className="flex items-center">
          <div className="h-[40px] w-[30px] my-1.5 flex items-center mr-4">
            {original.thumbnail ? (
              <img
                src={original.thumbnail}
                className="h-full object-cover rounded-soft"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full rounded-soft bg-grey-10">
                <ImagePlaceholder size={16} />
              </div>
            )}
          </div>
          {original.title}
        </div>
      )
    },
  },
  {
    Header: "Collection",
    accessor: "collection",
    Cell: ({ cell: { value } }) => {
      return <div>{value?.title || "-"}</div>
    },
  },
]
