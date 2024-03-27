import { DotsSix } from "@medusajs/icons"

export const CategoryTreeDragHandle = () => {
  return (
    <div className="text-ui-fg-subtle group-data-[disabled=true]:text-ui-fg-muted flex h-7 w-7 cursor-grab items-center justify-center active:cursor-grabbing group-data-[disabled=true]:cursor-not-allowed">
      <DotsSix />
    </div>
  )
}
