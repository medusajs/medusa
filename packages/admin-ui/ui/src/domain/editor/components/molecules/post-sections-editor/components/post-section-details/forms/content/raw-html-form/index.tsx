import { FC } from "react"
import { useFormContext } from "react-hook-form"
import TextArea from "../../../../../../../../../../components/molecules/textarea"

export interface RawHTMLFormProps {}

export const RawHTMLForm: FC<RawHTMLFormProps> = () => {
  const { register } = useFormContext()

  return (
    <TextArea
      label="HTML"
      resize
      inputClassName="!min-h-[200px]"
      {...register("content.html.value")}
      placeholder="<p>Your raw HTML code...</p>"
    />
  )
}
