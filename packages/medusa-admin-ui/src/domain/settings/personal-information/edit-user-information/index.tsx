import { User } from "@medusajs/medusa"
import React, { useMemo } from "react"
import Avatar from "../../../../components/atoms/avatar"
import Button from "../../../../components/fundamentals/button"
import useToggleState from "../../../../hooks/use-toggle-state"
import EditUserInformationModal from "./edit-user-information-modal"

type Props = {
  user?: Omit<User, "password_hash">
}

const EditUserInformation = ({ user }: Props) => {
  const { state, toggle, close } = useToggleState()

  const name = useMemo(() => {
    const names = [user?.first_name, user?.last_name]

    return names.filter((n) => n).join(" ")
  }, [user])

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-base">
          <div className="w-18 aspect-square rounded-full border border-grey-20 flex items-center justify-center box-border">
            {user ? (
              <div className="w-16 aspect-square">
                <Avatar
                  user={{ ...user }}
                  color="bg-teal-40"
                  font="inter-2xlarge-semibold"
                />
              </div>
            ) : (
              <div className="w-16 aspect-square animate-pulse bg-teal-40 rounded-full" />
            )}
          </div>
          <div className="flex flex-col">
            {!!name ? (
              <>
                <p className="inter-base-semibold">{name}</p>
                <p className="inter-base-regular text-grey-50">{user?.email}</p>
              </>
            ) : (
              <p className="inter-base-semibold">{user?.email}</p>
            )}
          </div>
        </div>
        <Button
          variant="secondary"
          size="small"
          disabled={!user}
          onClick={toggle}
        >
          Edit information
        </Button>
      </div>
      {user && (
        <EditUserInformationModal open={state} onClose={close} user={user} />
      )}
    </>
  )
}

export default EditUserInformation
