import { CardProps } from "../../components/Card"
import { medusaSuggestions } from "./suggestions"

const PUNCTIONATION = /[.,?;!]/g

type UseSuggestionsProps = {
  keywords: string | string[]
}

export const useMedusaSuggestions = ({ keywords }: UseSuggestionsProps) => {
  if (!keywords.length) {
    return null
  }

  const keywordsArray = Array.isArray(keywords)
    ? keywords.map(formatWord)
    : keywords.split(" ").map(formatWord)

  let matchedSuggestion: CardProps | null = null

  keywordsArray.some((word) => {
    if (medusaSuggestions.has(word)) {
      matchedSuggestion = medusaSuggestions.get(word) || null
    }

    return matchedSuggestion !== null
  })

  return matchedSuggestion as CardProps | null
}

const formatWord = (word: string) => {
  return word.toLowerCase().trim().replace(PUNCTIONATION, "")
}
