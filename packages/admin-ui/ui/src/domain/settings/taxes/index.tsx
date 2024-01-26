import { Region } from "@medusajs/medusa"
import { useAdminRegions } from "medusa-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate, useParams } from "react-router-dom"
import BackButton from "../../../components/atoms/back-button"
import GearIcon from "../../../components/fundamentals/icons/gear-icon"
import BodyCard from "../../../components/organisms/body-card"
import RadioGroup from "../../../components/organisms/radio-group"
import TwoSplitPane from "../../../components/templates/two-split-pane"
import TaxDetails from "./details"

const LIMIT = 20

const Taxes = () => {
  const params = useParams()
  const regId: string | undefined = params["*"]

  const [offset, setOffset] = useState(0)
  const observerRef = useRef<HTMLDivElement>(null)

  const navigate = useNavigate()
  const { t } = useTranslation()

  const [regionOpts, setRegionOpts] = useState<Region[]>([])

  const { regions, count, isLoading } = useAdminRegions({
    offset,
    limit: LIMIT,
  })

  useEffect(() => {
    if (regions && !isLoading) {
      setRegionOpts((prev) => {
        const exisitngIds = prev.map((r) => r.id)
        const newOpts = regions.filter((r) => !exisitngIds.includes(r.id))

        return [...prev, ...newOpts]
      })
    }
  }, [regions, isLoading])

  useEffect(() => {
    const current = observerRef.current

    const observer = new IntersectionObserver(
      (entries) => {
        // If the ref is in view and there's more data to fetch
        if (
          entries[0].isIntersecting &&
          regionOpts &&
          regionOpts.length < (count || 0)
        ) {
          setOffset(regionOpts.length)
        }
      },
      {
        root: null, // relative to the viewport
        threshold: 1.0, // trigger when 100% of the ref is visible
      }
    )

    if (current) {
      observer.observe(current)
    }

    // Clean up the observer on component unmount
    return () => {
      if (current) {
        observer.unobserve(current)
      }
    }
  }, [count, regionOpts])

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
          label={t("taxes-back-to-settings", "Back to settings")}
          className="mb-xsmall"
        />
        <TwoSplitPane threeCols>
          <BodyCard
            forceDropdown
            title={t("taxes-regions", "Regions")}
            subtitle={t(
              "taxes-select-the-region-you-wish-to-manage-taxes-for",
              "Select the region you wish to manage taxes for"
            )}
            actionables={[
              {
                icon: <GearIcon />,
                label: t(
                  "taxes-go-to-region-settings",
                  "Go to Region settings"
                ),
                onClick: () => navigate("/a/settings/regions"),
              },
            ]}
            className="no-scrollbar overflow-y-auto"
          >
            <div>
              <RadioGroup.Root
                value={selectedRegion}
                onValueChange={handleChange}
              >
                {regionOpts.map((r, index) => {
                  return (
                    <div
                      key={r.id}
                      ref={
                        index === regionOpts.length - 1
                          ? observerRef
                          : undefined
                      }
                    >
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
                      />
                    </div>
                  )
                })}
              </RadioGroup.Root>
            </div>
          </BodyCard>
          <TaxDetails id={selectedRegion} />
        </TwoSplitPane>
      </div>
    </>
  )
}

export default Taxes
