import Medusa from "../services/api";
import { FormImage } from "../types/shared";

const splitImages = (
  images: FormImage[]
): { uploadImages: FormImage[]; existingImages: FormImage[] } => {
  const uploadImages: FormImage[] = []
  const existingImages: FormImage[] = []

  images.forEach((image) => {
    if (image.nativeFile) {
      uploadImages.push(image)
    } else {
      existingImages.push(image)
    }
  })

  return { uploadImages, existingImages }
}

export const prepareImages = async (images: FormImage[]) => {
  const { uploadImages, existingImages } = splitImages(images)

  let uploadedImgs: FormImage[] = []
  if (uploadImages.length > 0) {
    const files = uploadImages.map((i) => i.nativeFile)
    uploadedImgs = await Medusa.uploads
      .create(files)
      .then(({ data }) => data.uploads)
  }

  return [...existingImages, ...uploadedImgs]
}