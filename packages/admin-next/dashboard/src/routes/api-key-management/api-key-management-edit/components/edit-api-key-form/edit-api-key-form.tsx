import { zodResolver } from "@hookform/resolvers/zod"
import type { PublishableApiKey } from "@medusajs/medusa"
import { Button, Drawer, Input } from "@medusajs/ui"
import { useAdminUpdatePublishableApiKey } from "medusa-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"
import { Form } from "../../../../../components/common/form"

type EditApiKeyFormProps = {
  apiKey: PublishableApiKey
  onSuccessfulSubmit: () => void
  subscribe: (state: boolean) => void
}

const EditApiKeySchema = zod.object({
  title: zod.string().min(1),
})

export const EditApiKeyForm = ({
  apiKey,
  onSuccessfulSubmit,
  subscribe,
}: EditApiKeyFormProps) => {
  const { t } = useTranslation()

  const form = useForm<zod.infer<typeof EditApiKeySchema>>({
    defaultValues: {
      title: apiKey.title,
    },
    resolver: zodResolver(EditApiKeySchema),
  })

  const {
    formState: { isDirty },
  } = form

  useEffect(() => {
    subscribe(isDirty)
  }, [isDirty])

  const { mutateAsync, isLoading } = useAdminUpdatePublishableApiKey(apiKey.id)

  const handleSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(data, {
      onSuccess: () => {
        onSuccessfulSubmit()
      },
    })
  })

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
        <Drawer.Body>
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
        </Drawer.Body>
        <Drawer.Footer>
          <div className="flex items-center gap-x-2">
            <Drawer.Close asChild>
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </Drawer.Close>
            <Button size="small" type="submit" isLoading={isLoading}>
              {t("actions.save")}
            </Button>
          </div>
        </Drawer.Footer>
      </form>
    </Form>
  )
}
