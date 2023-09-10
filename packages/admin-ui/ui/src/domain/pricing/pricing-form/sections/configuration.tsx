import { PriceList } from "@medusajs/medusa"
import clsx from "clsx"
import { useAdminCustomerGroups } from "medusa-react"
import React, { useState } from "react"
import { Controller } from "react-hook-form"
import { useTranslation } from "react-i18next"
import DatePicker from "../../../../components/atoms/date-picker/date-picker"
import TimePicker from "../../../../components/atoms/date-picker/time-picker"
import Switch from "../../../../components/atoms/switch"
import Accordion from "../../../../components/organisms/accordion"
import { weekFromNow } from "../../../../utils/date-utils"
import { usePriceListForm } from "../form/pricing-form-context"
import { ConfigurationFields } from "../types"
import { NextSelect } from "../../../../components/molecules/select/next-select"

type ConfigurationProps = {
  priceList?: PriceList
}

const checkForEnabledConfigs = (config: ConfigurationFields): string[] => {
  const { t } = useTranslation()
  const enabledConfigs: string[] = []

  if (config.customer_groups && config.customer_groups.length > 0) {
    enabledConfigs.push("customer_groups")
  }
  if (config.starts_at) {
    enabledConfigs.push("starts_at")
  }
  if (config.ends_at) {
    enabledConfigs.push("ends_at")
  }

  return enabledConfigs
}

const Configuration: React.FC<ConfigurationProps> = () => {
  const { t } = useTranslation()
  const { customer_groups, isLoading } = useAdminCustomerGroups()
  const { control, handleConfigurationSwitch, configFields } =
    usePriceListForm()
  const [openItems, setOpenItems] = useState<string[]>(
    checkForEnabledConfigs(configFields)
  )

  return (
    <Accordion.Item
      forceMountContent
      title={t("sections-configuration", "Configuration")}
      tooltip={t(
        "sections-optional-configuration-for-the-price-list",
        "Optional configuration for the price list"
      )}
      value="configuration"
      description={t(
        "sections-price-overrides-time-application",
        "The price overrides apply from the time you hit the publish button and forever if left untouched."
      )}
    >
      <Accordion
        type="multiple"
        value={openItems}
        onValueChange={(values) => {
          handleConfigurationSwitch(values)
          setOpenItems(values)
        }}
      >
        <div className="mt-5">
          <Accordion.Item
            headingSize="medium"
            forceMountContent
            className="border-b-0"
            title={t(
              "sections-price-overrides-has-a-start-date",
              "Price overrides has a start date?"
            )}
            subtitle={t(
              "sections-schedule-the-price-overrides-to-activate-in-the-future",
              "Schedule the price overrides to activate in the future."
            )}
            value="starts_at"
            customTrigger={
              <Switch checked={openItems.indexOf("starts_at") > -1} />
            }
          >
            <div
              className={clsx(
                "gap-xsmall accordion-margin-transition flex items-center",
                {
                  "mt-4": openItems.indexOf("starts_at") > -1,
                }
              )}
            >
              <Controller
                name="starts_at"
                control={control}
                render={({ field: { value, onChange } }) => {
                  const ensuredDate = value || new Date()
                  return (
                    <>
                      <DatePicker
                        date={ensuredDate}
                        label={t("sections-start-date", "Start date")}
                        onSubmitDate={onChange}
                      />
                      <TimePicker
                        date={ensuredDate}
                        label={t("sections-start-date", "Start date")}
                        onSubmitDate={onChange}
                      />
                    </>
                  )
                }}
              />
            </div>
          </Accordion.Item>
          <Accordion.Item
            headingSize="medium"
            forceMountContent
            className="border-b-0"
            title={t(
              "sections-price-overrides-has-an-expiry-date",
              "Price overrides has an expiry date?"
            )}
            subtitle={t(
              "sections-schedule-the-price-overrides-to-deactivate-in-the-future",
              "Schedule the price overrides to deactivate in the future."
            )}
            value="ends_at"
            customTrigger={
              <Switch checked={openItems.indexOf("ends_at") > -1} />
            }
          >
            <div
              className={clsx(
                "gap-xsmall accordion-margin-transition flex items-center",
                {
                  "mt-4": openItems.indexOf("ends_at") > -1,
                }
              )}
            >
              <Controller
                name="ends_at"
                control={control}
                render={({ field: { value, onChange } }) => {
                  const ensuredDate = value || weekFromNow()
                  return (
                    <>
                      <DatePicker
                        date={ensuredDate}
                        label={t("sections-end-date", "End date")}
                        onSubmitDate={onChange}
                      />
                      <TimePicker
                        date={ensuredDate}
                        label={t("sections-end-date", "End date")}
                        onSubmitDate={onChange}
                      />
                    </>
                  )
                }}
              />
            </div>
          </Accordion.Item>
          <Accordion.Item
            headingSize="medium"
            forceMountContent
            className="border-b-0"
            title={t("sections-customer-availabilty", "Customer availabilty")}
            subtitle={t(
              "sections-specifiy-which-customer-groups-the-price-overrides-should-apply-for",
              "Specifiy which customer groups the price overrides should apply for."
            )}
            value="customer_groups"
            customTrigger={
              <Switch checked={openItems.indexOf("customer_groups") > -1} />
            }
          >
            <Controller
              name="customer_groups"
              control={control}
              render={({ field: { value, onChange, ref } }) => {
                return (
                  <div
                    className={clsx(
                      "gap-xsmall accordion-margin-transition flex w-full items-center",
                      {
                        "mt-4": openItems.indexOf("customer_groups") > -1,
                      }
                    )}
                  >
                    <NextSelect
                      options={
                        customer_groups?.map((cg) => ({
                          label: cg.name,
                          value: cg.id,
                        })) || []
                      }
                      label={t(
                        "sections-customer-groups-label",
                        "Customer Groups"
                      )}
                      onChange={onChange}
                      isMulti={true}
                      selectAll={true}
                      isSearchable={true}
                      value={value}
                      ref={ref}
                      isLoading={isLoading}
                    />
                  </div>
                )
              }}
            />
          </Accordion.Item>
        </div>
      </Accordion>
    </Accordion.Item>
  )
}

export default Configuration
