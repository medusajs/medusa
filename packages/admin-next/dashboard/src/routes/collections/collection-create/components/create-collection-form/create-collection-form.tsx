import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Heading, Input, Text } from "@medusajs/ui"
import { useAdminCreateCollection } from "medusa-react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

import { Form } from "../../../../../components/common/form"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/route-modal"

const CreateCollectionSchema = zod.object({
  title: zod.string().min(1),
  handle: zod.string().optional(),
})

export const CreateCollectionForm = () => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<zod.infer<typeof CreateCollectionSchema>>({
    defaultValues: {
      title: "",
      handle: "",
    },
    resolver: zodResolver(CreateCollectionSchema),
  })

  const { mutateAsync, isLoading } = useAdminCreateCollection()

  const handleSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(data, {
      onSuccess: ({ collection }) => {
        handleSuccess(`/collections/${collection.id}`)
      },
    })
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
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </RouteFocusModal.Close>
            <Button
              size="small"
              variant="primary"
              type="submit"
              isLoading={isLoading}
            >
              {t("actions.create")}
            </Button>
          </div>
        </RouteFocusModal.Header>
        <RouteFocusModal.Body className="flex flex-col items-center py-16">
          <div className="flex w-full max-w-[720px] flex-col gap-y-8">
            <div>
              <Heading>{t("collections.createCollection")}</Heading>
              <Text size="small" className="text-ui-fg-subtle">
                {t("collections.createCollectionHint")}
              </Text>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Form.Field
                control={form.control}
                name="title"
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
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 z-10 flex w-8 items-center justify-center border-r">
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
          </div>
        </RouteFocusModal.Body>
      </form>
    </RouteFocusModal.Form>
  )
}
