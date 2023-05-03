import { useAdminRegions } from "medusa-react"
import { useCallback, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import BackButton from "../../../components/atoms/back-button"
import Spinner from "../../../components/atoms/spinner"
import GearIcon from "../../../components/fundamentals/icons/gear-icon"
import BodyCard from "../../../components/organisms/body-card"
import RadioGroup from "../../../components/organisms/radio-group"
import TwoSplitPane from "../../../components/templates/two-split-pane"
import TaxDetails from "./details"

const Taxes = () => {
  const params = useParams()
  const regId: string | undefined = params["*"]

  const navigate = useNavigate()

  const { regions, isLoading } = useAdminRegions()

  const [selectedRegion, setSelectedRegion] = useState<string | undefined>(
    regId
  )

  const handleChange = useCallback(
    (id: string) => {
      if (id !== selectedRegion) {
        setSelectedRegion(id)
        navigate(`/a/settings/taxes/${id}`, {
          replace: true,
        })
      }
    },
    [navigate, selectedRegion]
  )

  useEffect(() => {
    if (regId) {
      handleChange(regId)
    }

    if (!regId && regions && regions.length > 0) {
      handleChange(regions[0].id)
    }
  }, [handleChange, regId, regions])

  return (
    <>
      <div>
        <BackButton
          path="/a/settings"
          label="Back to settings"
          className="mb-xsmall"
        />
        <TwoSplitPane threeCols>
          <BodyCard
            forceDropdown
            title="Regions"
            subtitle="Select the region you wish to manage taxes for"
            actionables={[
              {
                icon: <GearIcon />,
                label: "Go to Region settings",
                onClick: () => navigate("/a/settings/regions"),
              },
            ]}
          >
            {isLoading || !regions ? (
              <div className="flex h-full flex-grow items-center justify-center">
                <Spinner size="large" variant="secondary" />
              </div>
            ) : (
              <RadioGroup.Root
                value={selectedRegion}
                onValueChange={handleChange}
              >
                {regions.map((r) => {
                  return (
                    <RadioGroup.Item
                      label={r.name}
                      description={
                        r.countries.length
                          ? `${r.countries
                              .map((c) => c.display_name)
                              .join(", ")}`
                          : undefined
                      }
                      value={r.id}
                      key={r.id}
                      id={r.id}
                    />
                  )
                })}
              </RadioGroup.Root>
            )}
          </BodyCard>
          <TaxDetails id={selectedRegion} />
        </TwoSplitPane>
      </div>
    </>
  )
}

export default Taxes
