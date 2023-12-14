import React, { useMemo } from "react"
import Heading from "@theme/Heading"
import { GlossaryType, getGlossary } from "../../utils/glossary"
import Link from "@docusaurus/Link"

type GlossaryProps = React.HTMLAttributes<HTMLDivElement>

type GroupedGlossary = {
  [letter: string]: GlossaryType[]
}

const Glossary: React.FC<GlossaryProps> = (props) => {
  const groupedGlossary: GroupedGlossary = useMemo(() => {
    const glossary = getGlossary()
    glossary.sort((a, b) => {
      return a.title.localeCompare(b.title)
    })
    const grouped: GroupedGlossary = {}
    glossary.forEach((glossaryItem) => {
      const firstChar = glossaryItem.title.charAt(0).toLowerCase()
      grouped[firstChar] = [...(grouped[firstChar] || []), glossaryItem]
    })

    return grouped
  }, [])

  return (
    <div {...props}>
      {Object.entries(groupedGlossary).map(([letter, glossary], index) => (
        <React.Fragment key={index}>
          <Heading id={letter.toLowerCase()} as="h2">
            {letter.toUpperCase()}
          </Heading>
          <ul>
            {glossary.map((glossaryItem, index) => (
              <li key={index}>
                <Link to={glossaryItem.referenceLink}>
                  {glossaryItem.title}
                </Link>
                : {glossaryItem.content}
              </li>
            ))}
          </ul>
        </React.Fragment>
      ))}
    </div>
  )
}

export default Glossary
