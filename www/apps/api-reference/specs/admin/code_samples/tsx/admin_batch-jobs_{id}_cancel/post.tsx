import React from "react"
import { useAdminCancelBatchJob } from "medusa-react"

type Props = {
  batchJobId: string
}

const BatchJob = ({ batchJobId }: Props) => {
  const cancelBatchJob = useAdminCancelBatchJob(batchJobId)
  // ...

  const handleCancel = () => {
    cancelBatchJob.mutate(undefined, {
      onSuccess: ({ batch_job }) => {
        console.log(batch_job)
      }
    })
  }

  // ...
}

export default BatchJob
