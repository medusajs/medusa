import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowUpCircleSolid } from "@medusajs/icons"
import { IconButton } from "@medusajs/ui"
import { useRef } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { AdminOrder } from "@medusajs/types"
import { useTranslation } from "react-i18next"
import { Form } from "../../../../../components/common/form"
import { KeyboundForm } from "../../../../../components/utilities/keybound-form"

type OrderNoteFormProps = {
  order: AdminOrder
}

const OrderNoteSchema = z.object({
  value: z.string().min(1),
})

export const OrderNoteForm = ({ order }: OrderNoteFormProps) => {
  const { t } = useTranslation()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const form = useForm<z.infer<typeof OrderNoteSchema>>({
    defaultValues: {
      value: "",
    },
    resolver: zodResolver(OrderNoteSchema),
  })

  const { mutateAsync, isLoading } = {} as {
    mutateAsync: (vars: any, options?: any) => Promise<void>
    isLoading: boolean
  }

  const handleSubmit = form.handleSubmit(async (values) => {
    mutateAsync(
      {
        resource_id: order.id,
        resource_type: "order",
        value: values.value,
      },
      {
        onSuccess: () => {
          form.reset()
          handleResetSize()
        },
      }
    )
  })

  const handleResize = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = textarea.scrollHeight + "px"
    }
  }

  const handleResetSize = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
    }
  }

  return (
    <div>
      <Form {...form}>
        <KeyboundForm onSubmit={handleSubmit}>
          <div className="flex flex-col gap-y-2 rounded-md bg-ui-bg-field px-2 py-1.5 shadow-borders-base">
            <Form.Field
              control={form.control}
              name="value"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label hidden>
                      {t("orders.activity.comment.label")}
                    </Form.Label>
                    <Form.Control>
                      <textarea
                        {...field}
                        ref={textareaRef}
                        onInput={handleResize}
                        className="txt-small resize-none overflow-hidden bg-transparent text-ui-fg-base outline-none placeholder:text-ui-fg-muted"
                        placeholder={t("orders.activity.comment.placeholder")}
                        rows={1}
                      />
                    </Form.Control>
                  </Form.Item>
                )
              }}
            />
            <div className="flex items-center justify-end">
              <IconButton
                type="submit"
                isLoading={isLoading}
                variant="transparent"
                size="small"
                className="text-ui-fg-muted hover:text-ui-fg-subtle active:text-ui-fg-subtle"
              >
                <span className="sr-only">
                  {t("orders.activity.comment.addButtonText")}
                </span>
                <ArrowUpCircleSolid />
              </IconButton>
            </div>
          </div>
        </KeyboundForm>
      </Form>
    </div>
  )
}
