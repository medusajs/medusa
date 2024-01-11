import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

/**
 * Hook for managing the state of route modals.
 */
export const useRouteModalState = (): [
  open: boolean,
  onOpenChange: (open: boolean) => void
] => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setOpen(true)
  }, [])

  const onOpenChange = (open: boolean) => {
    if (!open) {
      setTimeout(() => {
        navigate("..", { replace: true })
      }, 200)
    }

    setOpen(open)
  }

  return [open, onOpenChange]
}
