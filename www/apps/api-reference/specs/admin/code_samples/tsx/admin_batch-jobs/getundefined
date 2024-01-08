import React from "react"
import { useAdminBatchJobs } from "medusa-react"

const BatchJobs = () => {
  const {
    batch_jobs,
    limit,
    offset,
    count,
    isLoading
  } = useAdminBatchJobs()

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      {batch_jobs?.length && (
        <ul>
          {batch_jobs.map((batchJob) => (
            <li key={batchJob.id}>
              {batchJob.id}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default BatchJobs
