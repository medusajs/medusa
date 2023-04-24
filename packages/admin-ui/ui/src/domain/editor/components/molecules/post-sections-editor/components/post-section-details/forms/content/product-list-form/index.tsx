import { FC, useEffect, useMemo, useState } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { Product, ProductStatus } from "@medusajs/medusa"
import { useAdminCollections, useAdminProductTags } from "medusa-react"
import Medusa from "../../../../../../../../../../services/api"
import AddProductsTable from "../../../../../../../../../../components/templates/collection-product-table/add-product-table"
import { useGetVendors } from "../../../../../../../../../../hooks/admin/vendors"
import Input from "../../../../../../../../../../components/molecules/input"
import {
  ButtonGroup,
  ButtonGroupItem,
} from "../../../../../../../../../../components/molecules/button-group"
import Spinner from "../../../../../../../../../../components/atoms/spinner"
import { NextSelect as Select } from "../../../../../../../../../../components/molecules/select/next-select"
import ActionTable from "../../../../../../../../../../components/organisms/action-table"
import Button from "../../../../../../../../../../components/fundamentals/button"
import PlusIcon from "../../../../../../../../../../components/fundamentals/icons/plus-icon"
import { ProductListFormValues } from "../../../../../types"
import { usePostSectionContext } from "../../../context/post-section-context"
import { EditorSimple } from "../../../../../../../../../../components/organisms/editor"
import { RichTextInput } from "../../../../../../../../../../components/molecules/rich-text-input"
import { CollectionsPickerInput } from "../../../../../../../../../../components/molecules/collections-picker-input"
import Switch from "../../../../../../../../../../components/atoms/switch"
import { ProductListSortableTable } from "./product-list-sortable-table"

export interface ProductListFormProps {}

