import React, { useMemo } from "react"
import { getLearningPaths } from "../../../utils/learning-paths"
import LearningPath from ".."

type LearningPathListProps = {
  ignore?: string[]
} & React.AllHTMLAttributes<HTMLDivElement>

const LearningPathList: React.FC<LearningPathListProps> = ({ ignore = [] }) => {
  const paths = useMemo(() => {
    const paths = getLearningPaths()
    ignore.forEach((pathName) => {
      const pathIndex = paths.findIndex((path) => path.name === pathName)
      if (pathIndex !== -1) {
        paths.splice(pathIndex, 1)
      }
    })

    return paths
  }, [ignore])

  return (
    <div className="flex flex-col flex-wrap gap-2 mt-1.5">
      {paths.map((path, index) => (
        <LearningPath
          pathName={path.name}
          key={index}
          className="!mt-0 !mb-0"
        />
      ))}
    </div>
  )
}

export default LearningPathList
