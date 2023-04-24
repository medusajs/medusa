import useNotification from "./use-notification"
import Medusa from "../services/api"
import { getErrorMessage } from "../utils/error-messages"

export interface ImageFile {
  url?: string
  name?: string
  size?: number
  file?: File
}

export interface UploadFileRes {
  key: string
  url: string
}

export const useUploadFile = () => {
  const notification = useNotification()

  return async (uploads: File[]): Promise<UploadFileRes[] | undefined> => {
    if (!uploads.length) return

    try {
      const { data } = await Medusa.uploads.create(uploads)
      return data.uploads
    } catch (err) {
      notification("Error uploading images", getErrorMessage(err), "error")
    }
  }
}
