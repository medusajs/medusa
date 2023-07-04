import * as React from "react"
import { toast, ToastOptions } from "react-hot-toast"

export type ToasterProps = {
  visible: boolean
  children: React.ReactElement
} & ToastOptions

const Toaster = ({ visible, children, ...options }: ToasterProps) => {
  React.useEffect(() => {
    if (visible) {
      toast.custom((t) => React.cloneElement(children, { toast: t }), {
        ...options,
      })
    } else {
      toast.dismiss(options.id)
    }
  }, [visible, children])

  return null
}

export default Toaster
