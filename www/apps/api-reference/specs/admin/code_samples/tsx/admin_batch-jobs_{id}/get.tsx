import React from "react"
import { useAdminBatchJob } from "medusa-react"

type Props = {
  batchJobId: string
}

const BatchJob = ({ batchJobId }: Props) => {
  const { batch_job, isLoading } = useAdminBatchJob(batchJobId)

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {batch_job && <span>{batch_job.created_by}</span>}
    </div>
  )
}

export default BatchJob
