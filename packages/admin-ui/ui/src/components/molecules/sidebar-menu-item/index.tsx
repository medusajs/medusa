import React, { useCallback } from "react"
import Collapsible from "react-collapsible"
import { NavLink } from "react-router-dom"

type SidebarMenuSubitemProps = {
  pageLink: string
  text: string
  partiallyActive?: boolean
}

type SidebarMenuItemProps = {
  pageLink: string
  text: string
  // eslint-disable-next-line no-undef
  icon: JSX.Element
  triggerHandler: () => any
  subItems?: SidebarMenuSubitemProps[]
  end?: boolean
}

const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({
  pageLink,
  icon,
  text,
  triggerHandler,
  subItems = [],
  end,
}: SidebarMenuItemProps) => {
  const styles =
    "py-1.5 px-3 my-0.5 rounded-base flex text-grey-90 hover:bg-grey-10 items-center"
  const activeStyles = "bg-grey-10 text-violet-60"
  const classNameFn = useCallback(
    ({ isActive }) => (isActive ? `${styles} ${activeStyles}` : styles),
    []
  )

  return (
    <Collapsible
      transitionTime={150}
      transitionCloseTime={150}
      {...triggerHandler()}
      trigger={
        <NavLink className={classNameFn} end={end} to={pageLink}>
          <span className="items-start">{icon}</span>
          <span className="ml-3">{text}</span>
        </NavLink>
      }
    >
      {subItems?.length > 0 &&
        subItems.map(({ pageLink, text }) => (
          <SubItem pageLink={pageLink} text={text} />
        ))}
    </Collapsible>
  )
}

const SubItem = ({
  pageLink,
  text,
  partiallyActive, // TODO: do we need partially active?
}: SidebarMenuSubitemProps) => {
  const styles = "py-0.5 px-1 my-0.5 rounded-base flex hover:bg-grey-10"
  const activeStyles = "bg-grey-10 font-semibold"
  const classNameFn = useCallback(
    ({ isActive }) => (isActive ? `${styles} ${activeStyles}` : styles),
    []
  )

  return (
    <NavLink className={classNameFn} to={pageLink}>
      <span className="text-grey-90 text-small ml-3">{text}</span>
    </NavLink>
  )
}

//TODO: What is this about?
// SidebarMenuItem.SubItem = SubItem

export default SidebarMenuItem
