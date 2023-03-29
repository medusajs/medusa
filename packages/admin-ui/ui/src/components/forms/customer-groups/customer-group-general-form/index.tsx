import FormValidator from "../../../../utils/form-validator"
import { nestedForm, NestedForm } from "../../../../utils/nested-form"
import InputField from "../../../molecules/input"
import MetadataForm, { MetadataFormType } from "../../general/metadata-form"

export type CustomerGroupGeneralFormType = {
  name: string
  metadata: MetadataFormType
}

type CustomerGroupGeneralFormProps = {
  form: NestedForm<CustomerGroupGeneralFormType>
}

export const CustomerGroupGeneralForm = ({
  form,
}: CustomerGroupGeneralFormProps) => {
  const { register, path } = form

  return (
    <div>
      <div>
        <h2 className="inter-base-semibold">Details</h2>
        <InputField
          label="Name"
          required
          {...register(path("name"), {
            required: FormValidator.required("Name"),
          })}
        />
      </div>
      <div>
        <h2 className="inter-base-semibold">Metadata</h2>
        <MetadataForm form={nestedForm(form, "metadata")} />
      </div>
    </div>
  )
}
