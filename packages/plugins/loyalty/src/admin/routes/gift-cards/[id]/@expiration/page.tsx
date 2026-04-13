import { zodResolver } from "@hookform/resolvers/zod"
import {
  Button,
  clx,
  DatePicker,
  Heading,
  RadioGroup,
  toast,
} from "@medusajs/ui"
import { useState } from "react"
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

const GiftCardExpiration = () => {
  const { id } = useParams()
  const { gift_card: giftCard, isPending, isError, error } = useGiftCard(id!)

  if (isError) {
    throw error
  }

  const isReady = !isPending && !!giftCard

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <RouteDrawer.Title asChild>
          <Heading>Edit expiration date</Heading>
        </RouteDrawer.Title>

        <RouteDrawer.Description asChild>
          <span className="sr-only">
            Edit the expiration date for the gift card
          </span>
        </RouteDrawer.Description>
      </RouteDrawer.Header>

      {isReady && <GiftCardExpirationForm giftCard={giftCard} />}
    </RouteDrawer>
  )
}

interface GiftCardExpirationFormProps {
  giftCard: AdminGiftCard
}

const GiftCardExpirationForm = ({ giftCard }: GiftCardExpirationFormProps) => {
  const form = useForm<z.infer<typeof schema>>({
    defaultValues: {
      expires_at: giftCard.expires_at ? new Date(giftCard.expires_at) : null,
    },
    resolver: zodResolver(schema),
  })

  const { mutateAsync, isPending } = useUpdateGiftCard(giftCard.id)
  const { handleSuccess } = useRouteModal()
  const [isSettingExpiration, setIsSettingExpiration] = useState(
    !!giftCard.expires_at
  )

  const onSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(
      {
        expires_at: isSettingExpiration ? data.expires_at?.toISOString() : null,
      },
      {
        onSuccess: () => {
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
        className="flex flex-1 flex-col overflow-hidden"
        onSubmit={onSubmit}
      >
        <RouteDrawer.Body className="flex flex-col gap-y-6 overflow-y-auto">
          <RadioGroup
            className="flex flex-col gap-y-3"
            value={isSettingExpiration.toString()}
            onValueChange={(value) => setIsSettingExpiration(value === "true")}
          >
            <RadioGroup.ChoiceBox
              value={"false"}
              description={""}
              label={"No expiration date"}
              className={clx("basis-1/2")}
            />

            <RadioGroup.ChoiceBox
              value={"true"}
              label={"Set expiration date"}
              description={""}
              className={clx("basis-1/2")}
            />
          </RadioGroup>

          {isSettingExpiration && (
            <Form.Field
              control={form.control}
              name="expires_at"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label>Expiration date</Form.Label>

                    <Form.Control>
                      <DatePicker
                        granularity="minute"
                        hourCycle={12}
                        shouldCloseOnSelect={false}
                        {...field}
                      />
                    </Form.Control>

                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />
          )}
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
  expires_at: z.date().nullish(),
})

export default GiftCardExpiration
