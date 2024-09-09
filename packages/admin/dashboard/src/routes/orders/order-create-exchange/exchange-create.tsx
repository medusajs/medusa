import { toast } from "@medusajs/ui"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate, useParams } from "react-router-dom"

import { RouteFocusModal } from "../../../components/modals"
import { useCreateExchange, useExchange } from "../../../hooks/api/exchanges"
import { useOrder, useOrderPreview } from "../../../hooks/api/orders"
import { useReturn } from "../../../hooks/api/returns"
import { DEFAULT_FIELDS } from "../order-detail/constants"
import { ExchangeCreateForm } from "./components/exchange-create-form"

let IS_REQUEST_RUNNING = false

export const ExchangeCreate = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const { order } = useOrder(id!, {
    fields: DEFAULT_FIELDS,
  })

  const { order: preview } = useOrderPreview(id!)
  const [activeExchangeId, setActiveExchangeId] = useState<string>()
  const { mutateAsync: createExchange } = useCreateExchange(order.id)

  const { exchange } = useExchange(activeExchangeId!, undefined, {
    enabled: !!activeExchangeId,
  })

  const { return: orderReturn } = useReturn(exchange?.return_id!, undefined, {
    enabled: !!exchange?.return_id,
  })

  useEffect(() => {
    async function run() {
      if (IS_REQUEST_RUNNING || !preview) {
        return
      }

      if (preview.order_change) {
        if (preview.order_change.change_type === "exchange") {
          setActiveExchangeId(preview.order_change.exchange_id)
        } else {
          navigate(`/orders/${preview.id}`, { replace: true })
          toast.error(t("orders.exchanges.activeChangeError"))
        }

        return
      }

      IS_REQUEST_RUNNING = true

      try {
        const { exchange: createdExchange } = await createExchange({
          order_id: preview.id,
        })

        setActiveExchangeId(createdExchange.id)
      } catch (e) {
        toast.error(e.message)
        navigate(`/orders/${preview.id}`, { replace: true })
      } finally {
        IS_REQUEST_RUNNING = false
      }
    }

    run()
  }, [preview])

  return (
    <RouteFocusModal>
      {exchange && preview && order && (
        <ExchangeCreateForm
          order={order}
          exchange={exchange}
          preview={preview}
          orderReturn={orderReturn}
        />
      )}
    </RouteFocusModal>
  )
}
