import { useNavigate, useParams } from "react-router-dom"
import { PostSection } from "@medusajs/medusa"
import { useGetPostSection } from "../../../../../../hooks/admin/post-sections"
import Spinner from "../../../../../../components/atoms/spinner"
import { PostSectionProvider } from "../components/post-section-details/context"
import { PostSectionDetails } from "../components/post-section-details"
import { usePostContext } from "../../../../context"
import { usePostSectionsEditorContext } from "../context"

export const PostSectionEdit = () => {
  const navigate = useNavigate()
  const { sectionId } = useParams()
  const { post } = usePostContext()
  const { onDuplicate, onDelete, refetchPostSections } =
    usePostSectionsEditorContext()
  const {
    post_section: postSection,
    isLoading,
    isFetchedAfterMount,
  } = useGetPostSection(sectionId || "", {
    refetchOnMount: "always",
  })

  const handleDuplicate = (id: string, newPostSection: PostSection) => {
    onDuplicate(id, newPostSection, true)
  }

  if (!post || (!postSection && isLoading) || !isFetchedAfterMount)
    return (
      <div className="flex justify-center px-5 large:px-6 pt-12">
        <div className="flex flex-col justify-center items-center gap-2 px-6 py-6 rounded-rounded">
          <Spinner size="large" variant="secondary" /> Loading section
          data&hellip;
        </div>
      </div>
    )

  if (!sectionId || !postSection) {
    navigate(`/admin/editor/${post.type}/${post.id}`, { replace: true })
    return null
  }

  return (
    <PostSectionProvider
      id={sectionId}
      post={post}
      postSection={postSection}
      onSave={() => refetchPostSections()}
      onDraftSave={() => refetchPostSections()}
      onDuplicate={handleDuplicate}
      onDelete={onDelete}
      isLoading={isLoading}
    >
      <PostSectionDetails />
    </PostSectionProvider>
  )
}
