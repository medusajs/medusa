import { zodResolver } from "@hookform/resolvers/zod"
import { Button, FocusModal, Heading, Input, Text } from "@medusajs/ui"
import { useAdminCreatePublishableApiKey } from "medusa-react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Form } from "../../../../../components/common/form"

type CreatePublishableApiKeyFormProps = {
  subscribe: (state: boolean) => void
}

const CreatePublishableApiKeySchema = zod.object({
  title: zod.string().min(1),
})

export const CreatePublishableApiKeyForm = ({
  subscribe,
}: CreatePublishableApiKeyFormProps) => {
  const { mutateAsync, isLoading } = useAdminCreatePublishableApiKey()

  const form = useForm<zod.infer<typeof CreatePublishableApiKeySchema>>({
    defaultValues: {
      title: "",
    },
    resolver: zodResolver(CreatePublishableApiKeySchema),
  })

  const {
    formState: { isDirty },
  } = form

  useEffect(() => {
    subscribe(isDirty)
  }, [isDirty])

  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleSubmit = form.handleSubmit(async (values) => {
    await mutateAsync(values, {
      onSuccess: ({ publishable_api_key }) => {
        navigate(`/settings/api-key-management/${publishable_api_key.id}`, {
          replace: true,
        })
      },
    })
  })

  return (
    <Form {...form}>
      <form
        className="flex h-full flex-col overflow-hidden"
        onSubmit={handleSubmit}
      >
        <FocusModal.Header>
          <div className="flex items-center justify-end gap-x-2">
            <FocusModal.Close asChild>
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </FocusModal.Close>
            <Button size="small" type="submit" isLoading={isLoading}>
              {t("actions.save")}
            </Button>
          </div>
        </FocusModal.Header>
        <FocusModal.Body className="flex flex-1 flex-col overflow-hidden">
          <div className="flex flex-1 flex-col items-center overflow-y-auto">
            <div className="flex w-full max-w-[720px] flex-col gap-y-8 px-2 py-16">
              <div>
                <Heading>
                  {t("apiKeyManagement.createPublishableApiKey")}
                </Heading>
                <Text size="small" className="text-ui-fg-subtle">
                  {t("apiKeyManagement.publishableApiKeyHint")}
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
                          <Input size="small" {...field} />
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )
                  }}
                />
              </div>
            </div>
          </div>
        </FocusModal.Body>
      </form>
    </Form>
  )
}
