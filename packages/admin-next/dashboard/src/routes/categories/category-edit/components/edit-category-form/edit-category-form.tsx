import { zodResolver } from "@hookform/resolvers/zod"
import type { ProductCategory } from "@medusajs/medusa"
import { Button, Drawer, Input, Select, Text, Textarea } from "@medusajs/ui"
import { useAdminUpdateProductCategory } from "medusa-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"
import { Form } from "../../../../../components/common/form"

type EditCategoryFormProps = {
  category: ProductCategory
  subscribe: (state: boolean) => void
  onSuccessfulSubmit: () => void
}

const EditCategorySchema = zod.object({
  name: zod.string().min(1),
  description: zod.string().optional(),
  handle: zod.string().optional(),
  status: zod.string(),
  visibility: zod.string(),
})

export const EditCategoryForm = ({
  category,
  subscribe,
  onSuccessfulSubmit,
}: EditCategoryFormProps) => {
  const form = useForm<zod.infer<typeof EditCategorySchema>>({
    defaultValues: {
      name: category.name,
      description: category.description || "",
      handle: category.handle || "",
      visibility: category.is_internal ? "internal" : "public",
      status: category.is_active ? "active" : "inactive",
    },
    resolver: zodResolver(EditCategorySchema),
  })

  const {
    formState: { isDirty },
  } = form

  useEffect(() => {
    subscribe(isDirty)
  }, [isDirty])

  const { t } = useTranslation()
  const { mutateAsync, isLoading } = useAdminUpdateProductCategory(category.id)

  const handleSubmit = form.handleSubmit(async (data) => {
    const { status, visibility, ...rest } = data

    await mutateAsync(
      {
        ...rest,
        is_active: status === "active",
        is_internal: visibility === "internal",
      },
      {
        onSuccess: () => {
          onSuccessfulSubmit()
        },
      }
    )
  })

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
        <Drawer.Body>
          <div className="flex flex-col gap-y-8">
            <Form.Field
              control={form.control}
              name="name"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label>{t("fields.name")}</Form.Label>
                    <Form.Control>
                      <Input {...field} />
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
                    <Form.Label tooltip={t("categories.handleTooltip")}>
                      {t("fields.handle")}
                    </Form.Label>
                    <Form.Control>
                      <div className="relative">
                        <div className="absolute left-0 inset-y-0 w-8 border-r z-10 flex items-center justify-center">
                          <Text
                            className="text-ui-fg-muted"
                            size="small"
                            leading="compact"
                            weight="plus"
                          >
                            /
                          </Text>
                        </div>
                        <Input {...field} className="pl-10" />
                      </div>
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
            <div className="grid grid-cols-2 gap-4">
              <Form.Field
                control={form.control}
                name="status"
                render={({ field: { onChange, ref, ...field } }) => {
                  return (
                    <Form.Item>
                      <Form.Label>{t("fields.status")}</Form.Label>
                      <Form.Control>
                        <Select {...field} onValueChange={onChange}>
                          <Select.Trigger ref={ref}>
                            <Select.Value />
                          </Select.Trigger>
                          <Select.Content>
                            <Select.Item value="active">
                              {t("general.active")}
                            </Select.Item>
                            <Select.Item value="inactive">
                              {t("general.inactive")}
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
                render={({ field: { onChange, ref, ...field } }) => {
                  return (
                    <Form.Item>
                      <Form.Label>{t("fields.visibility")}</Form.Label>
                      <Form.Control>
                        <Select {...field} onValueChange={onChange}>
                          <Select.Trigger ref={ref}>
                            <Select.Value />
                          </Select.Trigger>
                          <Select.Content>
                            <Select.Item value="public">
                              {t("general.public")}
                            </Select.Item>
                            <Select.Item value="internal">
                              {t("general.internal")}
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
        </Drawer.Body>
        <Drawer.Footer>
          <div className="flex items-center gap-x-2">
            <Drawer.Close asChild>
              <Button size="small" variant="secondary">
                {t("general.cancel")}
              </Button>
            </Drawer.Close>
            <Button size="small" type="submit" isLoading={isLoading}>
              {t("general.save")}
            </Button>
          </div>
        </Drawer.Footer>
      </form>
    </Form>
  )
}
