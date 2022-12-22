import { MoneyAmount, Product, ProductVariant } from "@medusajs/medusa"
import { useAdminStore } from "medusa-react"
import * as React from "react"
import Button from "../../../../components/fundamentals/button"
import EditIcon from "../../../../components/fundamentals/icons/edit-icon"
import PlusIcon from "../../../../components/fundamentals/icons/plus-icon"
import SearchIcon from "../../../../components/fundamentals/icons/search-icon"
import TrashIcon from "../../../../components/fundamentals/icons/trash-icon"
import LoadingContainer from "../../../../components/loading-container"
import { ActionType } from "../../../../components/molecules/actionables"
import InputField from "../../../../components/molecules/input"
import Modal from "../../../../components/molecules/modal"
import ProductVariantTree from "../../../../components/organisms/product-variant-tree"
import AddProductsModal from "../../../../components/templates/add-products-modal"
import PriceOverrides from "../../../../components/templates/price-overrides"
import { mergeExistingWithDefault } from "../../details/utils"
import { usePriceListForm } from "../form/pricing-form-context"
import { CreatePriceListPricesFormValues } from "../types"

export type ProductPricesProps = {
  products: Product[]
  setProducts: (products: Product[]) => void
  getVariantActions?: (
    product: Product,
    setProduct: (product: Product) => void
  ) => ActionType[] | undefined
  getProductActions?: (product: Product) => ActionType[] | undefined
  isLoading?: boolean
  onSearch?: (query: string) => void
  onFileChosen?: (files: any[]) => void
}

const ProductPrices = ({
  products,
  setProducts,
  isLoading = false,
  onSearch,
  onFileChosen,
}: ProductPricesProps) => {
  const [showAdd, setShowAdd] = React.useState(false)
  const [
    selectedVariant,
    setSelectedVariant,
  ] = React.useState<ProductVariant | null>(null)
  const unselect = () => setSelectedVariant(null)

  const { prices, setPrices } = usePriceListForm()
  const { store } = useAdminStore()

  const onChange = (e) => {
    const query = e.target.value
    if (onSearch) {
      onSearch(query)
    }
  }

  const defaultPrices = store?.currencies.map((curr) => ({
    currency_code: curr.code,
    amount: 0,
  })) as MoneyAmount[]

  const getVariantActions = (variant) => {
    return [
      {
        label: "Edit prices",
        icon: <EditIcon />,
        onClick: () => {
          setSelectedVariant(variant)
        },
      },
      {
        label: "Remove from list",
        icon: <TrashIcon size={20} />,
        onClick: () => {
          // missing core support
        },
        variant: "danger" as const,
      },
    ]
  }

  const handleSubmit = (values) => {
    values.variants.forEach((variantId: string) => {
      const prices: CreatePriceListPricesFormValues[number] = values.prices
        .filter((pr) => pr.amount > 0)
        .map((pr) => ({
          amount: pr.amount,
          currency_code: pr.currency_code,
        }))
      setPrices((state) => ({
        ...state,
        [variantId]: prices,
      }))
      unselect()
    })
  }

  const selectedProduct = findProduct(products, selectedVariant)

  return (
    <div className="mt-6">
      <div>
        {onSearch && (
          <div className="mb-2">
            <InputField
              placeholder="Search by name or SKU..."
              prefix={<SearchIcon />}
              onChange={onChange}
            />
          </div>
        )}
        <div>
          <LoadingContainer isLoading={isLoading}>
            {products.map((product) => (
              <div className="mt-2">
                <ProductVariantTree
                  product={product}
                  key={product.id}
                  getVariantActions={getVariantActions}
                />
              </div>
            ))}
          </LoadingContainer>
        </div>
      </div>
      <div className="mt-6">
        <Button
          variant="secondary"
          size="medium"
          className="w-full rounded-rounded"
          onClick={() => setShowAdd(true)}
        >
          <PlusIcon />
          Add Products Manually
        </Button>
      </div>

      {/* {onFileChosen && (
        <div className="mt-3">
          <FileUploadField
            className="py-8"
            onFileChosen={onFileChosen}
            filetypes={[".csx", ".xlsx", ".xls"]}
            placeholder="Only .csv files up to 5MB are supported"
            text={
              <span>
                Drop your price list file here, or{" "}
                <span className="text-violet-60">click to browse</span>
              </span>
            }
          />
        </div>
      )} */}

      {showAdd && (
        <AddProductsModal
          onSave={setProducts}
          initialSelection={products}
          close={() => setShowAdd(false)}
        />
      )}
      {selectedVariant && (
        <Modal open handleClose={unselect}>
          <Modal.Body>
            <Modal.Header handleClose={unselect}>
              <h2 className="inter-xlarge-semibold">Edit Prices</h2>
            </Modal.Header>

            <PriceOverrides
              onClose={unselect}
              variants={selectedProduct.variants}
              prices={
                prices
                  ? mergeExistingWithDefault(
                      prices[selectedVariant.id],
                      defaultPrices
                    )
                  : defaultPrices
              }
              defaultVariant={selectedVariant}
              onSubmit={handleSubmit}
            />
          </Modal.Body>
        </Modal>
      )}
    </div>
  )
}

const findProduct = (
  products: Product[] = [],
  variant: ProductVariant | null
): Product => {
  return products.find((product) =>
    product.variants.find((v) => v.id === variant?.id)
  )!
}

export default ProductPrices
