import { PostType } from "../../../types/shared"

export const getPostTypeLabel = (type: PostType) => {
  const labels = {
    [PostType.PAGE]: "Page",
    [PostType.POST]: "Post",
    [PostType.PRODUCT]: "Product",
  }

  return labels[type]
}
