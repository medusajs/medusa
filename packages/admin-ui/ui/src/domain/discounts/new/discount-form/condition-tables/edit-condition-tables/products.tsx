import { Product } from "@medusajs/medusa"
import { useAdminProducts } from "medusa-react"
import { useState } from "react"
import Modal from "../../../../../../components/molecules/modal"
import { SelectableTable } from "../../../../../../components/templates/selectable-table"
import useQueryFilters from "../../../../../../hooks/use-query-filters"
import { DiscountConditionOperator } from "../../../../types"
import { useDiscountForm } from "../../form/discount-form-context"
import { defaultQueryProps } from "../shared/common"
import ConditionOperator from "../shared/condition-operator"
import {
  ProductRow,
  ProductsHeader,
  useProductColumns,
} from "../shared/products"
import EditConditionFooter from "./edit-condition-footer"

const EditProductConditionSelector = ({ onClose }) => {
  const params = useQueryFilters(defaultQueryProps)
  const { conditions } = useDiscountForm()
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
          data={products as Product[] | undefined}
          columns={columns}
          isLoading={isLoading}
          onChange={changed}
          renderRow={ProductRow}
          renderHeaderGroup={ProductsHeader}
          {...params}
        />
      </Modal.Content>
      <Modal.Footer>
        <EditConditionFooter
          type="products"
          items={items}
          operator={operator}
          onClose={onClose}
        />
      </Modal.Footer>
    </>
  )
}

export default EditProductConditionSelector
