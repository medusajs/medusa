import { FC, useMemo, useState } from "react"
import { Post } from "@medusajs/medusa"
import { NextSelect as Select } from "../../../../components/molecules/select/next-select"
import DeletePrompt, {
  DeletePromptProps,
} from "../../../../components/organisms/delete-prompt"
import {
  useAdminDeletePost,
  useAdminUpdatePost,
  useGetPosts,
} from "../../../../hooks/admin/posts"
import { useNavigate } from "react-router-dom"
import { Prompt } from "../../../../components/organisms/prompt"
import { PostStatus, PostType } from "../../../../types/shared"
import { getPostTypeLabel } from "../../helpers/get-post-type-label"

export interface DeletePostPromptProps
  extends Omit<DeletePromptProps, "heading" | "text" | "onDelete"> {
  post: Post
}

export const DeletePostPrompt: FC<DeletePostPromptProps> = ({
  post,
  ...props
}) => {
  const [newHomePageId, setNewHomePageId] = useState<null | string>(null)
  const navigate = useNavigate()
  const { posts } = useGetPosts(PostType.PAGE)
  const deletePost = useAdminDeletePost(post?.id || "", post.type)
  const { mutateAsync: updatePost } = useAdminUpdatePost(
    newHomePageId || "",
    post.type
  )
  const isHomePage = post.is_home_page

  const options = useMemo(
    () =>
      posts
        ?.filter((p) => p.id !== post.id)
        .map((post) => ({
          value: post.id,
          label: post.title || "Untitled",
        })) || [],
    [posts]
  )

  const handleDelete = async () => {
    if (!options.length) {
      props.handleClose()
    }

    if (isHomePage && newHomePageId) {
      await updatePost({
        status: PostStatus.PUBLISHED,
        is_home_page: true,
      })
    }

    await deletePost.mutateAsync({})
    navigate(`/admin/content/${post.type}s`)
  }

  return (
    <>
      {!isHomePage && (
        <DeletePrompt
          {...props}
          onDelete={handleDelete}
          heading={`Delete ${post.type}`}
          text={`Are you sure you want to delete this ${post.type}?`}
          confirmText="Yes, delete"
          successText={`${getPostTypeLabel(post.type)} deleted`}
        />
      )}

      {isHomePage && options.length > 0 && (
        <DeletePrompt
          {...props}
          onDelete={handleDelete}
          confirmProps={{ disabled: !newHomePageId }}
          heading="Set a new home page before deleting"
          text={
            <div className="inter-base-regular text-grey-50">
              <div className="mt-3">
                You must set a new home page before you can delete the current
                one. Select which page you would like to use:
              </div>
              <Select
                isMulti={false}
                options={options}
                onChange={(newValue) => setNewHomePageId(newValue?.value || "")}
                className="mt-4"
              />
            </div>
          }
        />
      )}

      {isHomePage && !options.length && (
        <Prompt
          {...props}
          onConfirm={props.handleClose}
          confirmText="Ok"
          heading="You cannot delete the current home page"
          text={
            <div className="inter-base-regular text-grey-50">
              {!options.length && (
                <div className="mt-3">
                  You must create a new page before you can delete the current
                  home page.
                </div>
              )}
            </div>
          }
        />
      )}
    </>
  )
}
