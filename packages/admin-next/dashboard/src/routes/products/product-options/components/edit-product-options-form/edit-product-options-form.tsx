import { Product } from "@medusajs/medusa"

type EditProductOptionsFormProps = {
  product: Product
  onSuccessfulSubmit: () => void
  subscribe: (state: boolean) => void
}

export const EditProductOptionsForm = ({
  product,
  onSuccessfulSubmit,
  subscribe,
}: EditProductOptionsFormProps) => {
  return (
    <div>
      <div></div>
    </div>
  )
}
