import React, { useEffect, useState } from "react"
import { useQueryStringValue } from "@docusaurus/theme-common/internal"
import { useNotifications } from "../providers/NotificationProvider"
import Rating from "../components/Rating"

const useOnboarding = () => {
  const isOnboarding = useQueryStringValue("ref") === "onboarding"
  const [showNotification, setShowNotification] = useState(isOnboarding)
  const { addNotification, removeNotification, generateId } = useNotifications()

  useEffect(() => {
    if (isOnboarding) {
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
            onRating={() => {
              setTimeout(() => removeNotification(id), 1500)
            }}
          />
        ),
      })
    }
  }, [])
}

export default useOnboarding
