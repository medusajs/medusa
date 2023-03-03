import { useAdminProducts } from "medusa-react"
import React, { useEffect, useState } from "react"
import Spinner from "../../../../../../components/atoms/spinner"
import Modal from "../../../../../../components/molecules/modal"
import { SelectableTable } from "../../../../../../components/templates/selectable-table"
import useQueryFilters from "../../../../../../hooks/use-query-filters"
import { useConditions } from "../../../../details/conditions/add-condition/conditions-provider"
import {
  AddConditionSelectorProps,
  DiscountConditionOperator,
} from "../../../../types"
import { defaultQueryProps } from "../shared/common"
import ConditionOperator from "../shared/condition-operator"
import {
  ProductRow,
  ProductsHeader,
  useProductColumns,
} from "../shared/products"
import DetailsConditionFooter from "./details-condition-footer"

const DetailsProductConditionSelector = ({
  onClose,
}: AddConditionSelectorProps) => {
  const params = useQueryFilters(defaultQueryProps)

  const { conditions } = useConditions()

  const [items, setItems] = useState(conditions.products?.items || [])
  const [operator, setOperator] = useState<DiscountConditionOperator>(
    conditions.products.operator
  )

  const { isLoading, count, products } = useAdminProducts(params.queryObject, {
    keepPreviousData: true,
  })

  const changed = (values: string[]) => {
    const selectedProducts =
      products?.filter((product) => values.includes(product.id)) || []

    setItems(
      selectedProducts.map((product) => ({
        id: product.id,
        label: product.title,
      }))
    )
  }

  const columns = useProductColumns()

  return (
    <>
      <Modal.Content>
        <ConditionOperator value={operator} onChange={setOperator} />
        <SelectableTable
          options={{
            enableSearch: true,
            immediateSearchFocus: true,
            searchPlaceholder: "Search products...",
          }}
          resourceName="Products"
          totalCount={count || 0}
          selectedIds={items.map((i) => i.id)}
          data={products}
          columns={columns}
          isLoading={isLoading}
          onChange={changed}
          renderRow={ProductRow}
          renderHeaderGroup={ProductsHeader}
          {...params}
        />
      </Modal.Content>
      <Modal.Footer>
        <DetailsConditionFooter
          type="products"
          items={items}
          onClose={onClose}
          operator={operator}
        />
      </Modal.Footer>
    </>
  )
}

export default DetailsProductConditionSelector
