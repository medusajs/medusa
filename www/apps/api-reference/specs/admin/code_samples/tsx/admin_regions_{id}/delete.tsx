import React from "react"
import { useAdminDeleteRegion } from "medusa-react"

type Props = {
  regionId: string
}

const Region = ({
  regionId
}: Props) => {
  const deleteRegion = useAdminDeleteRegion(regionId)
  // ...

  const handleDelete = () => {
    deleteRegion.mutate(void 0, {
      onSuccess: ({ id, object, deleted }) => {
        console.log(id)
      }
    })
  }

  // ...
}

export default Region
