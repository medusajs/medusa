import { useAdminProductTypes } from "medusa-react"
import { useState } from "react"
import Modal from "../../../../../../components/molecules/modal"
import { SelectableTable } from "../../../../../../components/templates/selectable-table"
import useQueryFilters from "../../../../../../hooks/use-query-filters"
import { DiscountConditionOperator } from "../../../../types"
import { useDiscountForm } from "../../form/discount-form-context"
import { defaultQueryProps } from "../shared/common"
import ConditionOperator from "../shared/condition-operator"
import { TypeRow, TypesHeader, useTypesColumns } from "../shared/types"
import EditConditionFooter from "./edit-condition-footer"

const EditTypeConditionSelector = ({ onClose }) => {
  const params = useQueryFilters(defaultQueryProps)
  const { conditions } = useDiscountForm()
  const [items, setItems] = useState(conditions.product_types?.items || [])
  const [operator, setOperator] = useState<DiscountConditionOperator>(
    conditions.product_types.operator
  )

  const { isLoading, count, product_types } = useAdminProductTypes(
    params.queryObject,
    {
      // avoid UI flickering by keeping previous data
      keepPreviousData: true,
    }
  )

  const changed = (values: string[]) => {
    const selectedTypes =
      product_types?.filter((type) => values.includes(type.id)) || []

    setItems(selectedTypes.map((type) => ({ id: type.id, label: type.value })))
  }

  const columns = useTypesColumns()

  return (
    <>
      <Modal.Content>
        <ConditionOperator value={operator} onChange={setOperator} />
        <SelectableTable
          options={{
            enableSearch: true,
            immediateSearchFocus: true,
            searchPlaceholder: "Search by type...",
          }}
          resourceName="Types"
          totalCount={count || 0}
          selectedIds={items?.map((c) => c.id)}
          data={product_types}
          columns={columns}
          isLoading={isLoading}
          onChange={changed}
          renderRow={TypeRow}
          renderHeaderGroup={TypesHeader}
          {...params}
        />
      </Modal.Content>
      <Modal.Footer>
        <EditConditionFooter
          type="product_types"
          items={items}
          operator={operator}
          onClose={onClose}
        />
      </Modal.Footer>
    </>
  )
}

export default EditTypeConditionSelector
