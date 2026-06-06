import { HttpTypes } from "@zjedene-medusa/types"
import { toast } from "@zjedene-medusa/ui"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useDraftOrderBeginEdit } from "../api/draft-orders"

let IS_REQUEST_RUNNING = false

interface UseInitiateOrderEditProps {
  preview?: HttpTypes.AdminOrderPreview
}

export const useInitiateOrderEdit = ({
  preview,
}: UseInitiateOrderEditProps) => {
  const navigate = useNavigate()

  const { mutateAsync } = useDraftOrderBeginEdit(preview?.id!)

  useEffect(() => {
    async function run() {
      if (IS_REQUEST_RUNNING || !preview) {
        return
      }

      // If an order edit is already in progress, don't try to create a new one.
      if (preview.order_change) {
        return
      }

      IS_REQUEST_RUNNING = true

      await mutateAsync(undefined, {
        onError: (e) => {
          toast.error(e.message)
          navigate(`/draft-orders/${preview.id}`, { replace: true })

          return
        },
      })

      IS_REQUEST_RUNNING = false
    }

    run()
  }, [preview, navigate, mutateAsync])
}
