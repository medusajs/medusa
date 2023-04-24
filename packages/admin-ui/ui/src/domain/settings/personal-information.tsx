import clsx from "clsx"
import React, { useContext, useState } from "react"
import { useForm } from "react-hook-form"
import Avatar from "../../components/atoms/avatar"
import Spinner from "../../components/atoms/spinner"
import BreadCrumb from "../../components/molecules/breadcrumb"
import Input from "../../components/molecules/input"
import BodyCard from "../../components/organisms/body-card"
import FileUploadModal from "../../components/organisms/file-upload-modal"
import TwoSplitPane from "../../components/templates/two-split-pane"
import { AccountContext } from "../../context/account"
import useNotification from "../../hooks/use-notification"
import { getErrorMessage } from "../../utils/error-messages"

const PersonalInformation = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [isLoadingProfilePicture, setIsLoadingProfilePicture] = useState(false)
  const { register, setValue, handleSubmit, reset } = useForm()
  const { handleUpdateUser, ...user } = useContext(AccountContext)
  const notification = useNotification()

  register("first_name")
  register("last_name")

  const submit = (data) => {
    handleUpdateUser(user.id, data)
      .then(() => {
        notification("Success", "Successfully updated user", "success")
      })
      .catch((err) => {
        notification("Error", getErrorMessage(err), "error")
      })
  }

  const events = [
    {
      label: "Save",
      onClick: handleSubmit(submit),
    },
  ]

  const handleFileUpload = async (files) => {
    setModalIsOpen(false)
    setIsLoadingProfilePicture(true)
    // TODO upload files
    await new Promise((r) => setTimeout(r, 2000))
    setIsLoadingProfilePicture(false)
  }

  return (
    <div>
      <TwoSplitPane>
        <BodyCard
          title="Personal Information"
          subtitle="Manage your personal profile"
          events={events}
          className={"h-auto max-h-full"}
        >
          <div>
            <span className="inter-base-semibold">Picture</span>
            <div
              onClick={() => setModalIsOpen(true)}
              className="w-28 h-28 p-2 mt-2 flex items-center justify-center rounded-rounded hover:bg-grey-5 cursor-pointer"
            >
              {isLoadingProfilePicture && (
                <div className="z-10 absolute justify-center items-center">
                  <Spinner variant="secondary" />
                </div>
              )}
              <div
                className={clsx("w-full h-full transition-opacity", {
                  "opacity-50": isLoadingProfilePicture,
                })}
              >
                <Avatar
                  color="bg-teal-40"
                  user={user}
                  font="inter-3xlarge-semibold"
                />
              </div>
            </div>
          </div>
          <div className="mt-6">
            <span className="inter-base-semibold">General</span>
            <div className="flex mt-4">
              <Input
                label="First name"
                name="first_name"
                placeholder="Lebron"
                defaultValue={user.first_name}
                onChange={(e) => setValue("first_name", e.target.value)}
                className="mr-4"
              />
              <Input
                label="Last name"
                name="last_name"
                placeholder="James"
                defaultValue={user.last_name}
                onChange={(e) => setValue("last_name", e.target.value)}
              />
            </div>
            <Input label="Email" value={user.email} disabled className="mt-6" />
          </div>
          {modalIsOpen && (
            <FileUploadModal
              setFiles={handleFileUpload}
              filetypes={["image/png", "image/jpeg"]}
              handleClose={() => setModalIsOpen(false)}
            />
          )}
        </BodyCard>
      </TwoSplitPane>
    </div>
  )
}

export default PersonalInformation
