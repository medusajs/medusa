import React from "react"
import InputField from "../../../../components/molecules/input"
import TextArea from "../../../../components/molecules/textarea"
import FormValidator from "../../../../utils/form-validator"
import { NestedForm } from "../../../../utils/nested-form"

export type GeneralFormType = {
  title: string
  subtitle: string | null
  handle: string
  material: string | null
  description: string | null
}

type Props = {
  form: NestedForm<GeneralFormType>
  requireHandle?: boolean
}

const GeneralForm = ({ form, requireHandle = true }: Props) => {
  const {
    register,
    path,
    formState: { errors },
  } = form

  return (
    <div>
      <div className="grid grid-cols-2 gap-x-large mb-small">
        <InputField
          label="Title"
          placeholder="Winter Jacket"
          required
          {...register(path("title"), {
            required: "Title is required",
            minLength: {
              value: 1,
              message: "Title must be at least 1 character",
            },
            pattern: FormValidator.whiteSpaceRule("Title"),
          })}
          errors={errors}
        />
        <InputField
          label="Subtitle"
          placeholder="Warm and cozy..."
          {...register(path("subtitle"), {
            pattern: FormValidator.whiteSpaceRule("Subtitle"),
          })}
          errors={errors}
        />
      </div>
      <p className="inter-base-regular text-grey-50 mb-large">
        Give your product a short and clear title.
        <br />
        50-60 characters is the recommended length for search engines.
      </p>
      <div className="grid grid-cols-2 gap-x-large mb-large">
        <InputField
          label="Handle"
          tooltipContent={
            !requireHandle
              ? "The handle is the part of the URL that identifies the product. If not specified, it will be generated from the title."
              : undefined
          }
          placeholder="winter-jacket"
          required={requireHandle}
          {...register(path("handle"), {
            required: requireHandle ? "Handle is required" : undefined,
            minLength: FormValidator.minOneCharRule("Handle"),
            pattern: FormValidator.whiteSpaceRule("Handle"),
          })}
          prefix="/"
          errors={errors}
        />
        <InputField
          label="Material"
          placeholder="100% cotton"
          {...register(path("material"), {
            minLength: FormValidator.minOneCharRule("Material"),
            pattern: FormValidator.whiteSpaceRule("Material"),
          })}
          errors={errors}
        />
      </div>
      <TextArea
        label="Description"
        placeholder="A warm and cozy jacket..."
        rows={3}
        className="mb-small"
        {...register(path("description"))}
        errors={errors}
      />
      <p className="inter-base-regular text-grey-50">
        Give your product a short and clear description.
        <br />
        120-160 characters is the recommended length for search engines.
      </p>
    </div>
  )
}

export default GeneralForm
