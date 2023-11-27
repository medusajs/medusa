export function findPrevSibling(
  element: HTMLElement,
  selector: string
): HTMLElement | null {
  let prevElement = element.previousElementSibling
  while (prevElement !== null) {
    if (prevElement.matches(selector)) {
      return prevElement as HTMLElement
    }
    prevElement = prevElement.previousElementSibling
  }

  return null
}

export function findNextSibling(
  element: HTMLElement,
  selector: string
): HTMLElement | null {
  let nextElement = element.nextElementSibling
  while (nextElement !== null) {
    if (nextElement.matches(selector)) {
      return nextElement as HTMLElement
    }
    nextElement = nextElement.nextElementSibling
  }

  return null
}
