import { zodResolver } from "@hookform/resolvers/zod"
import { Product } from "@medusajs/medusa"
import { Button, toast } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"
import { Form } from "../../../../../components/common/form"
import { Combobox } from "../../../../../components/inputs/combobox"
import {
  RouteDrawer,
  useRouteModal,
} from "../../../../../components/route-modal"
import { useUpdateProduct } from "../../../../../hooks/api/products"
import { useComboboxData } from "../../../../../hooks/use-combobox-data"
import { client, sdk } from "../../../../../lib/client"
import { CategoryCombobox } from "../../../common/components/category-combobox"

type ProductOrganizationFormProps = {
  product: Product
}

const ProductOrganizationSchema = zod.object({
  type_id: zod.string().optional(),
  collection_id: zod.string().optional(),
  category_ids: zod.array(zod.string()),
  tag_ids: zod.array(zod.string()),
})

export const ProductOrganizationForm = ({
  product,
}: ProductOrganizationFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const collections = useComboboxData({
    queryKey: ["product_collections"],
    queryFn: sdk.admin.collection.list,
    getOptions: (data) =>
      data.collections.map((collection) => ({
        label: collection.title!,
        value: collection.id!,
      })),
  })

  const types = useComboboxData({
    queryKey: ["product_types"],
    queryFn: client.productTypes.list,
    getOptions: (data) =>
      data.product_types.map((type) => ({
        label: type.value,
        value: type.id,
      })),
  })

  const tags = useComboboxData({
    queryKey: ["product_tags"],
    queryFn: client.tags.list,
    getOptions: (data) =>
      data.product_tags?.map((tag) => ({
        label: tag.value,
        value: tag.id,
      })),
  })

  const form = useForm<zod.infer<typeof ProductOrganizationSchema>>({
    defaultValues: {
      type_id: product.type_id || "",
      collection_id: product.collection_id || "",
      category_ids: product.categories?.map((c) => c.id) || [],
      tag_ids: product.tags?.map((t) => t.id) || [],
    },
    resolver: zodResolver(ProductOrganizationSchema),
  })

  const { mutateAsync, isPending } = useUpdateProduct(product.id)

  const handleSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(
      {
        type_id: data.type_id || undefined,
        collection_id: data.collection_id || undefined,
        categories: data.category_ids.map((id) => ({ id })) || undefined,
        tags:
          data.tag_ids?.map((t) => {
            t
          }) || undefined,
      },
      {
        onSuccess: ({ product }) => {
          toast.success(t("general.success"), {
            description: t("products.organization.toasts.success", {
              title: product.title,
            }),
          })
          handleSuccess()
        },
        onError: (error) => {
          toast.error(t("general.error"), {
            description: error.message,
            dismissable: true,
            dismissLabel: t("actions.close"),
          })
        },
      }
    )
  })

  return (
    <RouteDrawer.Form form={form}>
      <form onSubmit={handleSubmit} className="flex h-full flex-col">
        <RouteDrawer.Body>
          <div className="flex h-full flex-col gap-y-4">
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
                        options={types.options}
                        searchValue={types.searchValue}
                        onSearchValueChange={types.onSearchValueChange}
                        fetchNextPage={types.fetchNextPage}
                      />
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />
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
                        options={collections.options}
                        searchValue={collections.searchValue}
                        onSearchValueChange={collections.onSearchValueChange}
                        fetchNextPage={collections.fetchNextPage}
                      />
                    </Form.Control>
                    <Form.ErrorMessage />
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
                      <CategoryCombobox {...field} />
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />
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
                        searchValue={tags.searchValue}
                        onSearchValueChange={tags.onSearchValueChange}
                        fetchNextPage={tags.fetchNextPage}
                      />
                    </Form.Control>
                    <Form.ErrorMessage />
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
            <Button size="small" type="submit" isLoading={isPending}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteDrawer.Footer>
      </form>
    </RouteDrawer.Form>
  )
}
