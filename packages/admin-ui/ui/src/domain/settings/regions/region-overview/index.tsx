import { useAdminRegions } from "medusa-react"
import React, { useCallback, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import Fade from "../../../../components/atoms/fade-wrapper"
import Button from "../../../../components/fundamentals/button"
import PlusIcon from "../../../../components/fundamentals/icons/plus-icon"
import RadioGroup from "../../../../components/organisms/radio-group"
import Section from "../../../../components/organisms/section"
import useToggleState from "../../../../hooks/use-toggle-state"
import { useAnalytics } from "../../../../providers/analytics-provider"
import NewRegion from "../new"
import RegionCard from "./region-card"

type Props = {
  id?: string
}

const RegionOverview = ({ id }: Props) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { trackRegions } = useAnalytics()
  const { regions } = useAdminRegions(undefined, {
    onSuccess: ({ regions, count }) => {
      trackRegions({ regions: regions.map((r) => r.name), count })
    },
  })
  const [selectedRegion, setSelectedRegion] = React.useState<
    string | undefined
  >(id)

  const handleChange = useCallback(
    (id: string) => {
      if (id !== selectedRegion) {
        setSelectedRegion(id)
        navigate(`/a/settings/regions/${id}`, {
          replace: true,
        })
      }
    },
    [navigate, selectedRegion]
  )

  useEffect(() => {
    if (id) {
      handleChange(id)
    }

    if (!id && regions && regions.length > 0) {
      handleChange(regions[0].id)
    }
  }, [handleChange, id, regions])

  const { state, toggle, close } = useToggleState()

  return (
    <>
      <Section
        title={t("region-overview-regions", "Regions")}
        customActions={
          <div>
            <Button
              variant="ghost"
              size="small"
              className="h-xlarge w-xlarge"
              onClick={toggle}
            >
              <PlusIcon />
            </Button>
          </div>
        }
        className="h-full"
      >
        <p className="text-base-regular text-grey-50 mt-2xsmall">
          {t(
            "region-overview-manage-the-markets-that-you-will-operate-within",
            "Manage the markets that you will operate within."
          )}
        </p>
        <div className="mt-large">
          <RadioGroup.Root value={selectedRegion} onValueChange={handleChange}>
            {regions?.map((region) => (
              <RegionCard key={region.id} region={region} />
            ))}
          </RadioGroup.Root>
        </div>
      </Section>
      <Fade isVisible={state} isFullScreen={true}>
        <NewRegion onClose={close} />
      </Fade>
    </>
  )
}

export default RegionOverview
