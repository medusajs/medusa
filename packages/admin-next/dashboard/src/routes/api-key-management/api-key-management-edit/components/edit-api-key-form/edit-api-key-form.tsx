import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Input, toast } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

import { ApiKeyDTO } from "@medusajs/types"
import { Form } from "../../../../../components/common/form"
import {
  RouteDrawer,
  useRouteModal,
} from "../../../../../components/route-modal"
import { useUpdateApiKey } from "../../../../../hooks/api/api-keys"

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

  const { mutateAsync, isPending } = useUpdateApiKey(apiKey.id)

  const handleSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(data, {
      onSuccess: ({ api_key }) => {
        toast.success(t("general.success"), {
          description: t("apiKeyManagement.edit.successToast", {
            title: api_key.title,
          }),
          dismissLabel: t("general.close"),
        })
        handleSuccess()
      },
      onError: (err) => {
        toast.error(t("general.error"), {
          description: err.message,
          dismissLabel: t("general.close"),
        })
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
            <Button size="small" type="submit" isLoading={isPending}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteDrawer.Footer>
      </form>
    </RouteDrawer.Form>
  )
}
