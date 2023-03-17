import { FormImage, Option } from "../../../../types/shared"

export type ManageGiftCardFormData = {
  title: string
  handle?: string
  subtitle?: string | null
  description?: string | null
  type: Option | null
  tags?: string[]
  images: FormImage[]
  thumbnail: number
}
