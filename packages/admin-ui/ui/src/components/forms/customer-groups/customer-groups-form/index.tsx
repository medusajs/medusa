import FormValidator from "../../../../utils/form-validator"
import { nestedForm, NestedForm } from "../../../../utils/nested-form"
import InputField from "../../../molecules/input"
import MetadataForm, { MetadataFormType } from "../../general/metadata-form"

export type CustomerGroupsFormType = {
  title: string
  metadata: MetadataFormType
}

type CustomerGroupsFormProps = {
  form: NestedForm<CustomerGroupsFormType>
}

const CustomerGroupsForm = ({ form }: CustomerGroupsFormProps) => {
  const {
    register,
    formState: { errors },
    path,
  } = form

  return (
    <div>
      <div>
        <h2>Details</h2>
        <InputField
          label="Title"
          required
          errors={errors}
          {...register(path("title"), {
            required: FormValidator.required("Title"),
          })}
        />
      </div>
      <div>
        <MetadataForm form={nestedForm(form, "metadata")} />
      </div>
    </div>
  )
}

export default CustomerGroupsForm
