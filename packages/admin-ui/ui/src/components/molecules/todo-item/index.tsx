import clsx from "clsx"
import { FC } from "react"
import { NavigateFunction, useNavigate } from "react-router-dom"
import { TodoItem, TodoType } from "../../../hooks/admin/todo/queries"
import Button from "../../fundamentals/button"
import CheckIcon from "../../fundamentals/icons/check-icon"

const getAction = ({
  type,
  vendor_id,
  navigate,
}: {
  type: TodoType
  vendor_id: string
  navigate: NavigateFunction
}): {
  label?: string
  onClick: () => void
} | null => {
  const actions = {
    [TodoType.CREATE_FIRST_PRODUCT]: {
      label: "Add product",
      onClick: () => navigate(`/vendor/${vendor_id}/products`),
    },
    [TodoType.SETUP_BANK_ACCOUNT]: {
      label: "Finish setup",
      onClick: () => navigate(`/vendor/${vendor_id}/payouts/manage/onboarding`),
    },
    [TodoType.SETUP_HOMEPAGE]: {
      label: "Finish setup",
      onClick: () => navigate(`/admin/content/pages`),
    },
    [TodoType.SETUP_SITE_SETTINGS]: {
      label: "Finish setup",
      onClick: () => navigate(`/admin/settings/site-details`),
    },
    [TodoType.SETUP_SHIPPING_OPTIONS]: {
      label: "Finish setup",
      onClick: () => navigate(`/vendor/${vendor_id}/settings/regions`),
    },
    [TodoType.SETUP_VENDOR_DETAILS]: {
      label: "Finish setup",
      onClick: () => navigate(`/vendor/${vendor_id}/settings/vendor-details`),
    },
  }

  return actions[type] ?? null
}

const useTodoAction = ({
  type,
  vendor_id,
}: {
  type: TodoType
  vendor_id: string
}) => {
  const navigate = useNavigate()

  return getAction({
    type,
    vendor_id,
    navigate,
  })
}

const Todo: FC<{ todo: TodoItem }> = ({ todo }: { todo: TodoItem }) => {
  const action = useTodoAction({
    type: todo.type,
    vendor_id: todo.vendor_id,
  })

  return (
    <div className="p-6 border-t border-t-grey-20">
      <div className={clsx("flex items-center gap-4")}>
        <div>
          <div
            className={clsx(
              "flex flex-shrink-0 flex-grow-0 items-center justify-center w-6 h-6 rounded-base text-emerald-500",
              { "bg-grey-10": !todo.completed_at }
            )}
          >
            {!!todo.completed_at && <CheckIcon className="w-5 h-5" />}
          </div>
        </div>
        <div>
          <h4 className="inter-base-semibold text-grey-90 leading-5">
            {todo.title}
          </h4>
          <div className="inter-base-regular leading-5 text-grey-50 mt-1">
            {todo.description}
          </div>
        </div>
        <div className="flex-1" />
        <div className="px-2 flex">
          {!todo.completed_at && !!action && (
            <Button variant="secondary" size="small" onClick={action.onClick}>
              {action.label}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Todo
