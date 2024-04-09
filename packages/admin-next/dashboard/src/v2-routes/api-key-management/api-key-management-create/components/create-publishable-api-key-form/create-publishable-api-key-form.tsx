import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Copy, Heading, Input, Prompt, Text } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

import { AdminApiKeyResponse } from "@medusajs/types"
import { Fragment, useState } from "react"
import { Form } from "../../../../../components/common/form"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/route-modal"
import { useCreateApiKey } from "../../../../../hooks/api/api-keys"
import { ApiKeyType } from "../../../common/constants"

const CreatePublishableApiKeySchema = zod.object({
  title: zod.string().min(1),
})

type CreatePublishableApiKeyFormProps = {
  keyType: ApiKeyType
}

export const CreatePublishableApiKeyForm = ({
  keyType,
}: CreatePublishableApiKeyFormProps) => {
  const [createdKey, setCreatedKey] = useState<
    AdminApiKeyResponse["api_key"] | null
  >(null)

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
      // @ts-ignore
      { title: values.title, type: keyType },
      {
        onSuccess: ({ api_key }) => {
          switch (keyType) {
            case ApiKeyType.PUBLISHABLE:
              handleSuccess(`/settings/api-key-management/${api_key.id}`)
              break
            case ApiKeyType.SECRET:
              setCreatedKey(api_key)
              break
          }
        },
      }
    )
  })

  const handleGoToSecretKey = () => {
    if (!createdKey) {
      return
    }

    handleSuccess(`/settings/api-key-management/${createdKey.id}`)
  }

  return (
    <Fragment>
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
                    {keyType === ApiKeyType.PUBLISHABLE
                      ? t("apiKeyManagement.create.createPublishableHeader")
                      : t("apiKeyManagement.create.createSecretHeader")}
                  </Heading>
                  <Text size="small" className="text-ui-fg-subtle">
                    {keyType === ApiKeyType.PUBLISHABLE
                      ? t("apiKeyManagement.create.createPublishableHint")
                      : t("apiKeyManagement.create.createSecretHint")}
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
      <Prompt variant="confirmation" open={!!createdKey}>
        <Prompt.Content className="w-fit max-w-[80%]">
          <Prompt.Header>
            <Prompt.Title>
              {t("apiKeyManagement.create.secretKeyCreatedHeader")}
            </Prompt.Title>
            <Prompt.Description>
              {t("apiKeyManagement.create.secretKeyCreatedHint")}
            </Prompt.Description>
          </Prompt.Header>
          <div className="px-6 pt-6">
            <div className="shadow-borders-base bg-ui-bg-component flex items-center gap-x-2 rounded-md px-4 py-2.5">
              <Text family="mono" size="small">
                {createdKey?.token}
              </Text>
              <Copy
                className="text-ui-fg-subtle"
                content={createdKey?.token!}
              />
            </div>
          </div>
          <Prompt.Footer>
            <Prompt.Action onClick={handleGoToSecretKey}>
              {t("actions.continue")}
            </Prompt.Action>
          </Prompt.Footer>
        </Prompt.Content>
      </Prompt>
    </Fragment>
  )
}
