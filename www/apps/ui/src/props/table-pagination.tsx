import { PropTable } from "@/components/props-table"
import { PropDataMap } from "@/types/props"

const tablePaginationProps: PropDataMap = [
  {
    prop: "count",
    type: "number",
  },
  {
    prop: "pageSize",
    type: "number",
  },
  {
    prop: "pageIndex",
    type: "number",
  },
  {
    prop: "pageCount",
    type: "number",
  },
  {
    prop: "canPreviousPage",
    type: "boolean",
  },
  {
    prop: "canNextPage",
    type: "boolean",
  },
  {
    prop: "previousPage",
    type: {
      type: "function",
      signature: "() => void",
    },
  },
  {
    prop: "nextPage",
    type: {
      type: "function",
      signature: "() => void",
    },
  },
]

const Props = () => {
  return <PropTable props={tablePaginationProps} />
}

export default Props
