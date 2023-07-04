import DiscountForm from "./discount-form"
import { DiscountFormProvider } from "./discount-form/form/discount-form-context"

const New = () => {
  return (
    <div className="pb-xlarge">
      <DiscountFormProvider>
        <DiscountForm />
      </DiscountFormProvider>
    </div>
  )
}

export default New
