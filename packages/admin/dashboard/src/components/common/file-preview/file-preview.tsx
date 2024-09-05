import { ArrowDownTray, Spinner } from "@medusajs/icons"
import { IconButton, Text } from "@medusajs/ui"
import { ActionGroup, ActionMenu } from "../action-menu"

export const FilePreview = ({
  filename,
  url,
  loading,
  activity,
  actions,
  hideThumbnail,
}: {
  filename: string
  url?: string
  loading?: boolean
  activity?: string
  actions?: ActionGroup[]
  hideThumbnail?: boolean
}) => {
  return (
    <div className="shadow-elevation-card-rest bg-ui-bg-component transition-fg rounded-md px-3 py-2">
      <div className="flex flex-row items-center justify-between gap-2">
        <div className="flex flex-row items-center gap-3">
          {!hideThumbnail && <FileThumbnail />}
          <div className="flex flex-col justify-center">
            <Text
              size="small"
              leading="compact"
              className="truncate max-w-[260px]"
            >
              {filename}
            </Text>

            {loading && !!activity && (
              <Text
                leading="compact"
                size="xsmall"
                className="text-ui-fg-interactive"
              >
                {activity}
              </Text>
            )}
          </div>
        </div>

        {loading && <Spinner className="animate-spin" />}
        {!loading && actions && <ActionMenu groups={actions} />}
        {!loading && url && (
          <IconButton variant="transparent" asChild>
            <a href={url} download={filename ?? `${Date.now()}`}>
              <ArrowDownTray />
            </a>
          </IconButton>
        )}
      </div>
    </div>
  )
}

const FileThumbnail = () => {
  return (
    <svg
      width="24"
      height="32"
      viewBox="0 0 24 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20 31.75H4C1.92893 31.75 0.25 30.0711 0.25 28V4C0.25 1.92893 1.92893 0.25 4 0.25H15.9431C16.9377 0.25 17.8915 0.645088 18.5948 1.34835L22.6516 5.4052C23.3549 6.10847 23.75 7.06229 23.75 8.05685V28C23.75 30.0711 22.0711 31.75 20 31.75Z"
        fill="url(#paint0_linear_6594_388107)"
        stroke="url(#paint1_linear_6594_388107)"
        stroke-width="0.5"
      />
      <path
        opacity="0.4"
        d="M17.7857 12.8125V13.5357H10.3393V10.9643H15.9375C16.9569 10.9643 17.7857 11.7931 17.7857 12.8125ZM6.21429 16.9107V15.0893H8.78571V16.9107H6.21429ZM10.3393 16.9107V15.0893H17.7857V16.9107H10.3393ZM15.9375 21.0357H10.3393V18.4643H17.7857V19.1875C17.7857 20.2069 16.9569 21.0357 15.9375 21.0357ZM6.21429 19.1875V18.4643H8.78571V21.0357H8.0625C7.0431 21.0357 6.21429 20.2069 6.21429 19.1875ZM8.0625 10.9643H8.78571V13.5357H6.21429V12.8125C6.21429 11.7931 7.0431 10.9643 8.0625 10.9643Z"
        fill="url(#paint2_linear_6594_388107)"
        stroke="url(#paint3_linear_6594_388107)"
        stroke-width="0.428571"
      />
      <defs>
        <linearGradient
          id="paint0_linear_6594_388107"
          x1="12"
          y1="0"
          x2="12"
          y2="32"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#F4F4F5" />
          <stop offset="1" stop-color="#E4E4E7" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_6594_388107"
          x1="12"
          y1="0"
          x2="12"
          y2="32"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#E4E4E7" />
          <stop offset="1" stop-color="#D4D4D8" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_6594_388107"
          x1="12"
          y1="10.75"
          x2="12"
          y2="21.25"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#52525B" />
          <stop offset="1" stop-color="#A1A1AA" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_6594_388107"
          x1="12"
          y1="10.75"
          x2="12"
          y2="21.25"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#18181B" />
          <stop offset="1" stop-color="#52525B" />
        </linearGradient>
      </defs>
    </svg>
  )
}
