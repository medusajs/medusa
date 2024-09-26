export function appendLinkableFields(fields: string = "", linkable: (string | string[])[]) {
  const linkableFields = linkable.flatMap((link) =>
    {
      return typeof link === "string" ? [`+${link}.*`] : link.map((l) => `+${l}.*`)
    }
  )

  return [fields, ...linkableFields].join(",")
}
