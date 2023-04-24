import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../../../../../components/molecules/tabs"
import { PostSectionNameInput } from "./post-section-name-input"
import { PostSectionTypeLabel } from "./post-section-type-label"
import { PostSectionContentForm } from "./post-section-content-form"
import { PostSectionSettingsForm } from "./post-section-settings-form"
import { PostSectionStylesForm } from "./post-section-styles-form"
import { PostSectionHeader } from "./post-section-header"
import { useUpdatePostSectionDraft } from "./helpers/use-update-post-section-draft"
import { PostSectionConfirmLeavePrompt } from "./post-section-confirm-leave-prompt"

export const PostSectionDetails = () => {
  useUpdatePostSectionDraft()

  return (
    <>
      <div className="flex flex-col w-full h-full">
        <PostSectionHeader />

        <div className="flex-1 min-h-0 p-5 large:p-6 overflow-y-auto">
          <div className="flex flex-col gap-1 mb-6 pt-2">
            <PostSectionTypeLabel />
            <PostSectionNameInput />
          </div>

          <Tabs defaultValue="content">
            <TabsList>
              <TabsTrigger value="content">
                <span>Content</span>
              </TabsTrigger>

              <TabsTrigger value="styles">
                <span>Styles</span>
              </TabsTrigger>

              <TabsTrigger value="settings">
                <span>Settings</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="content">
              <PostSectionContentForm />
            </TabsContent>

            <TabsContent value="styles">
              <PostSectionStylesForm />
            </TabsContent>

            <TabsContent value="settings">
              <PostSectionSettingsForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <PostSectionConfirmLeavePrompt />
    </>
  )
}
