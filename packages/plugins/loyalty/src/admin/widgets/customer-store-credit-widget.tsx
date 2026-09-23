import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Button, Container } from "@medusajs/ui"
import { Link, useParams } from "react-router-dom"
import { Header } from "../components/header"
import { useStoreCreditAccounts } from "../hooks/api/store-credit-accounts"
import CreditCardIcon from "../routes/store-credit-accounts/[id]/components/credit-card-icon"
import { NoRecords, SidebarLink } from "@medusajs/dashboard/components"
import { formatCurrency } from "@medusajs/dashboard/lib"

const CustomerStoreCreditWidget = () => {
  const params = useParams()

  const { store_credit_accounts: storeCreditAccounts, isPending } =
    useStoreCreditAccounts({
      customer_id: params.id!,
    })

  if (isPending) {
    return null
  }

  const createHref = `/store-credit-accounts/create?prefill_customer_id=${params.id}`;

  return (
    <Container className="p-0">
      <Header
        title="Store Credit Accounts"
        actions={[
          {
            type: "custom",
            children: (
              <Link to={createHref}>
                <Button variant="secondary" size="small">
                  Create
                </Button>
              </Link>
            ),
          },
        ]}
      />

      {!storeCreditAccounts?.length && (
        <NoRecords
          className="border-t"
          title="No store credit accounts"
          message="Create an account to credit this customer"
          icon={null}
        />
      )}

      {storeCreditAccounts?.map((storeCreditAccount) => (
        <SidebarLink
          icon={<CreditCardIcon className="h-[24px] w-[32px]" />}
          key={storeCreditAccount.id}
          labelKey={`${storeCreditAccount.currency_code.toUpperCase()} Account`}
          descriptionKey={formatCurrency(
            (storeCreditAccount.balance as number) ?? 0,
            storeCreditAccount.currency_code
          )}
          to={`/store-credit-accounts/${storeCreditAccount.id}`}
        />
      ))}
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "customer.details.side.after",
  id: "medusa:customer-store-credit-widget",
})

export default CustomerStoreCreditWidget