export const ProductListForm: FC<ProductListFormProps> = () => {
  const { postSection } = usePostSectionContext()
  const formMethods = useFormContext()
  const { product_tags: tags, isLoading: isLoadingTags } = useAdminProductTags()
  const { collections, isLoading: isLoadingCollections } = useAdminCollections()
  const { vendors, isLoading: isLoadingVendors } = useGetVendors()
  const [isLoading, setIsLoading] = useState(false)
  const [showAddProducts, setShowAddProducts] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])

  const productSelect = formMethods.watch("content.product_select")
  const productFilters = formMethods.watch("content.product_filter")
  const includeCollectionTabs = formMethods.watch(
    "content.include_collection_tabs"
  )

  const tagOptions = useMemo(
    () =>
      tags ? tags.map(({ id, value }) => ({ label: value, value: id })) : [],
    [tags]
  )

  const collectionOptions = useMemo(
    () =>
      collections
        ? collections.map((collection) => ({
            label: collection.title,
            value: collection.id,
          }))
        : [],
    [collections]
  )

  const vendorOptions = useMemo(
    () =>
      vendors
        ? vendors.map((vendor) => ({
            label: vendor.name,
            value: vendor.id,
          }))
        : [],
    [vendors]
  )

  const orderOptions = [
    { label: "Newest", value: "-created_at" },
    { label: "Oldest", value: "created_at" },
    { label: "Name (A-Z)", value: "title" },
    { label: "Name (Z-A)", value: "-title" },
    // TODO: Implement sorting by "popular" and "price" in API
    // { label: "Popular", value: "popular" },
    // { label: "Price", value: "price" },
  ]

  const pickProducts = async (id: string[]) => {
    let updatedProducts = []

    if (id?.length) {
      setIsLoading(true)

      const { data } = await Medusa.products.list({ id, status: "published" })

      // Sort new products to match order of updatedProductIds
      updatedProducts = data.products.sort(
        (a, b) => id.indexOf(a.id) - id.indexOf(b.id)
      )

      setIsLoading(false)
    }

    setSelectedProducts(updatedProducts)
  }

  const filterProducts = async (
    filter: ProductListFormValues["content"]["product_filter"]
  ) => {
    setIsLoading(true)

    const { data } = await Medusa.products.list({
      ...filter,
      status: "published",
    })

    setIsLoading(false)
    setSelectedProducts(data.products)
  }

  const handleCollectionsChange = (value) => {
    const collectionId = value.map((v) => v.value)

    formMethods.setValue("content.product_filter.collection_id", collectionId, {
      shouldDirty: true,
    })
  }

  const handleTagsChange = (value) => {
    const tags = value.map((v) => v.value)

    formMethods.setValue("content.product_filter.tags", tags, {
      shouldDirty: true,
    })
  }

  const handleVendorsChange = (value) => {
    const vendors = value.map((v) => v.value)

    formMethods.setValue("content.product_filter.vendor_id", vendors, {
      shouldDirty: true,
    })
  }

  const handlePickAddProducts = async (
    selectedProductIds,
    removedProductIds
  ) => {
    // TODO: Need to keep the order of the previously added products,
    // so we need to filter those from the selectedProductIds before updating the state.
    let previousProductIds = formMethods.getValues("content.product_id") || []

    // Filter removed product ids from previous product ids.
    previousProductIds = previousProductIds.filter(
      (id) => !removedProductIds.length || !removedProductIds.includes(id)
    )

    // Filter previouw product ids from new product ids.
    const newProductIds = selectedProductIds?.filter(
      (id) => !previousProductIds.length || !previousProductIds.includes(id)
    )

    // Combine previous and new product ids, maintaining sort order.
    const updatedProductIds = [...previousProductIds, ...newProductIds]

    formMethods.setValue("content.product_id", updatedProductIds, {
      shouldDirty: true,
    })

    pickProducts(updatedProductIds)

    setShowAddProducts(false)
  }

  const handlePickReorderProducts = async (updated) => {
    formMethods.setValue("content.product_id", updated.map((p) => p.id) || [], {
      shouldDirty: true,
    })
    setSelectedProducts(updated)
  }

  const handleProductSelectChange = () => {
    if (!postSection) return

    const productSelect = formMethods.getValues("content.product_select")

    if (productSelect === "id") {
      const productId = formMethods.getValues("content.product_id")
      pickProducts(productId)
    }

    if (productSelect === "filter") {
      const productFilter = formMethods.getValues("content.product_filter")
      filterProducts(productFilter)
    }
  }

  useEffect(() => {
    handleProductSelectChange()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    productFilters?.collection_id,
    productFilters?.tags,
    productFilters?.vendor_id,
    productFilters?.q,
    productFilters?.order,
    productFilters?.limit,
  ])

  return (
    <>
      <div className="flex flex-col gap-x-8 gap-y-4">
        <Input
          label="Heading"
          {...formMethods.register("content.heading.value")}
        />

        <RichTextInput
          label="Text"
          name="content.text.value"
          placeholder="Enter text..."
          editor={EditorSimple}
        />

        <ActionTable name="content.actions" translatable narrow />

        <hr className="my-2" />

        <h3 className="inter-large-semibold text-grey-90">Products</h3>
        <div className="flex items-center gap-2">
          <ButtonGroup
            type="single"
            value={productSelect}
            onValueChange={(newValue) => {
              if (newValue) {
                formMethods.setValue(
                  "content.product_select",
                  newValue as ProductListFormValues["content"]["product_select"],
                  {
                    shouldDirty: true,
                  }
                )
                handleProductSelectChange()
              }
            }}
          >
            <ButtonGroupItem value="filter">Filter products</ButtonGroupItem>
            <ButtonGroupItem value="id">Pick products</ButtonGroupItem>
          </ButtonGroup>

          {isLoading && (
            <div className="flex-grow-0 flex-shrink-0">
              <Spinner variant="secondary" size="medium" />
            </div>
          )}
        </div>

        {productSelect === "filter" && (
          <>
            <div className="flex flex-col gap-4 my-2">
              <h3 className="inter-base-semibold text-grey-90">
                Collection tabs
              </h3>

              <Controller
                name="content.include_collection_tabs"
                control={formMethods.control}
                render={({ field: { value, onChange, ...field } }) => (
                  <Switch
                    label="Include collection tabs"
                    {...field}
                    checked={value}
                    onCheckedChange={onChange}
                  />
                )}
              />

              {includeCollectionTabs && collections && (
                <CollectionsPickerInput
                  name="content.collection_tab_id"
                  collections={collections}
                />
              )}
            </div>

            <div className="flex flex-col gap-4">
              {!includeCollectionTabs && (
                <Controller
                  name="content.product_filter.collection_id"
                  control={formMethods.control}
                  render={({ field }) => {
                    const value = field.value
                      ?.map((v) => collectionOptions.find((o) => o.value === v))
                      .filter((v) => v)

                    return (
                      <Select
                        isMulti={true}
                        label="Collections"
                        value={value}
                        options={collectionOptions}
                        onChange={handleCollectionsChange}
                        isDisabled={isLoadingCollections}
                        isLoading={isLoadingCollections}
                      />
                    )
                  }}
                />
              )}

              <Controller
                name="content.product_filter.tags"
                control={formMethods.control}
                render={({ field }) => {
                  const value = field.value
                    ?.map((v) => tagOptions.find((o) => o.value === v))
                    .filter((v) => v)

                  return (
                    <Select
                      isMulti={true}
                      label="Tags"
                      value={value}
                      options={tagOptions}
                      onChange={handleTagsChange}
                      isDisabled={isLoadingTags}
                      isLoading={isLoadingTags}
                    />
                  )
                }}
              />

              <Controller
                name="content.product_filter.vendor_id"
                control={formMethods.control}
                render={({ field }) => {
                  const value = field.value
                    ?.map((v) => vendorOptions.find((o) => o.value === v))
                    .filter((v) => v)

                  return (
                    <Select
                      isMulti={true}
                      label="Vendors"
                      value={value}
                      options={vendorOptions}
                      onChange={handleVendorsChange}
                      isDisabled={isLoadingVendors}
                      isLoading={isLoadingVendors}
                    />
                  )
                }}
              />

              <Input
                label="Search query"
                {...formMethods.register("content.product_filter.q")}
              />

              <Controller
                name="content.product_filter.order"
                control={formMethods.control}
                render={({ field }) => {
                  const value = orderOptions.find(
                    (o) => o.value === field.value
                  )

                  return (
                    <Select
                      isMulti={false}
                      label="Sort by"
                      value={value}
                      options={orderOptions}
                      // @ts-ignore
                      onChange={({ value }) => {
                        formMethods.setValue(
                          "content.product_filter.order",
                          value,
                          {
                            shouldDirty: true,
                          }
                        )
                      }}
                    />
                  )
                }}
              />

              <Input
                label="Limit"
                type="number"
                min={3}
                max={24}
                {...formMethods.register("content.product_filter.limit")}
              />
            </div>
          </>
        )}

        {productSelect === "id" && (
          <>
            <div>
              <Button
                variant="secondary"
                size="small"
                onClick={() => setShowAddProducts(true)}
              >
                <PlusIcon />
                Add Products
              </Button>
            </div>
            <div>
              {!!selectedProducts.length && (
                <ProductListSortableTable
                  name="content.product_id"
                  products={selectedProducts}
                  onChange={handlePickReorderProducts}
                  className="mb-2"
                />
              )}
            </div>
          </>
        )}
      </div>

      {showAddProducts && (
        <AddProductsTable
          onClose={() => setShowAddProducts(false)}
          onSubmit={handlePickAddProducts}
          existingRelations={selectedProducts}
          showStatus={false}
          query={{ status: ["published"] as ProductStatus[] }}
        />
      )}
    </>
  )
}
