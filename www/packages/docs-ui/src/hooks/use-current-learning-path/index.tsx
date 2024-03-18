"use client"

import React, { useEffect } from "react"
import { useLearningPath, useNotifications } from "@/providers"
import { LearningPathIcon } from "../../components/LearningPath/Icon"
import { LearningPathFinish } from "../../components/LearningPath/Finish"
import { LearningPathSteps } from "../../components/LearningPath/Steps"

export const useCurrentLearningPath = () => {
  const { path, currentStep, updatePath, endPath } = useLearningPath()
  const step = path?.steps[currentStep]
  const {
    addNotification,
    generateId,
    removeNotification,
    updateNotification,
  } = useNotifications() || {}

  // used when a notification closed (finished or not)
  const handleClose = (notificationId: string, shouldEndPath = true) => {
    if (shouldEndPath) {
      setTimeout(() => {
        endPath()
      }, 500)
    }
    removeNotification?.(notificationId)
  }

  // used when the learning path is completely finished
  // shows the finish step, if the path has any
  const handleFinish = (notificationId: string) => {
    if (path?.finish) {
      updateNotification?.(notificationId, {
        title: path.finish.step.title,
        text: path.finish.step.description,
        type: "custom",
        layout: "default",
        CustomIcon: (
          <LearningPathIcon
            className="!w-2 !h-2"
            imgClassName="!w-1.5 !h-1.5"
          />
        ),
        children: (
          <LearningPathFinish
            {...path.finish}
            onRating={() =>
              setTimeout(() => {
                handleClose(notificationId, false)
              }, 1500)
            }
          />
        ),
      })
      endPath()
    } else {
      handleClose(notificationId)
    }
  }

  const LearningStep = (notificationId: string) => {
    return <LearningPathSteps onFinish={() => handleFinish(notificationId)} />
  }

  // create a notification when a path is initialized
  useEffect(() => {
    if (path && !path.notificationId) {
      const id = generateId?.()

      if (!id) {
        return
      }

      addNotification?.({
        title: path.label,
        text: step?.description,
        onClose: () => handleClose(id),
        layout: "empty",
        id,
        children: LearningStep(id),
        className: "flex flex-col",
      })
      updatePath({
        notificationId: id,
      })
    }
  }, [path])

  // update an existing notification when the step changes
  useEffect(() => {
    if (path && path.notificationId && step) {
      updateNotification?.(path.notificationId, {
        text: step?.description,
        children: LearningStep(path.notificationId),
      })
    }
  }, [step])
}
