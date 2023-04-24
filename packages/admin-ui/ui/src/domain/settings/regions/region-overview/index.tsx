import { useAdminRegions, useAdminStore } from "medusa-react"
import React, { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Fade from "../../../../components/atoms/fade-wrapper"
import Button from "../../../../components/fundamentals/button"
import PlusIcon from "../../../../components/fundamentals/icons/plus-icon"
import RadioGroup from "../../../../components/organisms/radio-group"
import Section from "../../../../components/organisms/section"
import { useStorePermissions } from "../../../../hooks/use-store-permissions"
import useToggleState from "../../../../hooks/use-toggle-state"
import { useBasePath } from "../../../../utils/routePathing"
import NewRegion from "../new"
import RegionCard from "./region-card"

type Props = {
  id?: string
}

const RegionOverview = ({ id }) => {
  const { regions, isLoading } = useAdminRegions()
  const basePath = useBasePath()
  const { canCreateRegions } = useStorePermissions()

  const navigate = useNavigate()
  const [selectedRegion, setSelectedRegion] = React.useState<
    string | undefined
  >(id)

  useEffect(() => {
    if (id) {
      handleChange(id)
    }

    if (!id && regions && regions.length > 0) {
      handleChange(regions[0].id)
    }
  }, [id, regions])

  useEffect(() => {
    if (isLoading) {
      return
    }

    if (!selectedRegion && regions && regions.length > 0) {
      navigate(`${basePath}/settings/regions/${regions[0].id}`, {
        replace: true,
      })
    }
  }, [regions, isLoading, selectedRegion])

  const handleChange = (id: string) => {
    if (id !== selectedRegion) {
      setSelectedRegion(id)
      navigate(`${basePath}/settings/regions/${id}`)
    }
  }

  const { state, toggle, close } = useToggleState()

  return (
    <>
      <Section
        title="Regions"
        customActions={
          canCreateRegions && (
            <div>
              <Button
                variant="ghost"
                size="small"
                className="w-8 h-8"
                onClick={toggle}
              >
                <PlusIcon />
              </Button>
            </div>
          )
        }
        className="h-full"
      >
        <p className="text-base-regular text-grey-50 mt-2xsmall">
          Manage the markets that you will operate within.
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
