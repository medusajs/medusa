import { ProgressAccordion, Text } from "@medusajs/ui"

export default function ProgressAccordionSingle() {
  return (
    <div className="w-full px-4">
      <ProgressAccordion type="multiple">
        <ProgressAccordion.Item value="general">
          <ProgressAccordion.Header>General</ProgressAccordion.Header>
          <ProgressAccordion.Content>
            <div className="pb-6">
              <Text size="small">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                ornare, tortor nec commodo ultrices, diam leo porttitor eros,
                eget ultricies mauris nisl nec nisl. Donec quis magna euismod,
                lacinia ipsum id, varius velit.
              </Text>
            </div>
          </ProgressAccordion.Content>
        </ProgressAccordion.Item>
        <ProgressAccordion.Item value="shipping">
          <ProgressAccordion.Header>Shipping</ProgressAccordion.Header>
          <ProgressAccordion.Content>
            <div className="pb-6">
              <Text size="small">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                ornare, tortor nec commodo ultrices, diam leo porttitor eros,
                eget ultricies mauris nisl nec nisl. Donec quis magna euismod,
                lacinia ipsum id, varius velit.
              </Text>
            </div>
          </ProgressAccordion.Content>
        </ProgressAccordion.Item>
      </ProgressAccordion>
    </div>
  )
}
