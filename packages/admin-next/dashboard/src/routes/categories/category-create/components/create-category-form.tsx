import { ProductCategory } from "@medusajs/medusa"
import {
  Badge,
  Button,
  Heading,
  Input,
  Select,
  Text,
  Textarea,
} from "@medusajs/ui"
import { useAdminCreateProductCategory } from "medusa-react"
import { Control, useForm, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"

import { zodResolver } from "@hookform/resolvers/zod"
import { TriangleRightMini } from "@medusajs/icons"
import { Form } from "../../../../components/common/form"
import { HandleInput } from "../../../../components/common/handle-input"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../components/route-modal"

type CreateCategoryFormProps = {
  parentId?: string
  categories?: ProductCategory[]
}

const CreateCategorySchema = z.object({
  name: z.string().min(1),
  handle: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(["active", "inactive"]),
  visibility: z.enum(["public", "internal"]),
})

export const CreateCategoryForm = ({
  parentId,
  categories,
}: CreateCategoryFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<z.infer<typeof CreateCategorySchema>>({
    defaultValues: {
      name: "",
      description: "",
      handle: "",
      status: "active",
      visibility: "public",
    },
    resolver: zodResolver(CreateCategorySchema),
  })

  const { mutateAsync, isLoading } = useAdminCreateProductCategory()
  const handleSubmit = form.handleSubmit(async (data) => {
    const { name, handle, description, status, visibility } = data

    const is_active = status === "active"
    const is_internal = visibility === "internal"

    mutateAsync(
      {
        parent_category_id: parentId,
        name,
        handle: handle || undefined,
        description: description || undefined,
        is_active,
        is_internal,
      },
      {
        onSuccess: ({ product_category }) => {
          handleSuccess(`/categories/${product_category.id}`)
        },
      }
    )
  })

  return (
    <RouteFocusModal.Form form={form}>
      <form
        onSubmit={handleSubmit}
        className="flex h-full flex-col overflow-hidden"
      >
        <RouteFocusModal.Header>
          <div className="flex items-center justify-end gap-x-2">
            <RouteFocusModal.Close asChild>
              <Button variant="secondary" size="small">
                {t("actions.cancel")}
              </Button>
            </RouteFocusModal.Close>
            <Button size="small" type="submit" isLoading={isLoading}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteFocusModal.Header>
        <RouteFocusModal.Body className="size-full overflow-hidden">
          <div className="flex flex-col items-center p-16">
            <div className="flex w-full max-w-[720px] flex-col gap-y-8">
              <div className="flex flex-col gap-y-6">
                <div>
                  <Heading>{t("categories.create.header")}</Heading>
                  <Text size="small" className="text-ui-fg-subtle">
                    {t("categories.create.hint")}
                  </Text>
                </div>
                <CategoryBreadcrumbs
                  parentId={parentId}
                  categories={categories}
                  control={form.control}
                />
              </div>
              <div className="flex flex-col gap-y-8">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                          <Form.Label optional>{t("fields.handle")}</Form.Label>
                          <Form.Control>
                            <HandleInput {...field} />
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
                        <Form.Label>{t("fields.description")}</Form.Label>
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
                                  {t("categories.status.active")}
                                </Select.Item>
                                <Select.Item value="inactive">
                                  {t("categories.status.inactive")}
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
                          <Form.Label>
                            {t("categories.visibility.label")}
                          </Form.Label>
                          <Form.Control>
                            <Select {...field} onValueChange={onChange}>
                              <Select.Trigger ref={ref}>
                                <Select.Value />
                              </Select.Trigger>
                              <Select.Content>
                                <Select.Item value="public">
                                  {t("categories.visibility.public")}
                                </Select.Item>
                                <Select.Item value="internal">
                                  {t("categories.visibility.internal")}
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
            </div>
          </div>
        </RouteFocusModal.Body>
      </form>
    </RouteFocusModal.Form>
  )
}

type CategoryBreadcrumbsProps = CreateCategoryFormProps & {
  control: Control<z.infer<typeof CreateCategorySchema>>
}

const CategoryBreadcrumbs = ({
  parentId,
  categories,
  control,
}: CategoryBreadcrumbsProps) => {
  const { t } = useTranslation()

  const name = useWatch({
    control,
    name: "name",
  })

  if (!parentId || !categories) {
    return null
  }

  const [_, path] = createAncestorTree(parentId, categories)

  return (
    <div className="text-ui-fg-subtle flex items-center gap-x-1">
      {path.map((category) => (
        <div key={category.id} className="flex items-center gap-x-1">
          <Text size="small" leading="compact">
            {category.name}
          </Text>
          <TriangleRightMini className="text-ui-fg-muted" />
        </div>
      ))}
      <Badge
        size="small"
        className="border-ui-fg-interactive border-dashed bg-transparent"
      >
        {name ? name : t("categories.create.newPlaceholder")}
      </Badge>
    </div>
  )
}

const createAncestorTree = (
  id: string,
  categories: ProductCategory[],
  path: ProductCategory[] = []
): [ProductCategory | null, ProductCategory[]] => {
  for (const category of categories) {
    if (category.id === id) {
      return [category, [...path, category]]
    }

    if (category.category_children) {
      const [foundCategory, foundPath] = createAncestorTree(
        id,
        category.category_children,
        [...path, category]
      )

      if (foundCategory) {
        return [foundCategory, foundPath]
      }
    }
  }

  return [null, path]
}
