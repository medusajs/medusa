import { HttpTypes } from "@medusajs/types"
import { Button, toast } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

import { Form } from "../../../../../components/common/form"
import { Combobox } from "../../../../../components/inputs/combobox"
import { RouteDrawer, useRouteModal } from "../../../../../components/modals"
import { KeyboundForm } from "../../../../../components/utilities/keybound-form"
import {
  FormExtensionZone,
  useExtendableForm,
} from "../../../../../dashboard-app"
import { useUpdateProduct } from "../../../../../hooks/api/products"
import { useComboboxData } from "../../../../../hooks/use-combobox-data"
import { sdk } from "../../../../../lib/client"
import { useExtension } from "../../../../../providers/extension-provider"
import { CategoryCombobox } from "../../../common/components/category-combobox"
import { usePermissions } from "../../../../../providers/permissions-provider"
import { PermissionGuard } from "../../../../../components/common/permission-guard"
import { collectionsQueryKeys } from "../../../../../hooks/api/collections"
import { productTypesQueryKeys } from "../../../../../hooks/api/product-types"
import { productTagsQueryKeys } from "../../../../../hooks/api/tags"

type ProductOrganizationFormProps = {
  product: HttpTypes.AdminProduct
}

const ProductOrganizationSchema = zod.object({
  type_id: zod.string().nullable(),
  collection_id: zod.string().nullable(),
  category_ids: zod.array(zod.string()),
  tag_ids: zod.array(zod.string()),
})

export const ProductOrganizationForm = ({
  product,
}: ProductOrganizationFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()
  const { getFormConfigs, getFormFields } = useExtension()

  const { hasPermission } = usePermissions()

  const canUpdateTypes = hasPermission("product_type:update")
  const canUpdateCollections = hasPermission("product_collection:update")
  const canUpdateTags = hasPermission("product_tag:update")
  const canUpdateCategories = hasPermission("product_category:update")

  const configs = getFormConfigs("product", "organize")
  const fields = getFormFields("product", "organize")

  const collections = useComboboxData({
    queryKey: collectionsQueryKeys.lists(),
    queryFn: (params) => sdk.admin.productCollection.list(params),
    getOptions: (data) =>
      data.collections.map((collection) => ({
        label: collection.title!,
        value: collection.id!,
      })),
    enabled: canUpdateCollections,
  })

  const types = useComboboxData({
    queryKey: productTypesQueryKeys.lists(),
    queryFn: (params) => sdk.admin.productType.list(params),
    getOptions: (data) =>
      data.product_types.map((type) => ({
        label: type.value,
        value: type.id,
      })),
    enabled: canUpdateTypes,
  })

  const tags = useComboboxData({
    queryKey: productTagsQueryKeys.lists(),
    queryFn: (params) => sdk.admin.productTag.list(params),
    getOptions: (data) =>
      data.product_tags.map((tag) => ({
        label: tag.value,
        value: tag.id,
      })),
    enabled: canUpdateTags,
  })

  const form = useExtendableForm({
    defaultValues: {
      type_id: product.type_id ?? "",
      collection_id: product.collection_id ?? "",
      category_ids: product.categories?.map((c) => c.id) || [],
      tag_ids: product.tags?.map((t) => t.id) || [],
    },
    schema: ProductOrganizationSchema,
    configs: configs,
    data: product,
  })

  const { mutateAsync, isPending } = useUpdateProduct(product.id)

  const handleSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(
      {
        type_id: canUpdateTypes ? data.type_id || null : undefined,
        collection_id: canUpdateCollections
          ? data.collection_id || null
          : undefined,
        categories: canUpdateCategories
          ? data.category_ids.map((c) => ({ id: c }))
          : undefined,
        tags: canUpdateTags ? data.tag_ids?.map((t) => ({ id: t })) : undefined,
      },
      {
        onSuccess: ({ product }) => {
          toast.success(
            t("products.organization.edit.toasts.success", {
              title: product.title,
            })
          )
          handleSuccess()
        },
        onError: (error) => {
          toast.error(error.message)
        },
      }
    )
  })

  return (
    <RouteDrawer.Form form={form}>
      <KeyboundForm onSubmit={handleSubmit} className="flex h-full flex-col">
        <RouteDrawer.Body>
          <div className="flex h-full flex-col gap-y-4">
            <PermissionGuard permission="product_type:update">
              <Form.Field
                control={form.control}
                name="type_id"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Label optional>
                        {t("products.fields.type.label")}
                      </Form.Label>
                      <Form.Control>
                        <Combobox
                          {...field}
                          value={field.value || ""}
                          onChange={(value) => field.onChange(value || "")}
                          options={types.options}
                          searchValue={types.searchValue}
                          onSearchValueChange={types.onSearchValueChange}
                          fetchNextPage={types.fetchNextPage}
                          allowClear
                        />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
            </PermissionGuard>
            <PermissionGuard permission="product_collection:update">
              <Form.Field
                control={form.control}
                name="collection_id"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Label optional>
                        {t("products.fields.collection.label")}
                      </Form.Label>
                      <Form.Control>
                        <Combobox
                          {...field}
                          value={field.value || ""}
                          onChange={(value) => field.onChange(value || "")}
                          multiple={false}
                          options={collections.options}
                          onSearchValueChange={collections.onSearchValueChange}
                          searchValue={collections.searchValue}
                          allowClear
                        />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
            </PermissionGuard>
            <PermissionGuard permission="product_category:update">
              <Form.Field
                control={form.control}
                name="category_ids"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Label optional>
                        {t("products.fields.categories.label")}
                      </Form.Label>
                      <Form.Control>
                        <CategoryCombobox {...field} />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
            </PermissionGuard>
            <PermissionGuard permission="product_tag:update">
              <Form.Field
                control={form.control}
                name="tag_ids"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Label optional>
                        {t("products.fields.tags.label")}
                      </Form.Label>
                      <Form.Control>
                        <Combobox
                          {...field}
                          multiple
                          options={tags.options}
                          onSearchValueChange={tags.onSearchValueChange}
                          searchValue={tags.searchValue}
                        />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
            </PermissionGuard>
            <FormExtensionZone fields={fields} form={form} />
          </div>
        </RouteDrawer.Body>
        <RouteDrawer.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <RouteDrawer.Close asChild>
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </RouteDrawer.Close>
            <Button size="small" type="submit" isLoading={isPending}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteDrawer.Footer>
      </KeyboundForm>
    </RouteDrawer.Form>
  )
}
