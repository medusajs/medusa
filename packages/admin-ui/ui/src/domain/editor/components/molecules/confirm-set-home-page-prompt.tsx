import { FC } from "react"
import { HomeIcon } from "@heroicons/react/20/solid"
import Badge from "../../../../components/fundamentals/badge"
import ConfirmationPrompt, {
  ConfirmationPromptProps,
} from "../../../../components/organisms/confirmation-prompt"
import { useGetHomePage } from "../../../../hooks/admin/posts"
import { Post } from "@medusajs/medusa"
import ArrowDownIcon from "../../../../components/fundamentals/icons/arrow-down-icon"

export interface ConfirmSetHomePageModalProps
  extends Omit<ConfirmationPromptProps, "heading" | "text"> {
  post: Post
}

export const ConfirmSetHomePagePrompt: FC<ConfirmSetHomePageModalProps> = ({
  post: newHomePage,
  ...props
}) => {
  const { post: currentHomePage, isLoading } = useGetHomePage()

  return (
    <ConfirmationPrompt
      {...props}
      notificationOptions={{ position: "bottom-left" }}
      heading="Set new home page?"
      confirmProps={{ disabled: isLoading }}
      text={
        <div className="inter-base-regular text-grey-50">
          <div className="mt-3">
            By proceeding, you will:
            <ul className="my-2 list-disc list-inside pl-0">
              <li>Save and publish the new home page in it's current state.</li>
              <li>Override and set the current home page to "draft."</li>
            </ul>
          </div>

          {isLoading && <>Loading current home page...</>}

          {currentHomePage && !isLoading && (
            <div className="flex flex-col gap-3 rounded-rounded border border-grey-20 p-4 mt-4">
              <div className="flex items-start gap-4">
                <Badge
                  variant="primary"
                  className="flex items-center justify-center flex-shrink-0 w-12 h-12 p-0"
                >
                  <HomeIcon className="w-6 h-6" />
                </Badge>
                <div className="flex flex-col gap-2">
                  <p className="pt-1.5 inter-small-regular leading-none text-grey-50 -mt-0.5">
                    From
                  </p>
                  <div className="inter-large-semibold leading-small text-grey-90">
                    {currentHomePage?.title || "Untitled"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center flex-grow-0 flex-shrink-0 w-12">
                  <ArrowDownIcon className="text-grey-50 inline-block w-4 h-4" />
                </div>
                <div className="flex-1 border-t border-grey-20 border-dashed" />
              </div>

              <div className="flex items-start gap-4">
                <Badge
                  variant="primary"
                  className="flex items-center justify-center flex-shrink-0 w-12 h-12 p-0"
                >
                  <HomeIcon className="w-6 h-6" />
                </Badge>
                <div className="flex flex-col gap-2">
                  <p className="pt-1.5 inter-small-regular leading-none text-grey-50 -mt-0.5">
                    To
                  </p>
                  <div className="inter-large-semibold leading-small text-grey-90">
                    {newHomePage?.title || "Untitled"}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      }
    />
  )
}
