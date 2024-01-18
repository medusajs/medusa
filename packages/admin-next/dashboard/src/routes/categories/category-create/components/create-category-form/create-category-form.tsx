import { zodResolver } from "@hookform/resolvers/zod"
import {
  Button,
  FocusModal,
  Heading,
  Input,
  Select,
  Text,
  Textarea,
} from "@medusajs/ui"
import { useAdminCreateProductCategory } from "medusa-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import * as zod from "zod"
import { Form } from "../../../../../components/common/form"

type CreateCategoryFormProps = {
  subscribe: (state: boolean) => void
}

const CreateCategorySchema = zod.object({
  name: zod.string().min(1),
  description: zod.string().optional(),
  handle: zod.string().optional(),
  status: zod.string(),
  visibility: zod.string(),
  parent_category_id: zod.string().optional(),
})

export const CreateCategoryForm = ({ subscribe }: CreateCategoryFormProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const form = useForm<zod.infer<typeof CreateCategorySchema>>({
    defaultValues: {
      name: "",
      description: "",
      handle: "",
      visibility: "public",
      status: "active",
      parent_category_id: "",
    },
    resolver: zodResolver(CreateCategorySchema),
  })

  const {
    formState: { isDirty },
  } = form

  useEffect(() => {
    subscribe(isDirty)
  }, [isDirty])

  const { mutateAsync, isLoading } = useAdminCreateProductCategory()

  const handleSubmit = form.handleSubmit(async (data) => {
    const { status, visibility, ...rest } = data

    await mutateAsync(
      {
        ...rest,
        is_active: status === "active",
        is_internal: visibility === "internal",
      },
      {
        onSuccess: ({ product_category }) => {
          navigate(`/categories/${product_category.id}`)
        },
      }
    )
  })

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit}>
        <FocusModal.Header>
          <div className="flex items-center justify-end gap-x-2">
            <FocusModal.Close asChild>
              <Button size="small" variant="secondary">
                {t("general.cancel")}
              </Button>
            </FocusModal.Close>
            <Button
              size="small"
              variant="primary"
              type="submit"
              isLoading={isLoading}
            >
              {t("general.create")}
            </Button>
          </div>
        </FocusModal.Header>
        <FocusModal.Body className="flex flex-col items-center py-16">
          <div className="w-full max-w-[720px] flex flex-col gap-y-8">
            <div>
              <Heading>{t("categories.createCategory")}</Heading>
              <Text size="small" className="text-ui-fg-subtle">
                {t("categories.createCategoryHint")}
              </Text>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Form.Field
                control={form.control}
                name="name"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Label>{t("fields.name")}</Form.Label>
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
                        // tooltip={t("collections.handleTooltip")}
                      >
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
                          <Input
                            autoComplete="off"
                            {...field}
                            className="pl-10"
                          />
                        </div>
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
            </div>
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
        </FocusModal.Body>
      </form>
    </Form>
  )
}
