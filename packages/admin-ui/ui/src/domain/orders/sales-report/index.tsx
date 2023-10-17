import { Container } from "@medusajs/ui"
import { useEffect, useState } from "react"
import moment from "moment"
import { DatePicker } from "@medusajs/ui"
import { MEDUSA_BACKEND_URL_NOSLASH } from "../../../constants/medusa-backend-url"

const SalesReportWidget = () => {

  // Init dates

  let now = new Date

  const [startDate, setStartDate] = useState(new Date(now.getFullYear(), now.getMonth(), 1))
  const [endDate, setEndDate] = useState(now)
  const [url, setUrl] = useState('')

  // Date select

  const DateSelect = ({selectedDate, setDate, filterTitle}) => {
          
      return(
          <DatePicker
            defaultValue={selectedDate}
            onChange={setDate}
          />
      )

  }

  // Get report

  const getUrl = () => {

      let reportUrl = MEDUSA_BACKEND_URL_NOSLASH+'/sales-report/'

      reportUrl += '?start_date='+moment(startDate).format("YYYY-MM-DD")+'T00:00:00'

      reportUrl += '&end_date='+moment(endDate).format("YYYY-MM-DD")+'T23:59:59'
      
      return reportUrl;

  }

  useEffect(()=>{
    setUrl(getUrl());
  },[startDate, endDate])

  return (
    <Container className="py-4">
        <h3 className="inter-large-semibold mb-2">Sales report</h3>
        <div className="flex flex-row items-center justify-start gap-4">
            <div className="basis-2/5">
              <DateSelect
                  selectedDate={startDate}
                  setDate={setStartDate}
                  filterTitle="From date"
              />
            </div>
            <div className="basis-2/5">
              <DateSelect
                  selectedDate={endDate}
                  setDate={setEndDate}
                  filterTitle="To date"
              />
            </div>
            <div className="basis-1/5">
             <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary py-2"
              >
                  &darr; Get report
              </a>
            </div>
        </div>
    </Container>
  )
}

export default SalesReportWidget
