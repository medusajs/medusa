import { FC, useCallback, useState } from "react"
import clsx from "clsx"
import {
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  DeviceTabletIcon,
} from "@heroicons/react/24/outline"
import Button from "../../../../components/fundamentals/button"
import { usePostContext } from "../../context"
import { useLivePreviewClick } from "../../helpers/use-live-preview-click"
import { useNavigate } from "react-router-dom"
import { useActivePostSectionChange } from "../../helpers/use-active-post-section-change"
import { updateLivePreviewActiveSection } from "../../helpers/update-live-preview-active-section"
import ResizeHorizontalSquareIcon from "../../../../components/fundamentals/icons/resize-horizontal-square"
import { useActivePostSectionId } from "../../helpers/use-active-post-section-id"

interface PostLivePreviewProps {}

export enum Device {
  PHONE = "phone",
  TABLET = "tablet",
  LAPTOP = "laptop",
  DESKTOP = "desktop",
  FULL_WIDTH = "full-width",
}

export const PostLivePreview: FC<PostLivePreviewProps> = () => {
  const navigate = useNavigate()
  const {
    post,
    previewURL,
    liveURL,
    liveBaseURL,
    valueOverrides,
    featureFlags,
    setIsSettingsOpen,
    isSettingsOpen,
    setIsEditorOpen,
    setConfirmLeave,
    shouldConfirmLeaveSection,
  } = usePostContext()
  const [activeDevice, setActiveDevice] = useState<Device>(Device.FULL_WIDTH)
  const activeSectionId = useActivePostSectionId()
  const customHandle =
    featureFlags.handle === "readonly" &&
    typeof valueOverrides?.handle !== "undefined"
      ? valueOverrides?.handle
      : undefined

  const devices = [
    { device: Device.PHONE, icon: DevicePhoneMobileIcon },
    { device: Device.TABLET, icon: DeviceTabletIcon },
    { device: Device.DESKTOP, icon: ComputerDesktopIcon },
    { device: Device.FULL_WIDTH, icon: ResizeHorizontalSquareIcon },
  ]
  const isPhone = activeDevice === Device.PHONE
  const isTablet = activeDevice === Device.TABLET
  const isLaptop = activeDevice === Device.LAPTOP
  const isDesktop = activeDevice === Device.DESKTOP
  const isFullWidth = activeDevice === Device.FULL_WIDTH || !activeDevice

  const handleUpdateHandleClick = () => {
    setIsSettingsOpen(true)

    setTimeout(() => {
      const handleInput = document.querySelector(
        "input[name='handle']"
      ) as HTMLInputElement

      handleInput.focus()
    }, 50)
  }

  const handleLivePreviewClick = useCallback(
    (postSectionId) => {
      const navigateTo = `/admin/editor/${post.type}/${post.id}/sections/${postSectionId}`

      // If the active section is the same as the clicked section,
      // return early to avoid remounting the component and losing changes.
      if (activeSectionId === postSectionId) return

      // If there are unsaved changes, prompt the user to confirm leaving the section.
      if (shouldConfirmLeaveSection)
        return setConfirmLeave({
          from: "section",
          context: "section",
          navigateTo,
        })

      navigate(navigateTo)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [post, activeSectionId, shouldConfirmLeaveSection]
  )

  useLivePreviewClick(handleLivePreviewClick)

  const handleActivePostSectionChange = (postSectionId) => {
    updateLivePreviewActiveSection(postSectionId)
    setIsEditorOpen(true)
  }

  useActivePostSectionChange(handleActivePostSectionChange)

  return (
    <>
      <div className="h-full flex flex-col">
        <div
          className={clsx(
            "flex-1 min-w-0 min-h-0 h-full w-full overflow-x-auto bg-grey-40",
            {
              "p-4 small:p-6": !isFullWidth,
            }
          )}
        >
          <div
            className={clsx("mx-auto h-full flex flex-col", {
              "w-[375px]": isPhone,
              "w-[768px]": isTablet,
              "w-[1280px]": isLaptop,
              "w-[1440px]": isDesktop,
              "w-full": isFullWidth,
              "rounded-rounded overflow-hidden": !isFullWidth,
            })}
          >
            <div className="grow-0 flex items-center justify-start gap-2 p-2 bg-grey-10">
              <div className="grow-0 flex items-center justify-start gap-1.5 px-1">
                {Array.from({ length: 3 }, (_, i) => (
                  <div key={i} className="w-3 h-3 rounded-full bg-gray-300" />
                ))}
              </div>

              <div className="text-small text-grey-40 bg-grey-20 h-7 leading-7 px-2.5 rounded-rounded flex-1 min-w-0">
                <div className="w-full truncate">
                  <span className="font-mono">
                    {!!liveURL && (
                      <>
                        {liveBaseURL}
                        {`/`}
                        {featureFlags.settings && !isSettingsOpen && (
                          <button
                            onClick={handleUpdateHandleClick}
                            className="underline"
                          >
                            {customHandle || post.handle}
                          </button>
                        )}
                        {(!featureFlags.settings || isSettingsOpen) &&
                          (customHandle || post.handle)}
                      </>
                    )}

                    {!liveURL && (
                      <>
                        {!isSettingsOpen && (
                          <button
                            onClick={handleUpdateHandleClick}
                            className="underline"
                          >
                            Set a handle
                          </button>
                        )}
                        {isSettingsOpen && "Set a handle"}
                        {` `}
                        to see the live URL
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1 min-h-0 bg-white overflow-auto">
              <iframe
                id="preview-window"
                className={clsx("w-full h-full")}
                // NOTE: If we are deep-linked to a section, we want to target the active section when the page loads.
                // We need the `#` outside the ternary to avoid a full page refresh when exiting the section edit view.
                src={`${previewURL}#${
                  activeSectionId ? `${activeSectionId}__preview` : ""
                }`}
              />
            </div>
          </div>
        </div>

        <div className="bg-white border-t border-grey-20 p-3 flex items-center justify-center gap-2 relative">
          {devices.map(({ device, icon: Icon }) => (
            <Button
              key={device}
              size="small"
              variant="secondary"
              className={clsx("p-0 w-10 h-10", {
                "!text-violet-60": device === activeDevice,
              })}
              onClick={() => setActiveDevice(device)}
            >
              <Icon className="w-6 h-6" />
            </Button>
          ))}
        </div>
      </div>
    </>
  )
}
