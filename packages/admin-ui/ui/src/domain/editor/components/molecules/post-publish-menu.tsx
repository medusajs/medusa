import { Controller, useFormContext } from "react-hook-form"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { HomeIcon } from "@heroicons/react/20/solid"
import RadioGroup from "../../../../components/organisms/radio-group"
import Button from "../../../../components/fundamentals/button"
import ChevronDownIcon from "../../../../components/fundamentals/icons/chevron-down"
import { usePostContext } from "../../context"
import Alert from "../../../../components/molecules/alert"
import { PostStatus } from "../../../../types/shared"

const PostPublishMenu = () => {
  const { control, setValue, watch, formState } = useFormContext()
  const { post, onSave, isDraft, isPublished, isHomePage, featureFlags } =
    usePostContext()
  const watchStatus = watch("status")

  const handleOpenChange = (open: boolean) => {
    // Reset the value when the dropdown closes
    if (!open) setValue("status", post.status)
  }

  const handleStatusChange = (value) => {
    // Use a separate change handler to avoid dirtying the form
    setValue("status", value)
  }

  return (
    <DropdownMenu.Root onOpenChange={handleOpenChange}>
      <div className="flex">
        <Button
          variant="secondary"
          size="medium"
          className="[&:not(:last-child)]:rounded-r-none"
          onClick={() => {
            if (isDraft)
              setValue("status", PostStatus.PUBLISHED, {
                shouldDirty: false,
              })
            onSave()
          }}
        >
          <span>{isPublished ? "Update" : "Publish"}</span>
        </Button>

        {featureFlags.status === true && (
          <DropdownMenu.Trigger asChild>
            <Button
              variant="secondary"
              size="medium"
              className="w-8 h-10 [&:not(:first-child)]:rounded-l-none -ml-[1px]"
            >
              <ChevronDownIcon size="16" />
            </Button>
          </DropdownMenu.Trigger>
        )}
      </div>

      <DropdownMenu.Content
        sideOffset={4}
        align="end"
        className="border bg-grey-0 border-grey-20 rounded-rounded shadow-dropdown min-w-[320px] max-w-[360px]"
      >
        <div className="inter-base-regular p-4">
          <Controller
            name="status"
            control={control}
            render={({ field: { value } }) => (
              <RadioGroup.Root
                value={value}
                onValueChange={handleStatusChange}
                className="flex flex-col gap-2"
              >
                {!isHomePage && (
                  <RadioGroup.Item
                    label={isDraft ? "Save draft" : "Unpublished"}
                    description={
                      isDraft
                        ? `Keep this ${post.type} as a private draft`
                        : `Revert this ${post.type} to a private draft`
                    }
                    value={PostStatus.DRAFT}
                    className="!mb-0"
                  />
                )}
                <RadioGroup.Item
                  label={isDraft ? `Publish ${post.type}` : "Published"}
                  description={`Display this ${post.type} publicly`}
                  value={PostStatus.PUBLISHED}
                  className="!mb-0"
                />
              </RadioGroup.Root>
            )}
          />

          {isHomePage && (
            <Alert
              icon={HomeIcon}
              variant="primary"
              className="mt-4"
              title="You are editing the home page"
              content="You may not unpublish this page without first setting a new home&nbsp;page."
            />
          )}
        </div>

        <div className="flex justify-between items-center gap-2 border-t border-t-grey-20 p-4">
          <div className="flex-1" />

          <div className="flex justify-end gap-2">
            <DropdownMenu.Item asChild>
              <Button
                variant="secondary"
                size="small"
                disabled={formState.isSubmitting}
              >
                Cancel
              </Button>
            </DropdownMenu.Item>

            <Button
              variant="primary"
              size="small"
              onClick={onSave}
              disabled={formState.isSubmitting}
            >
              <span>
                {watchStatus === PostStatus.DRAFT && (
                  <>
                    {formState.isSubmitting
                      ? "Saving..."
                      : isPublished
                      ? "Unpublish"
                      : "Save Draft"}
                  </>
                )}
                {watchStatus === PostStatus.PUBLISHED && (
                  <>
                    {formState.isSubmitting
                      ? "Publish..."
                      : isPublished
                      ? "Save"
                      : "Publish"}
                  </>
                )}
              </span>
            </Button>
          </div>
        </div>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

export default PostPublishMenu
