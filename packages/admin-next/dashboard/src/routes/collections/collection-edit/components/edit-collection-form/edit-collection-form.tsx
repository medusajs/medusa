import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Input, Text } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

import { Form } from "../../../../../components/common/form"
import {
  RouteDrawer,
  useRouteModal,
} from "../../../../../components/route-modal"
import { useUpdateCollection } from "../../../../../hooks/api/collections"
import { HttpTypes } from "@medusajs/types"

type EditCollectionFormProps = {
  collection: HttpTypes.AdminCollection
}

const EditCollectionSchema = zod.object({
  title: zod.string().min(1),
  handle: zod.string().min(1),
})

export const EditCollectionForm = ({ collection }: EditCollectionFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<zod.infer<typeof EditCollectionSchema>>({
    defaultValues: {
      title: collection.title,
      handle: collection.handle,
    },
    resolver: zodResolver(EditCollectionSchema),
  })

  const { mutateAsync, isPending } = useUpdateCollection(collection.id)

  const handleSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(data, {
      onSuccess: () => {
        handleSuccess()
      },
    })
  })

  return (
    <RouteDrawer.Form form={form}>
      <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
        <RouteDrawer.Body>
          <div className="flex flex-col gap-y-4">
            <Form.Field
              control={form.control}
              name="title"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label>{t("fields.title")}</Form.Label>
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
                    <Form.Label tooltip={t("collections.handleTooltip")}>
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
                        <Input {...field} className="pl-10" />
                      </div>
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />
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
