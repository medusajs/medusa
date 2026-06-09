import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Heading, Input, Text, Textarea, toast } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"

import { Form } from "../../../../../components/common/form"
import { RouteFocusModal, useRouteModal } from "../../../../../components/modals"
import { KeyboundForm } from "../../../../../components/utilities/keybound-form"
import { useCreateRbacPolicy } from "../../../../../hooks/api/rbac-policies"

const CreatePolicySchema = z.object({
  key: z.string().min(1),
  resource: z.string().min(1),
  operation: z.string().min(1),
  name: z.string().optional(),
  description: z.string().optional(),
})

type CreatePolicyValues = z.infer<typeof CreatePolicySchema>

export const CreatePolicyForm = () => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<CreatePolicyValues>({
    defaultValues: {
      key: "",
      resource: "",
      operation: "",
      name: "",
      description: "",
    },
    resolver: zodResolver(CreatePolicySchema),
  })

  const { mutateAsync, isPending } = useCreateRbacPolicy()

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      const { policy } = await mutateAsync({
        key: values.key.trim(),
        resource: values.resource.trim(),
        operation: values.operation.trim(),
        name: values.name?.trim() || null,
        description: values.description?.trim() || null,
      })

      toast.success(t("policies.create.successToast", { key: policy.key }))
      handleSuccess(`/settings/policies/${policy.id}`)
    } catch (error) {
      toast.error((error as Error).message)
    }
  })

  return (
    <RouteFocusModal.Form form={form}>
      <KeyboundForm
        onSubmit={handleSubmit}
        className="flex size-full flex-col overflow-hidden"
      >
        <RouteFocusModal.Header />
        <RouteFocusModal.Body className="size-full overflow-y-auto">
          <div className="flex flex-col items-center overflow-auto p-16">
            <div className="flex w-full max-w-[720px] flex-col gap-y-8">
              <div>
                <Heading>{t("policies.create.header")}</Heading>
                <Text size="small" className="text-ui-fg-subtle">
                  {t("policies.create.hint")}
                </Text>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <Form.Field
                  control={form.control}
                  name="key"
                  render={({ field }) => (
                    <Form.Item>
                      <Form.Label>{t("fields.key")}</Form.Label>
                      <Form.Control>
                        <Input {...field} />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Form.Field
                    control={form.control}
                    name="resource"
                    render={({ field }) => (
                      <Form.Item>
                        <Form.Label>{t("fields.resource")}</Form.Label>
                        <Form.Control>
                          <Input {...field} />
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )}
                  />
                  <Form.Field
                    control={form.control}
                    name="operation"
                    render={({ field }) => (
                      <Form.Item>
                        <Form.Label>{t("fields.operation")}</Form.Label>
                        <Form.Control>
                          <Input {...field} />
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )}
                  />
                </div>
                <Form.Field
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <Form.Item>
                      <Form.Label optional>{t("fields.name")}</Form.Label>
                      <Form.Control>
                        <Input {...field} />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )}
                />
                <Form.Field
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <Form.Item>
                      <Form.Label optional>
                        {t("fields.description")}
                      </Form.Label>
                      <Form.Control>
                        <Textarea {...field} rows={4} />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )}
                />
              </div>
            </div>
          </div>
        </RouteFocusModal.Body>
        <RouteFocusModal.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <RouteFocusModal.Close asChild>
              <Button variant="secondary" size="small">
                {t("actions.cancel")}
              </Button>
            </RouteFocusModal.Close>
            <Button
              type="submit"
              variant="primary"
              size="small"
              isLoading={isPending}
            >
              {t("actions.create")}
            </Button>
          </div>
        </RouteFocusModal.Footer>
      </KeyboundForm>
    </RouteFocusModal.Form>
  )
}
