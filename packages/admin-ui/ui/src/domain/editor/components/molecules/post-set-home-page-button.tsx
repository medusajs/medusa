import { useState } from "react"
import { useFormContext } from "react-hook-form"
import Alert from "../../../../components/molecules/alert"
import { HomeIcon } from "@heroicons/react/20/solid"
import Button from "../../../../components/fundamentals/button"
import { usePostContext } from "../../context"
import { ConfirmSetHomePagePrompt } from "./confirm-set-home-page-prompt"
import { Post } from "@medusajs/medusa"

const PostHomePage = () => {
  const { isHomePage, onSave, featureFlags } = usePostContext()
  const { setValue, getValues } = useFormContext()
  const [showConfirm, setShowConfirm] = useState(false)

  const handleClick = () => {
    setShowConfirm(true)
  }

  const handleConfirm = async () => {
    setValue("is_home_page", true)
    onSave()
  }

  if (!featureFlags.home_page) return null

  return (
    <>
      {isHomePage && (
        <Alert
          icon={HomeIcon}
          variant="primary"
          content="You are editing the home page."
          className="!p-3"
        />
      )}

      {!isHomePage && (
        <>
          <Button
            type="submit"
            variant="secondary"
            size="medium"
            onClick={handleClick}
          >
            <HomeIcon className="w-4 h-4" /> Set as Home Page
          </Button>

          {showConfirm && (
            <ConfirmSetHomePagePrompt
              post={getValues() as Post}
              handleClose={() => setShowConfirm(false)}
              onConfirm={handleConfirm}
              notificationOptions={{ position: "bottom-left" }}
            />
          )}
        </>
      )}
    </>
  )
}

export default PostHomePage
