import { useAdminRegions } from "medusa-react"
import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import Spinner from "../../../components/atoms/spinner"
import GearIcon from "../../../components/fundamentals/icons/gear-icon"
import BreadCrumb from "../../../components/molecules/breadcrumb"
import BodyCard from "../../../components/organisms/body-card"
import RadioGroup from "../../../components/organisms/radio-group"
import TwoSplitPane from "../../../components/templates/two-split-pane"
import TaxDetails from "./details"

const SEARCH_PARAM = "reg_id"

const Taxes = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const { regions, isLoading } = useAdminRegions()

  useEffect(() => {
    if (!isLoading && regions?.length && !searchParams.get(SEARCH_PARAM)) {
      setSearchParams({ [SEARCH_PARAM]: regions[0].id })
    }
  }, [regions, isLoading, searchParams, setSearchParams])

  return (
    <>
      <div>
        <BreadCrumb
          previousRoute="/a/settings"
          previousBreadcrumb="Settings"
          currentPage="Taxes"
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
              <div className="flex-grow h-full flex items-center justify-center">
                <Spinner size="large" variant="secondary" />
              </div>
            ) : (
              <RadioGroup.Root
                value={searchParams.get(SEARCH_PARAM) || undefined}
                onValueChange={(value) =>
                  setSearchParams({ [SEARCH_PARAM]: value })
                }
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
          <TaxDetails id={searchParams.get(SEARCH_PARAM)} />
        </TwoSplitPane>
      </div>
    </>
  )
}

export default Taxes
