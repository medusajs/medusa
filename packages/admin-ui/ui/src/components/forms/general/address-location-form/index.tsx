import { Option } from "../../../../types/shared"
import { NestedForm } from "../../../../utils/nested-form"

export type AddressLocationFormType = {
  address_1: string
  address_2: string | null
  city: string
  province: string | null
  country_code: Option
  postal_code: string
}

type AddressLocationFormProps = {
  requireFields?: Partial<Record<keyof AddressLocationFormType, boolean>>
  form: NestedForm<AddressLocationFormType>
}

const AddressLocationForm = ({
  form,
  requireFields,
}: AddressLocationFormProps) => {
  const {
    register,
    path,
    formState: { errors },
    control,
  } = form
}
