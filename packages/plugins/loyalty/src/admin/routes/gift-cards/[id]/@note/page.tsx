import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Heading, Textarea, toast } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useParams } from "react-router-dom"
import { z } from "@medusajs/framework/zod"
import { AdminGiftCard } from "../../../../../types"
import { Form } from "../../../../components/form"
import { KeyboundForm } from "../../../../components/keybound-form"
import { RouteDrawer, useRouteModal } from "../../../../components/modals"
import {
  useGiftCard,
  useUpdateGiftCard,
} from "../../../../hooks/api/gift-cards"

const Note = () => {
  const { id } = useParams()
  const {
    gift_card: giftCard,
    isPending,
    isError,
    error,
  } = useGiftCard(id!, {})

  if (isError) {
    throw error
  }

  const isReady = !isPending && !!giftCard

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <RouteDrawer.Title asChild>
          <Heading>Edit note</Heading>
        </RouteDrawer.Title>

        <RouteDrawer.Description asChild>
          <span className="sr-only">Edit the note for the gift card</span>
        </RouteDrawer.Description>
      </RouteDrawer.Header>

      {isReady && <GiftCardNoteForm giftCard={giftCard} />}
    </RouteDrawer>
  )
}

interface GiftCardNoteFormProps {
  giftCard: AdminGiftCard
}

const GiftCardNoteForm = ({ giftCard }: GiftCardNoteFormProps) => {
  const form = useForm<z.infer<typeof schema>>({
    defaultValues: {
      note: giftCard.note ?? "",
    },
    resolver: zodResolver(schema),
  })

  const { mutateAsync, isPending } = useUpdateGiftCard(giftCard.id)
  const { handleSuccess } = useRouteModal()

  const onSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(
      { note: data.note },
      {
        onSuccess: () => handleSuccess(),
        onError: (error) => toast.error(error.message),
      }
    )
  })

  return (
    <RouteDrawer.Form form={form}>
      <KeyboundForm
        className="flex flex-1 flex-col overflow-hidden"
        onSubmit={onSubmit}
      >
        <RouteDrawer.Body className="flex flex-col gap-y-6 overflow-y-auto">
          <Form.Field
            control={form.control}
            name="note"
            render={({ field }) => (
              <Form.Item>
                <Form.Label>Note</Form.Label>
                <Form.Control>
                  <Textarea {...field} />
                </Form.Control>
                <Form.ErrorMessage />
              </Form.Item>
            )}
          />
        </RouteDrawer.Body>

        <RouteDrawer.Footer>
          <div className="flex justify-end gap-2">
            <RouteDrawer.Close asChild>
              <Button size="small" variant="secondary">
                Cancel
              </Button>
            </RouteDrawer.Close>

            <Button size="small" type="submit" isLoading={isPending}>
              Save
            </Button>
          </div>
        </RouteDrawer.Footer>
      </KeyboundForm>
    </RouteDrawer.Form>
  )
}

const schema = z.object({
  note: z.string().optional(),
})

export default Note
