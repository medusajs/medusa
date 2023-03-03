import React, { useCallback } from "react"
import Collapsible from "react-collapsible"
import { NavLink } from "react-router-dom"

type SidebarMenuSubitemProps = {
  pageLink: string
  text: string
}

type SidebarMenuItemProps = {
  pageLink: string
  text: string
  icon: JSX.Element
  triggerHandler: () => any
  subItems?: SidebarMenuSubitemProps[]
}

const SidebarMenuItem: React.FC<SidebarMenuItemProps> & {
  SubItem: (props: SidebarMenuSubitemProps) => JSX.Element
} = ({
  pageLink,
  icon,
  text,
  triggerHandler,
  subItems = [],
}: SidebarMenuItemProps) => {
  const styles =
    "group py-1.5 my-0.5 rounded-rounded flex text-grey-50 hover:bg-grey-10 items-center px-2"
  const activeStyles = "bg-grey-10 is-active"
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
        <NavLink className={classNameFn} to={pageLink}>
          <span className="items-start">{icon}</span>
          <span className="ml-3 group-[.is-active]:text-grey-90">{text}</span>
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

const SubItem = ({ pageLink, text }: SidebarMenuSubitemProps) => {
  const styles = "py-0.5 px-1 my-0.5 rounded-base flex hover:bg-grey-10"
  const activeStyles = "bg-grey-10 font-semibold"
  const classNameFn = useCallback(
    ({ isActive }) => (isActive ? `${styles} ${activeStyles}` : styles),
    []
  )

  return (
    <NavLink className={classNameFn} to={pageLink}>
      <span className="ml-3 text-grey-90 text-small">{text}</span>
    </NavLink>
  )
}

SidebarMenuItem.SubItem = SubItem

export default SidebarMenuItem
