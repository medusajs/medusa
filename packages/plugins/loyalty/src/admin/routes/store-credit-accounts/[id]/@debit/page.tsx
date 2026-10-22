import { zodResolver } from "@hookform/resolvers/zod"
import { Button, CurrencyInput, Heading, Textarea, toast } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useParams } from "react-router-dom"
import { z } from "@medusajs/framework/zod"

import { AdminStoreCreditAccount } from "../../../../../types"
import { Form } from "../../../../components/form"
import { KeyboundForm } from "../../../../components/keybound-form"
import { RouteDrawer, useRouteModal } from "../../../../components/modals"
import {
  useDebitStoreCreditAccount,
  useStoreCreditAccount,
} from "../../../../hooks/api/store-credit-accounts"
import { currencies } from "../../../../lib/currencies"

const Debit = () => {
  const { id } = useParams()
  const {
    store_credit_account: storeCreditAccount,
    isPending,
    isError,
    error,
  } = useStoreCreditAccount(id!, {})

  if (isError) {
    throw error
  }

  const isReady = !isPending && !!storeCreditAccount

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <RouteDrawer.Title asChild>
          <Heading>Debit store credit account</Heading>
        </RouteDrawer.Title>

        <RouteDrawer.Description asChild>
          <span className="sr-only">Debit the store credit account</span>
        </RouteDrawer.Description>
      </RouteDrawer.Header>

      {isReady && (
        <StoreCreditAccountDebitForm storeCreditAccount={storeCreditAccount} />
      )}
    </RouteDrawer>
  )
}

interface StoreCreditAccountDebitFormProps {
  storeCreditAccount: AdminStoreCreditAccount
}

const StoreCreditAccountDebitForm = ({
  storeCreditAccount,
}: StoreCreditAccountDebitFormProps) => {
  const form = useForm<z.infer<typeof schema>>({
    defaultValues: {
      amount: {
        float: 0,
        value: "",
      },
      note: "",
    },
    resolver: zodResolver(schema),
  })

  const { mutateAsync, isPending } = useDebitStoreCreditAccount(
    storeCreditAccount.id
  )
  const { handleSuccess } = useRouteModal()

  const balance = (storeCreditAccount.balance as number) ?? 0

  const onSubmit = form.handleSubmit(async (data) => {
    if (data.amount.float <= 0) {
      form.setError("amount", { message: "Amount must be greater than 0" })
      return
    }

    if (data.amount.float > balance) {
      form.setError("amount", {
        message: "Amount can't be greater than the current balance",
      })
      return
    }

    await mutateAsync(
      { amount: data.amount.float, note: data.note },
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
            name="amount"
            render={({ field }) => (
              <Form.Item>
                <Form.Label>Amount</Form.Label>
                <Form.Control>
                  <CurrencyInput
                    min={0}
                    placeholder="0"
                    value={field.value.value}
                    onValueChange={(_value, _name, values) => {
                      field.onChange({
                        value: values?.value,
                        float: values?.float || null,
                      })
                    }}
                    symbol={
                      currencies[storeCreditAccount.currency_code.toUpperCase()]
                        .symbol_native
                    }
                    code={storeCreditAccount.currency_code.toUpperCase()}
                  />
                </Form.Control>
                <Form.ErrorMessage />
              </Form.Item>
            )}
          />

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
  note: z.string(),
  amount: z.object({
    float: z.number(),
    value: z.string(),
  }),
})

export default Debit
