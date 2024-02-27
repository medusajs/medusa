export function getComponentName(name: string) {
  return name
    .replace(/[-_]+/g, " ")
    .replace(/[^\w\s]/g, "")
    .replace(
      /\s+(.)(\w*)/g,
      (_$1, $2, $3) => `${$2.toUpperCase() + $3.toLowerCase()}`
    )
    .replace(/\w/, (s) => s.toUpperCase())
}

function getFileName(name: string) {
  return `${name.replace("$", "").replace("/", "-")}.tsx`
}

function getTestName(name: string) {
  return `${name.replace("$", "").replace("/", "-")}.spec.tsx`
}

const FIXED_FRAMES = ["Flags", "Brands"]

function isFixedIcon(name: string, frame_name: string) {
  if (FIXED_FRAMES.includes(frame_name)) {
    if (frame_name === "Brands" && name.includes("-ex")) {
      return false
    }

    return true
  }

  return false
}

export function getIconData(name: string, frame_name: string) {
  const componentName = getComponentName(name)
  const fileName = getFileName(name)
  const testName = getTestName(name)

  const fixed = isFixedIcon(name, frame_name)

  return {
    componentName,
    testName,
    fileName,
    fixed,
  }
}
