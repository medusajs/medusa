import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Heading, Input, Text } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

import { UserDTO } from "@medusajs/types"
import { Form } from "../../../../../components/common/form"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/route-modal"
import { useCreateApiKey } from "../../../../../hooks/api/api-keys"

type CreatePublishableApiKeyFormProps = {
  user: UserDTO
}

const CreatePublishableApiKeySchema = zod.object({
  title: zod.string().min(1),
})

export const CreatePublishableApiKeyForm = ({
  user,
}: CreatePublishableApiKeyFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<zod.infer<typeof CreatePublishableApiKeySchema>>({
    defaultValues: {
      title: "",
    },
    resolver: zodResolver(CreatePublishableApiKeySchema),
  })

  const { mutateAsync, isPending } = useCreateApiKey()

  const handleSubmit = form.handleSubmit(async (values) => {
    await mutateAsync(
      // @ts-ignore type is wrong compared to validation
      { title: values.title, type: "publishable" },
      {
        onSuccess: ({ apiKey }) => {
          handleSuccess(`/settings/api-key-management/${apiKey.id}`)
        },
      }
    )
  })

  return (
    <RouteFocusModal.Form form={form}>
      <form
        className="flex h-full flex-col overflow-hidden"
        onSubmit={handleSubmit}
      >
        <RouteFocusModal.Header>
          <div className="flex items-center justify-end gap-x-2">
            <RouteFocusModal.Close asChild>
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </RouteFocusModal.Close>
            <Button size="small" type="submit" isLoading={isPending}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteFocusModal.Header>
        <RouteFocusModal.Body className="flex flex-1 flex-col overflow-hidden">
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
                          <Input {...field} />
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )
                  }}
                />
              </div>
            </div>
          </div>
        </RouteFocusModal.Body>
      </form>
    </RouteFocusModal.Form>
  )
}
