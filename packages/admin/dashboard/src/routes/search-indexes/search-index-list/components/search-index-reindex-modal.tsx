import { zodResolver } from "@hookform/resolvers/zod"
import { HttpTypes } from "@medusajs/types"
import {
  Button,
  DatePicker,
  FocusModal,
  Heading,
  Text,
  Textarea,
  toast,
} from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"
import { Form } from "../../../../components/common/form"
import { KeyboundForm } from "../../../../components/utilities/keybound-form"
import { useReindexSearchIndex } from "../../../../hooks/api/search-indexes"

const ReindexSchema = z.object({
  since: z.date().nullable(),
  entity_ids: z.string().optional(),
})

type SearchIndexReindexModalProps = {
  index: HttpTypes.AdminSearchIndex
  onClose: () => void
}

export const SearchIndexReindexModal = ({
  index,
  onClose,
}: SearchIndexReindexModalProps) => {
  const { t } = useTranslation()
  const { mutateAsync, isPending } = useReindexSearchIndex()

  const form = useForm<z.infer<typeof ReindexSchema>>({
    defaultValues: {
      since: null,
      entity_ids: "",
    },
    resolver: zodResolver(ReindexSchema),
  })

  const handleSubmit = form.handleSubmit(async (data) => {
    const ids = data.entity_ids
      ?.split(/[\n,]/)
      .map((id) => id.trim())
      .filter(Boolean)

    const body: HttpTypes.AdminReindexSearchIndex = {}
    if (data.since) {
      body.since = data.since.toISOString()
    }
    if (ids?.length) {
      body.filters = { ids }
    }

    await mutateAsync(
      {
        id: index.name,
        body: Object.keys(body).length ? body : undefined,
      },
      {
        onSuccess: () => {
          toast.success(t("searchIndexes.reindexSuccess", { name: index.name }))
          onClose()
        },
        onError: (error) => {
          toast.error(error.message)
        },
      }
    )
  })

  return (
    <FocusModal open onOpenChange={(open) => !open && onClose()}>
      <FocusModal.Content>
        <Form {...form}>
          <KeyboundForm
            className="flex size-full flex-col overflow-hidden"
            onSubmit={handleSubmit}
          >
            <FocusModal.Header />
            <FocusModal.Body className="flex flex-1 justify-center overflow-auto px-6 py-16">
              <div className="flex w-full max-w-[560px] flex-col gap-y-8">
                <div className="flex flex-col gap-y-1">
                  <Heading>
                    {t("searchIndexes.reindexConfirmationTitle", {
                      name: index.name,
                    })}
                  </Heading>
                  <Text size="small" className="text-ui-fg-subtle">
                    {t("searchIndexes.reindexConfirmation", {
                      name: index.name,
                    })}
                  </Text>
                </div>
                <Form.Field
                  control={form.control}
                  name="since"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <Form.Label optional>
                          {t("searchIndexes.reindexSinceLabel")}
                        </Form.Label>
                        <Form.Hint>
                          {t("searchIndexes.reindexSinceHint")}
                        </Form.Hint>
                        <Form.Control>
                          <DatePicker
                            granularity="minute"
                            shouldCloseOnSelect={false}
                            {...field}
                          />
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )
                  }}
                />
                <Form.Field
                  control={form.control}
                  name="entity_ids"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <Form.Label optional>
                          {t("searchIndexes.reindexEntityIdsLabel")}
                        </Form.Label>
                        <Form.Hint>
                          {t("searchIndexes.reindexEntityIdsHint")}
                        </Form.Hint>
                        <Form.Control>
                          <Textarea {...field} rows={3} />
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )
                  }}
                />
              </div>
            </FocusModal.Body>
            <FocusModal.Footer>
              <div className="flex items-center justify-end gap-2">
                <Button
                  size="small"
                  variant="secondary"
                  type="button"
                  onClick={onClose}
                >
                  {t("actions.cancel")}
                </Button>
                <Button size="small" type="submit" isLoading={isPending}>
                  {t("searchIndexes.reindex")}
                </Button>
              </div>
            </FocusModal.Footer>
          </KeyboundForm>
        </Form>
      </FocusModal.Content>
    </FocusModal>
  )
}
