import React from "react"
import Checkbox from "../components/atoms/checkbox"
import Table from "../components/molecules/table"

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef()
    const resolvedRef = ref || defaultRef

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate
    }, [resolvedRef, indeterminate])

    return (
      <div onClickCapture={(e) => e.stopPropagation()}>
        <Checkbox
          className="justify-center"
          label=""
          ref={resolvedRef}
          {...rest}
        />
      </div>
    )
  }
)

export const useSelectionColumn = () => {
  return {
    id: "selection",
    Header: ({ getToggleAllRowsSelectedProps }) => (
      <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
    ),
    Cell: ({ row }) => (
      <Table.Cell className="text-center">
        <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
      </Table.Cell>
    ),
  }
}
