import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Heading, Input, Prompt, Text, toast } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

import { Eye, EyeSlash } from "@medusajs/icons"
import { AdminApiKeyResponse } from "@medusajs/types"
import { Fragment, useState } from "react"
import { Form } from "../../../../../components/common/form"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/route-modal"
import { useCreateApiKey } from "../../../../../hooks/api/api-keys"
import { ApiKeyType } from "../../../common/constants"

const ApiKeyCreateSchema = zod.object({
  title: zod.string().min(1),
})

type ApiKeyCreateFormProps = {
  keyType: ApiKeyType
}

function getRedactedKey(key?: string) {
  if (!key) {
    return ""
  }

  // Replace all characters except the first four and last two with bullets
  const firstThree = key.slice(0, 4)
  const lastTwo = key.slice(-2)

  return `${firstThree}${"•".repeat(key.length - 6)}${lastTwo}`
}

export const ApiKeyCreateForm = ({ keyType }: ApiKeyCreateFormProps) => {
  const [createdKey, setCreatedKey] = useState<
    AdminApiKeyResponse["api_key"] | null
  >(null)
  const [showRedactedKey, setShowRedactedKey] = useState(true)

  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<zod.infer<typeof ApiKeyCreateSchema>>({
    defaultValues: {
      title: "",
    },
    resolver: zodResolver(ApiKeyCreateSchema),
  })

  const { mutateAsync, isPending } = useCreateApiKey()

  const handleSubmit = form.handleSubmit(async (values) => {
    await mutateAsync(
      // @ts-ignore
      { title: values.title, type: keyType },
      {
        onSuccess: ({ api_key }) => {
          toast.success(t("general.success"), {
            description: t("apiKeyManagement.create.successToast"),
            dismissLabel: t("general.close"),
          })

          switch (keyType) {
            case ApiKeyType.PUBLISHABLE:
              handleSuccess(`/settings/publishable-api-keys/${api_key.id}`)
              break
            case ApiKeyType.SECRET:
              setCreatedKey(api_key)
              break
          }
        },
        onError: (err) => {
          toast.error(t("general.error"), {
            description: err.message,
            dismissLabel: t("general.close"),
          })
        },
      }
    )
  })

  const handleCopyToken = () => {
    if (!createdKey) {
      toast.error(t("general.error"), {
        dismissLabel: t("general.close"),
        description: t("apiKeyManagement.create.copySecretTokenFailure"),
      })
    }

    navigator.clipboard.writeText(createdKey?.token ?? "")
    toast.success(t("general.success"), {
      description: t("apiKeyManagement.create.copySecretTokenSuccess"),
      dismissLabel: t("general.close"),
    })
  }

  const handleGoToSecretKey = () => {
    if (!createdKey) {
      return
    }

    handleSuccess(`/settings/secret-api-keys/${createdKey.id}`)
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
        <Prompt.Content className="w-fit max-w-[42.5%]">
          <Prompt.Header>
            <Prompt.Title>
              {t("apiKeyManagement.create.secretKeyCreatedHeader")}
            </Prompt.Title>
            <Prompt.Description>
              {t("apiKeyManagement.create.secretKeyCreatedHint")}
            </Prompt.Description>
          </Prompt.Header>
          <div className="flex flex-col gap-y-3 px-6 py-4">
            <div className="shadow-borders-base bg-ui-bg-component grid h-8 grid-cols-[1fr_32px] items-center overflow-hidden rounded-md">
              <div className="flex items-center px-2">
                <Text family="mono" size="small">
                  {showRedactedKey
                    ? getRedactedKey(createdKey?.token)
                    : createdKey?.token}
                </Text>
              </div>
              <button
                className="transition-fg hover:bg-ui-bg-base-hover active:bg-ui-bg-base-pressed text-ui-fg-muted active:text-ui-fg-subtle flex size-8 appearance-none items-center justify-center border-l"
                type="button"
                onClick={() => setShowRedactedKey(!showRedactedKey)}
              >
                {showRedactedKey ? <EyeSlash /> : <Eye />}
              </button>
            </div>
            <Button
              size="small"
              variant="secondary"
              type="button"
              className="w-full"
              onClick={handleCopyToken}
            >
              {t("apiKeyManagement.actions.copy")}
            </Button>
          </div>
          <Prompt.Footer className="border-t py-4">
            <Prompt.Action onClick={handleGoToSecretKey}>
              {t("actions.continue")}
            </Prompt.Action>
          </Prompt.Footer>
        </Prompt.Content>
      </Prompt>
    </Fragment>
  )
}
