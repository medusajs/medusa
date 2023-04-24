import { useState } from "react"
import { useAdminProduct } from "medusa-react"
import { useNavigate, useParams } from "react-router-dom"
import BackButton from "../../../components/atoms/back-button"
import Spinner from "../../../components/atoms/spinner"
import RawJSON from "../../../components/organisms/raw-json"
import { getErrorStatus } from "../../../utils/get-error-status"
import AttributesSection from "./sections/attributes"
import CustomFieldsSection from "./sections/custom-fields"
import GeneralSection from "./sections/general"
import MediaSection from "./sections/media"
import ThumbnailSection from "./sections/thumbnail"
import VariantsSection from "./sections/variants"
import Button from "../../../components/fundamentals/button"
import { useGetSiteSettings } from "../../../hooks/admin/site-details/queries"
import {
  ArrowTopRightOnSquareIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline"
import { useAdminCreatePost, useGetPosts } from "../../../hooks/admin/posts"
import { PostContentMode, PostStatus, PostType } from "../../../types/shared"
import useNotification from "../../../hooks/use-notification"
import { Post } from "@medusajs/medusa"

const Edit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const notification = useNotification()
  const { storefrontURL } = useGetSiteSettings()
  const { mutateAsync: createPost } = useAdminCreatePost(PostType.PRODUCT)
  const { product, status, error } = useAdminProduct(id || "")
  const { posts } = useGetPosts("product", { product_id: id })
  const [isCreatingPost, setIsCreatingPost] = useState<boolean>(false)

  if (error) {
    let message = "An unknown error occurred"

    const errorStatus = getErrorStatus(error)

    if (errorStatus) {
      message = errorStatus.message

      // If the product is not found, redirect to the 404 page
      if (errorStatus.status === 404) {
        navigate("/404")
        return null
      }
    }

    // Let the error boundary handle the error
    console.error(message)
    throw error
  }

  if (status === "loading" || !product) {
    // temp, perhaps use skeletons?
    return (
      <div className="w-full h-[calc(100vh-64px)] flex items-center justify-center">
        <Spinner variant="secondary" />
      </div>
    )
  }

  const onClickEditPage = async () => {
    const [post]: Post[] = posts || []

    if (post) return navigate(`/admin/editor/${PostType.PRODUCT}/${post.id}`)

    setIsCreatingPost(true)

    const { data } = await createPost({
      status: PostStatus.PUBLISHED, // NOTE: Product pages should always be published
      content_mode: PostContentMode.ADVANCED,
      product_id: id,
    })

    if (!data.post) {
      setIsCreatingPost(false)
      return notification("Failed to create post", "Please try again", "error")
    }

    return navigate(`/admin/editor/${PostType.PRODUCT}/${data.post.id}`)
  }

  return (
    <div className="pb-5xlarge">
      <div className="flex items-center justify-between gap-4 mb-4">
        <BackButton path="../" label="Back to Products" />

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="small"
            disabled={isCreatingPost}
            loading={isCreatingPost}
            onClick={onClickEditPage}
          >
            <DocumentTextIcon className="w-5 h-5" />
            <span>Edit page</span>
          </Button>

          <a
            href={`${storefrontURL}/products/${product.handle}`}
            target="_blank"
          >
            <Button variant="secondary" size="small">
              <ArrowTopRightOnSquareIcon className="w-5 h-5" />
              <span>View page</span>
            </Button>
          </a>
        </div>
      </div>
      <div className="grid grid-cols-12 grid-flow-dense gap-x-base gap-y-xsmall">
        <div className="flex flex-col medium:flex-row large:flex-col col-span-12 large:col-start-9 large:col-span-4 gap-xsmall">
          <ThumbnailSection product={product} />
          <MediaSection product={product} />
        </div>
        <div className="col-span-12 large:col-span-8 large:col-start-1 flex flex-col gap-xsmall">
          <GeneralSection product={product} />
          <CustomFieldsSection product={product} />
          <VariantsSection product={product} />
          <AttributesSection product={product} />
          <RawJSON title="Product" data={product} />
        </div>
      </div>
    </div>
  )
}

export default Edit
