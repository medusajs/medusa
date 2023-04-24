import { FC } from "react"
import SEO from "../../components/seo"
import { useGetPost } from "../../hooks/admin/posts"
import Spinner from "../../components/atoms/spinner"
import { PostDetailsTemplate } from "./components/templates/post-details-template"
import { Route, Routes, redirect, useParams } from "react-router-dom"
import { getPostTypeLabel } from "./helpers/get-post-type-label"
import { PostProvider } from "./context/post-context"
import { PostType } from "../../types/shared"
import { useAdminProduct } from "medusa-react"
import { useBasePath } from "../../utils/routePathing"

export interface EditorDetailsProps {}

const EditorDetails: FC<EditorDetailsProps> = () => {
  const basePath = useBasePath()
  const { id, type } = useParams()
  const {
    post,
    isLoading: isPostLoading,
    isFetchedAfterMount: isPostFetchedAfterMount,
  } = useGetPost(id || "", {
    // We need to refetch on mount to account for when posts are updated
    // by setting or deleting the home page outside of this specific post.
    refetchOnMount: "always",
  })
  const { product, isLoading: isProductLoading } = useAdminProduct(
    post?.product_id || ""
  )

  const isLoading = isPostLoading || isProductLoading

  if (!isPostFetchedAfterMount) {
    return <Spinner size="large" variant="primary" />
  }

  if (!post && isPostLoading) {
    return <Spinner size="large" variant="primary" />
  }

  if (!post) {
    redirect(`/admin/content/${type}`)
    return null
  }

  if (post.type === PostType.PRODUCT) {
    if (!product && isProductLoading) {
      return <Spinner size="large" variant="primary" />
    }

    if (!product) {
      redirect(`${basePath}/products/${post.product_id}`)
      return null
    }
  }

  return (
    <>
      <SEO title={`Edit ${getPostTypeLabel(type as PostType)} - MarketHaus`} />

      <PostProvider post={post} product={product} isLoading={isLoading}>
        <PostDetailsTemplate />
      </PostProvider>
    </>
  )
}

const EditorIndex = () => (
  <Routes>
    <Route path="/:type/:id/*" element={<EditorDetails />} />
  </Routes>
)

export default EditorIndex
