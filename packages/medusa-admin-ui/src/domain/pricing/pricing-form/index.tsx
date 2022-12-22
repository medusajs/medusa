import React from "react"
import FocusModal from "../../../components/molecules/modal/focus-modal"
import Accordion from "../../../components/organisms/accordion"
import FormHeader from "./form-header"
import Configuration from "./sections/configuration"
import General from "./sections/general"
import Prices from "./sections/prices"
import Type from "./sections/type"
import { PriceListFormProps, ViewType } from "./types"

const PriceListForm = (props: PriceListFormProps) => {
  return (
    <FocusModal>
      <FocusModal.Header>
        <FormHeader {...props} />
      </FocusModal.Header>
      <FocusModal.Main>
        <div className="flex justify-center mb-[25%]">
          <div className="medium:w-7/12 large:w-6/12 small:w-4/5 w-full pt-16">
            <h1 className="inter-xlarge-semibold mb-[28px]">
              {props.viewType === ViewType.CREATE
                ? "Create new price list"
                : "Edit price list"}
            </h1>
            <Accordion type="multiple" defaultValue={["type"]}>
              <Type />
              <General />
              <Configuration />
              {props.viewType !== ViewType.EDIT_DETAILS && (
                <Prices
                  isEdit={props.viewType !== ViewType.CREATE}
                  id={props.id}
                />
              )}
            </Accordion>
          </div>
        </div>
      </FocusModal.Main>
    </FocusModal>
  )
}

export default PriceListForm
