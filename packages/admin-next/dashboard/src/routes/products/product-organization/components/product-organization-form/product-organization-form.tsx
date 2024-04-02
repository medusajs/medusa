import { zodResolver } from "@hookform/resolvers/zod"
import { Product } from "@medusajs/medusa"
import { Button } from "@medusajs/ui"
import { useAdminUpdateProduct } from "medusa-react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"
import { Form } from "../../../../../components/common/form"
import {
  RouteDrawer,
  useRouteModal,
} from "../../../../../components/route-modal"
import { TagInput } from "../../../common/components/tag-input"
import { NEW_TAG_PREFIX } from "../../../common/constants"

type ProductOrganizationFormProps = {
  product: Product
}

const ProductOrganizationSchema = z.object({
  tags: z.array(
    z.object({
      value: z.string().min(1),
      id: z.string(),
    })
  ),
})

export const ProductOrganizationForm = ({
  product,
}: ProductOrganizationFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<z.infer<typeof ProductOrganizationSchema>>({
    defaultValues: {
      tags:
        product.tags?.map((tag) => ({ value: tag.value, id: tag.id })) || [],
    },
    resolver: zodResolver(ProductOrganizationSchema),
  })

  const { mutateAsync, isLoading } = useAdminUpdateProduct(product.id)

  const handleSubmit = form.handleSubmit(async (values) => {
    mutateAsync(
      {
        tags: values.tags.map((tag) => {
          const payload: { id: string | undefined; value: string } = {
            id: undefined,
            value: tag.value,
          }

          if (!tag.id.startsWith(NEW_TAG_PREFIX)) {
            payload.id = tag.id
          }

          return payload
        }),
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
      <form
        onSubmit={handleSubmit}
        className="flex flex-1 flex-col overflow-hidden"
      >
        <RouteDrawer.Body className="flex flex-1 flex-col gap-y-8 overflow-auto">
          <div className="flex flex-col gap-y-4">
            <Form.Field
              control={form.control}
              name="tags"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label optional>Tags</Form.Label>
                    <Form.Control>
                      <TagInput {...field} />
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
              <Button variant="secondary" size="small">
                {t("actions.cancel")}
              </Button>
            </RouteDrawer.Close>
            <Button type="submit" size="small" isLoading={isLoading}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteDrawer.Footer>
      </form>
    </RouteDrawer.Form>
  )
}
