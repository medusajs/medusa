import React, { useEffect, useState } from "react"
import { useQueryStringValue } from "@docusaurus/theme-common/internal"
import { Rating, useAnalytics, useNotifications } from "docs-ui"

const useOnboarding = () => {
  const isOnboarding = useQueryStringValue("ref") === "onboarding"
  const [showNotification, setShowNotification] = useState(isOnboarding)
  const { addNotification, removeNotification, generateId } = useNotifications()
  const { track } = useAnalytics()

  useEffect(() => {
    if (isOnboarding) {
      track("finished_onboarding")
      const id = generateId()
      addNotification({
        title: "Thank you for installing Medusa!",
        text: "Please rate your onboarding experience",
        type: "success",
        show: showNotification,
        setShow: setShowNotification,
        id,
        children: (
          <Rating
            event="rating_onboarding"
            onRating={(rating?: number) => {
              if (rating >= 4) {
                setTimeout(() => removeNotification(id), 1500)
              }
            }}
            parentNotificationId={id}
          />
        ),
      })
    }
  }, [])
}

export default useOnboarding
