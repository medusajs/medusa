import * as React from "react"

/**
 * Anatomy
 *
 * - Root
 *   - Dropzone
 *     - Label
 *     - Description
 *     - Trigger
 *   - List
 *     - Item
 *       - Preview
 *       - Name
 *       - Size
 *       - Remove
 *
 * @example
 *
 * ```tsx
 * <FileUpload>
 *   <FileUpload.Dropzone>
 *     <div>
 *       <DownloadIcon />
 *       <FileUpload.Label>
 *         Import Files
 *       </FileUpload.Label>
 *     </div>
 *     <FileUpload.Description>
 *       Drag and drop files here or{" "}
 *       <FileUpload.Trigger>
 *         click to browse
 *       </FileUpload.Trigger>
 *     </FileUpload.Description>
 *   </FileUpload.Dropzone>
 *   <FileUpload.List>
 *     {(items) => {
 *       return items.map((item) => {
 *         return (
 *           <FileUpload.Item key={item.id}>
 *             <FileUpload.ItemPreview />
 *             <FileUpload.ItemName />
 *             <FileUpload.ItemSize />
 *             <FileUpload.ItemRemove />
 *           </FileUpload.Item>
 *         )
 *       })
 *     }}
 *   </FileUpload.List>
 * </FileUpload>
 * ```
 */

interface FileUploadProps
  extends Pick<
    React.ComponentPropsWithoutRef<"input">,
    | "className"
    | "style"
    | "accept"
    | "name"
    | "id"
    | "disabled"
    | "required"
    | "children"
  > {
  files?: File[]
  onFilesChange?: (files: File[]) => void
  defaultFiles?: File[]
  maxFiles?: number
  maxFileSize?: number
  minFileSize?: number
}

const Root = () => {
  return <input type="file" />
}

const Dropzone = () => {}

const Trigger = () => {}

const Label = () => {}

const Description = () => {}

const List = () => {}

const Item = () => {}

const ItemPreview = () => {}

const ItemName = () => {}

const ItemSize = () => {}

const ItemRemove = () => {}

const ItemDownload = () => {}

export const FileUpload = Object.assign(Root, {
  Dropzone,
  Trigger,
  Label,
  Description,
  List,
  Item,
  ItemPreview,
  ItemName,
  ItemSize,
  ItemRemove,
  ItemDownload,
})
