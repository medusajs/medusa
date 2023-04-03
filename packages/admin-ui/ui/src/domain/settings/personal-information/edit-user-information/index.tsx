import { User } from "@medusajs/medusa"
import { useMemo } from "react"
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
        <div className="gap-x-base flex items-center">
          <div className="w-18 border-grey-20 box-border flex aspect-square items-center justify-center rounded-full border">
            {user ? (
              <div className="aspect-square w-16">
                <Avatar
                  user={{ ...user }}
                  color="bg-teal-40"
                  font="inter-2xlarge-semibold"
                />
              </div>
            ) : (
              <div className="bg-teal-40 aspect-square w-16 animate-pulse rounded-full" />
            )}
          </div>
          <div className="flex flex-col">
            {name ? (
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
