import { FC, useState } from "react"
import { Post } from "@medusajs/medusa"
import BodyCard from "../../../components/organisms/body-card"
import PostTable from "../../../components/templates/post-table"
import PlusIcon from "../../../components/fundamentals/icons/plus-icon"
import { useAdminCreatePost, useGetPosts } from "../../../hooks/admin/posts"
import Spinner from "../../../components/atoms/spinner"
import useNotification from "../../../hooks/use-notification"
import { useNavigate } from "react-router-dom"
import { PostContentMode, PostStatus, PostType } from "../../../types/shared"
import { getPostTypeLabel } from "../../editor/helpers/get-post-type-label"

export interface PostsIndexProps {
  type: Post["type"]
}

const PostsIndex: FC<PostsIndexProps> = ({ type }) => {
  const navigate = useNavigate()
  const notification = useNotification()
  const { posts, count } = useGetPosts(type!, { limit: 999999 })
  const { mutateAsync: createPost } = useAdminCreatePost(type!)
  const [isCreating, setIsCreating] = useState(false)

  const actions = [
    {
      disabled: isCreating,
      label: isCreating ? `Creating...` : `New ${type}`,
      onClick: async () => {
        setIsCreating(true)
        const { data } = await createPost({
          status: PostStatus.DRAFT,
          content_mode: [PostType.PAGE].includes(type)
            ? PostContentMode.ADVANCED
            : PostContentMode.BASIC,
        })

        if (!data.post) {
          setIsCreating(false)
          return notification(
            "Failed to create post",
            "Please try again",
            "error"
          )
        }

        navigate(`/admin/editor/${type}s/${data.post.id}`)
      },
      icon: <PlusIcon size={20} />,
    },
  ]

  if (!posts) return <Spinner size="large" variant="primary" />

  return (
    <BodyCard title={`${getPostTypeLabel(type)}s`} actionables={actions}>
      <PostTable type={type} posts={posts} count={count || 0} />
    </BodyCard>
  )
}

export default PostsIndex
