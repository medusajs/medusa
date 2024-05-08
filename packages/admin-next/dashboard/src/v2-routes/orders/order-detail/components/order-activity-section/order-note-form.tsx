import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowUpCircleSolid } from "@medusajs/icons"
import { IconButton } from "@medusajs/ui"
import { useRef } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { useTranslation } from "react-i18next"
import { Form } from "../../../../../components/common/form"
import { OrderDTO } from "@medusajs/types"

type OrderNoteFormProps = {
  order: OrderDTO
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

  const { mutateAsync, isLoading } = {}

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
        <form onSubmit={handleSubmit}>
          <div className="bg-ui-bg-field shadow-borders-base flex flex-col gap-y-2 rounded-md px-2 py-1.5">
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
                        className="txt-small text-ui-fg-base placeholder:text-ui-fg-muted resize-none overflow-hidden bg-transparent outline-none"
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
        </form>
      </Form>
    </div>
  )
}
