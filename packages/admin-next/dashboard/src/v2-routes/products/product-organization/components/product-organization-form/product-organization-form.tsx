import { zodResolver } from "@hookform/resolvers/zod"
import { Product } from "@medusajs/medusa"
import { Button, Select } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"
import { Form } from "../../../../../components/common/form"
import { Combobox } from "../../../../../components/inputs/combobox"
import {
  RouteDrawer,
  useRouteModal,
} from "../../../../../components/route-modal"
import { useCategories } from "../../../../../hooks/api/categories"
import { useCollections } from "../../../../../hooks/api/collections"
import { useProductTypes } from "../../../../../hooks/api/product-types"
import { useUpdateProduct } from "../../../../../hooks/api/products"
import { useTags } from "../../../../../hooks/api/tags"

type ProductOrganizationFormProps = {
  product: Product
}

const ProductOrganizationSchema = zod.object({
  type_id: zod.string().optional(),
  collection_id: zod.string().optional(),
  category_ids: zod.array(zod.string()).optional(),
  tags: zod.array(zod.string()).optional(),
})

export const ProductOrganizationForm = ({
  product,
}: ProductOrganizationFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()
  const { product_types, isLoading: isLoadingTypes } = useProductTypes()
  const { product_tags, isLoading: isLoadingTags } = useTags()
  const { collections, isLoading: isLoadingCollections } = useCollections()
  const { product_categories, isLoading: isLoadingCategories } = useCategories()

  const form = useForm<zod.infer<typeof ProductOrganizationSchema>>({
    defaultValues: {
      type_id: product.type_id || undefined,
      collection_id: product.collection_id || undefined,
      category_ids: product.categories?.map((c) => c.id) || undefined,
      tags: product.tags?.map((t) => t.id) || undefined,
    },
    resolver: zodResolver(ProductOrganizationSchema),
  })

  const { mutateAsync, isLoading } = useUpdateProduct(product.id)

  const handleSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(
      {
        type_id: data.type_id || undefined,
        collection_id: data.collection_id || undefined,
        category_ids: data.category_ids || undefined,
        tags:
          data.tags?.map((t) => {
            t
          }) || undefined,
      },
      {
        onSuccess: () => {
          handleSuccess()
        },
      }
    )
  })

  return (
    <RouteDrawer.Form form={form}>
      <form onSubmit={handleSubmit} className="flex h-full flex-col">
        <RouteDrawer.Body>
          <div className="flex h-full flex-col gap-y-8">
            <Form.Field
              control={form.control}
              name="type_id"
              render={({ field: { onChange, ...field } }) => {
                return (
                  <Form.Item>
                    <Form.Label optional>
                      {t("products.fields.type.label")}
                    </Form.Label>
                    <Form.Control>
                      <Select
                        disabled={isLoadingTypes}
                        {...field}
                        onValueChange={onChange}
                      >
                        <Select.Trigger ref={field.ref}>
                          <Select.Value />
                        </Select.Trigger>
                        <Select.Content>
                          {(product_types ?? []).map((type) => (
                            <Select.Item key={type.id} value={type.id}>
                              {type.value}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select>
                    </Form.Control>
                  </Form.Item>
                )
              }}
            />
            <Form.Field
              control={form.control}
              name="collection_id"
              render={({ field: { onChange, ...field } }) => {
                return (
                  <Form.Item>
                    <Form.Label optional>
                      {t("products.fields.collection.label")}
                    </Form.Label>
                    <Form.Control>
                      <Select
                        disabled={isLoadingCollections}
                        {...field}
                        onValueChange={onChange}
                      >
                        <Select.Trigger ref={field.ref}>
                          <Select.Value />
                        </Select.Trigger>
                        <Select.Content>
                          {(collections ?? []).map((collection) => (
                            <Select.Item
                              key={collection.id}
                              value={collection.id}
                            >
                              {collection.title}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select>
                    </Form.Control>
                  </Form.Item>
                )
              }}
            />
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
                      <Combobox
                        disabled={isLoadingCategories}
                        options={(product_categories ?? []).map((category) => ({
                          label: category.name,
                          value: category.id,
                        }))}
                        {...field}
                      />
                    </Form.Control>
                  </Form.Item>
                )
              }}
            />
            <Form.Field
              control={form.control}
              name="tags"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label optional>
                      {t("products.fields.tags.label")}
                    </Form.Label>
                    <Form.Control>
                      <Combobox
                        disabled={isLoadingTags}
                        options={(product_tags ?? []).map((tag) => ({
                          label: tag.value,
                          value: tag.id,
                        }))}
                        {...field}
                      />
                    </Form.Control>
                  </Form.Item>
                )
              }}
            />
          </div>
        </RouteDrawer.Body>
        <RouteDrawer.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <RouteDrawer.Close asChild>
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </RouteDrawer.Close>
            <Button size="small" type="submit" isLoading={isLoading}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteDrawer.Footer>
      </form>
    </RouteDrawer.Form>
  )
}
