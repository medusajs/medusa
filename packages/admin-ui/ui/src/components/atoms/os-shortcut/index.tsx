type OSShortcutProps = {
  winModifiers: string | string[]
  macModifiers: string | string[]
  keys: string[] | string
}

const OSShortcut = ({ winModifiers, macModifiers, keys }: OSShortcutProps) => {
  const isMac =
    typeof window !== "undefined" &&
    navigator?.platform?.toUpperCase().indexOf("MAC") >= 0
      ? true
      : false

  let modifiers: string

  if (isMac) {
    if (Array.isArray(macModifiers)) {
      modifiers = macModifiers.join("")
    } else {
      modifiers = macModifiers
    }
  } else {
    if (Array.isArray(winModifiers)) {
      modifiers = winModifiers.join(" + ")
    } else {
      modifiers = winModifiers
    }
  }

  let input: string

  if (Array.isArray(keys)) {
    input = keys.join(" + ")
  } else {
    input = keys
  }

  return (
    <div className="text-grey-40 flex items-center">
      <p className="inter-base-semibold m-0">
        <span className="inter-base-semibold">{modifiers} </span>
        {input}
      </p>
    </div>
  )
}

export default OSShortcut
