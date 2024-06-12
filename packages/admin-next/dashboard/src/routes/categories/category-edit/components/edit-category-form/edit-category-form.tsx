import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Input, Select, Textarea } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"

import { HttpTypes } from "@medusajs/types"
import { Form } from "../../../../../components/common/form"
import { HandleInput } from "../../../../../components/inputs/handle-input"
import { RouteDrawer } from "../../../../../components/route-modal"

const EditCategorySchema = z.object({
  name: z.string().min(1),
  handle: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(["active", "inactive"]),
  visibility: z.enum(["public", "internal"]),
})

type EditCategoryFormProps = {
  category: HttpTypes.AdminProductCategory
}

export const EditCategoryForm = ({ category }: EditCategoryFormProps) => {
  const { t } = useTranslation()

  const form = useForm<z.infer<typeof EditCategorySchema>>({
    defaultValues: {
      name: category.name,
      handle: category.handle,
      description: category.description || "",
      status: category.is_active ? "active" : "inactive",
      visibility: category.is_internal ? "internal" : "public",
    },
    resolver: zodResolver(EditCategorySchema),
  })

  const isPending = false

  const handleSubmit = form.handleSubmit(async (data) => console.log(data))

  return (
    <RouteDrawer.Form form={form}>
      <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
        <RouteDrawer.Body>
          <div className="flex flex-col gap-y-4">
            <Form.Field
              control={form.control}
              name="name"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label>{t("fields.title")}</Form.Label>
                    <Form.Control>
                      <Input autoComplete="off" {...field} />
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />
            <Form.Field
              control={form.control}
              name="handle"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label
                      optional
                      tooltip={t("collections.handleTooltip")}
                    >
                      {t("fields.handle")}
                    </Form.Label>
                    <Form.Control>
                      <HandleInput {...field} />
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />
            <Form.Field
              control={form.control}
              name="description"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label optional>{t("fields.description")}</Form.Label>
                    <Form.Control>
                      <Textarea {...field} />
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Form.Field
                control={form.control}
                name="status"
                render={({ field: { ref, onChange, ...field } }) => {
                  return (
                    <Form.Item>
                      <Form.Label>
                        {t("categories.fields.status.label")}
                      </Form.Label>
                      <Form.Control>
                        <Select {...field} onValueChange={onChange}>
                          <Select.Trigger ref={ref}>
                            <Select.Value />
                          </Select.Trigger>
                          <Select.Content>
                            <Select.Item value="active">
                              {t("categories.fields.status.active")}
                            </Select.Item>
                            <Select.Item value="inactive">
                              {t("categories.fields.status.inactive")}
                            </Select.Item>
                          </Select.Content>
                        </Select>
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
              <Form.Field
                control={form.control}
                name="visibility"
                render={({ field: { ref, onChange, ...field } }) => {
                  return (
                    <Form.Item>
                      <Form.Label>
                        {t("categories.fields.visibility.label")}
                      </Form.Label>
                      <Form.Control>
                        <Select {...field} onValueChange={onChange}>
                          <Select.Trigger ref={ref}>
                            <Select.Value />
                          </Select.Trigger>
                          <Select.Content>
                            <Select.Item value="public">
                              {t("categories.fields.visibility.public")}
                            </Select.Item>
                            <Select.Item value="internal">
                              {t("categories.fields.visibility.internal")}
                            </Select.Item>
                          </Select.Content>
                        </Select>
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
            </div>
          </div>
        </RouteDrawer.Body>
        <RouteDrawer.Footer>
          <div className="flex items-center gap-x-2">
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
