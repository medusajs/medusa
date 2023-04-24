import { Route, Routes, useLocation } from "react-router-dom"
import { PostSectionsList } from "./templates/post-sections-list"
import { PostSectionEdit } from "./templates/post-section-edit"
import { PostSectionsEditorProvider } from "./context/post-sections-editor-context"
import { usePostContext } from "../../../context"
import clsx from "clsx"

export const PostSectionsEditor = () => {
  const { isEditorOpen } = usePostContext()
  const location = useLocation()

  return (
    <div
      className={clsx(
        "h-full w-[375px] large:w-[400px] inter-base-regular bg-white border-r border-grey-20",
        {
          hidden: !isEditorOpen,
        }
      )}
    >
      <PostSectionsEditorProvider>
        <Routes>
          <Route
            path="/sections/:sectionId"
            element={
              <PostSectionEdit
                // IMPORTANT NOTE: We need to pass the location key to the
                // to force the route to re-mount when switching directly
                // between sections. If the route is not re-mounted, the data
                // will not be refetched. and the section will use the data
                // from the previous active section.
                // See here for details: https://stackoverflow.com/a/39150493
                key={location.key}
              />
            }
          />
          <Route path="/" element={<PostSectionsList />} />
        </Routes>
      </PostSectionsEditorProvider>
    </div>
  )
}
