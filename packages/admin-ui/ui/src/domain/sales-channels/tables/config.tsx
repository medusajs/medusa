import { Translation } from "react-i18next"
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
    Header: <Translation>{(t) => t("tables-name", "Name")}</Translation>,
    accessor: "title",
    Cell: ({ row: { original } }) => {
      return (
        <div className="flex items-center">
          <div className="my-1.5 mr-4 flex h-[40px] w-[30px] items-center">
            {original.thumbnail ? (
              <img
                src={original.thumbnail}
                className="rounded-soft h-full object-cover"
              />
            ) : (
              <div className="rounded-soft bg-grey-10 flex h-full w-full items-center justify-center">
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
    Header: (
      <Translation>{(t) => t("tables-collection", "Collection")}</Translation>
    ),
    accessor: "collection",
    Cell: ({ cell: { value } }) => {
      return <div>{value?.title || "-"}</div>
    },
  },
]
