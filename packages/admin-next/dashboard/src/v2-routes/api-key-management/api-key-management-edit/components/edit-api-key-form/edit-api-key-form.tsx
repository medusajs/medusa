import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Input } from "@medusajs/ui"
import { adminPublishableApiKeysKeys, useAdminCustomPost } from "medusa-react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

import { Form } from "../../../../../components/common/form"
import {
  RouteDrawer,
  useRouteModal,
} from "../../../../../components/route-modal"
import { ApiKeyDTO } from "@medusajs/types"

type EditApiKeyFormProps = {
  apiKey: ApiKeyDTO
}

const EditApiKeySchema = zod.object({
  title: zod.string().min(1),
})

export const EditApiKeyForm = ({ apiKey }: EditApiKeyFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<zod.infer<typeof EditApiKeySchema>>({
    defaultValues: {
      title: apiKey.title,
    },
    resolver: zodResolver(EditApiKeySchema),
  })

  const { mutateAsync, isLoading } = useAdminCustomPost(
    `/api-keys/${apiKey.id}`,
    [
      adminPublishableApiKeysKeys.lists(),
      adminPublishableApiKeysKeys.detail(apiKey.id),
      adminPublishableApiKeysKeys.details(),
    ]
  )

  const handleSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(data, {
      onSuccess: () => {
        handleSuccess()
      },
      onError: (error) => {
        console.log(error)
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
          </div>
        </RouteDrawer.Body>
        <RouteDrawer.Footer>
          <div className="flex items-center gap-x-2">
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
