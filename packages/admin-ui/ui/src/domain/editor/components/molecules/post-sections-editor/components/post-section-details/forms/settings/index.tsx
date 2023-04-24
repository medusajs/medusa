import { useFormContext } from "react-hook-form"
import Input from "../../../../../../../../../components/molecules/input"

export const SettingsForm = () => {
  const { register } = useFormContext()

  return (
    <>
      <Input
        label="ID"
        prefix="#"
        placeholder="element-id"
        {...register("settings.element_id")}
      />

      <Input
        label="Classes"
        placeholder="element-class"
        {...register("settings.element_class_name")}
      />
    </>
  )
}
