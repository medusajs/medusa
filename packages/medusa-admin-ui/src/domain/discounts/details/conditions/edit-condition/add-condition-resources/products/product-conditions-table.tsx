import { useAdminProducts } from "medusa-react"
import React, { useEffect, useState } from "react"
import Modal from "../../../../../../../components/molecules/modal"
import { SelectableTable } from "../../../../../../../components/templates/selectable-table"
import useQueryFilters from "../../../../../../../hooks/use-query-filters"
import { defaultQueryProps } from "../../../../../new/discount-form/condition-tables/shared/common"
import {
  ProductRow,
  ProductsHeader,
  useProductColumns,
} from "../../../../../new/discount-form/condition-tables/shared/products"
import { useEditConditionContext } from "../../edit-condition-provider"
import ExistingConditionTableActions from "../../condition-table-actions"

const ProductConditionsTable = () => {
  const params = useQueryFilters(defaultQueryProps)

  const [selectedResources, setSelectedResources] = useState<string[]>([])

  const {
    condition,
    removeConditionResources,
    isLoading,
  } = useEditConditionContext()

  const {
    isLoading: isLoadingProducts,
    count,
    products,
    refetch,
  } = useAdminProducts(
    { discount_condition_id: condition.id },
    {
      keepPreviousData: true,
    }
  )

  const columns = useProductColumns()

  const onDeselect = () => {
    setSelectedResources([])
  }

  const onRemove = () => {
    removeConditionResources(selectedResources)
    onDeselect()
  }

  useEffect(() => {
    if (!isLoading) {
      refetch() // if loading is flipped, we've either added or removed resources -> refetch
      onDeselect()
    }
  }, [isLoading])

  return (
    <Modal.Content>
      <SelectableTable
        options={{
          enableSearch: false,
          tableActions: (
            <ExistingConditionTableActions
              numberOfSelectedRows={selectedResources.length}
              onDeselect={onDeselect}
              onRemove={onRemove}
            />
          ),
        }}
        resourceName="Products"
        totalCount={count ?? 0}
        selectedIds={selectedResources}
        data={products || []}
        columns={columns}
        isLoading={isLoadingProducts}
        onChange={(ids) => setSelectedResources(ids)}
        renderRow={ProductRow}
        renderHeaderGroup={ProductsHeader}
        {...params}
      />
    </Modal.Content>
  )
}

export default ProductConditionsTable
