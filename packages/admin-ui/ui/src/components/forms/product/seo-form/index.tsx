import { NestedForm } from "../../../../utils/nested-form"
import InputField from "../../../molecules/input"

export type SeoFormType = {
  seo_title: string | null
  seo_description: string | null
  seo_url: string | null
}

type Props = {
  form: NestedForm<SeoFormType>
}

const SeoForm = ({ form }: Props) => {
  const {
    register,
    path,
    formState: { errors },
  } = form

  return (
    <div>
      <div className="mb-large">
        <InputField
          label="Title"
          {...register(path("seo_title"))}
          errors={errors}
        />
      </div>
      <div className="mb-large">
        <InputField
          label="Description"
          placeholder="This is SEO description"
          {...register(path("seo_description"))}
          errors={errors}
        />
      </div>
      <div className="mb-large">
        <InputField
          label="URL"
          placeholder="This is SEO URL"
          {...register(path("seo_url"))}
          errors={errors}
        />
      </div>
    </div>
  )
}

export default SeoForm
