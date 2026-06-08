import { zodResolver } from "@hookform/resolvers/zod"
import { HttpTypes } from "@medusajs/types"
import { Button, Input, Textarea, toast } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"

import { Form } from "../../../../../components/common/form"
import { RouteDrawer, useRouteModal } from "../../../../../components/modals"
import { KeyboundForm } from "../../../../../components/utilities/keybound-form"
import { useUpdateRbacPolicy } from "../../../../../hooks/api/rbac-policies"

const EditPolicySchema = z.object({
  key: z.string().min(1),
  resource: z.string().min(1),
  operation: z.string().min(1),
  name: z.string().optional(),
  description: z.string().optional(),
})

type EditPolicyFormProps = {
  policy: HttpTypes.AdminRbacPolicy
}

export const EditPolicyForm = ({ policy }: EditPolicyFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<z.infer<typeof EditPolicySchema>>({
    defaultValues: {
      key: policy.key,
      resource: policy.resource,
      operation: policy.operation,
      name: policy.name ?? "",
      description: policy.description ?? "",
    },
    resolver: zodResolver(EditPolicySchema),
  })

  const { mutateAsync, isPending } = useUpdateRbacPolicy(policy.id)

  const handleSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(
      {
        key: data.key.trim(),
        resource: data.resource.trim(),
        operation: data.operation.trim(),
        name: data.name?.trim() || null,
        description: data.description?.trim() || null,
      },
      {
        onSuccess: ({ policy: updated }) => {
          toast.success(
            t("policies.edit.successToast", { key: updated.key })
          )
          handleSuccess()
        },
        onError: (error) => {
          toast.error(error.message)
        },
      }
    )
  })

  return (
    <RouteDrawer.Form form={form}>
      <KeyboundForm
        onSubmit={handleSubmit}
        className="flex flex-1 flex-col overflow-hidden"
      >
        <RouteDrawer.Body className="flex flex-1 flex-col gap-y-8 overflow-y-auto">
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
        </RouteDrawer.Body>
        <RouteDrawer.Footer>
          <div className="flex items-center justify-end gap-x-2">
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
      </KeyboundForm>
    </RouteDrawer.Form>
  )
}
