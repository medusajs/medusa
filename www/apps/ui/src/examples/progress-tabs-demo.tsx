import { ProgressTabs, Text } from "@medusajs/ui"

export default function ProgressTabsDemo() {
  return (
    <div className="w-full px-4">
      <ProgressTabs defaultValue="general">
        <div className="border-b border-ui-border-base">
          <ProgressTabs.List>
            <ProgressTabs.Trigger value="general">General</ProgressTabs.Trigger>
            <ProgressTabs.Trigger value="shipping">
              Shipping
            </ProgressTabs.Trigger>
            <ProgressTabs.Trigger value="payment">Payment</ProgressTabs.Trigger>
          </ProgressTabs.List>
        </div>
        <div className="mt-2">
          <ProgressTabs.Content value="general">
            <Text size="small">
              At ACME, we&apos;re dedicated to providing you with an exceptional
              shopping experience. Our wide selection of products caters to your
              every need, from fashion to electronics and beyond. We take pride
              in our commitment to quality, customer satisfaction, and timely
              delivery. Our friendly customer support team is here to assist you
              with any inquiries or concerns you may have. Thank you for
              choosing ACME as your trusted online shopping destination.
            </Text>
          </ProgressTabs.Content>
          <ProgressTabs.Content value="shipping">
            <Text size="small">
              Shipping is a crucial part of our service, designed to ensure your
              products reach you quickly and securely. Our dedicated team works
              tirelessly to process orders, carefully package items, and
              coordinate with reliable carriers to deliver your purchases to
              your doorstep. We take pride in our efficient shipping process,
              guaranteeing your satisfaction with every delivery.
            </Text>
          </ProgressTabs.Content>
          <ProgressTabs.Content value="payment">
            <Text size="small">
              Our payment process is designed to make your shopping experience
              smooth and secure. We offer a variety of payment options to
              accommodate your preferences, from credit and debit cards to
              online payment gateways. Rest assured that your financial
              information is protected through advanced encryption methods.
              Shopping with us means you can shop with confidence, knowing your
              payments are safe and hassle-free.
            </Text>
          </ProgressTabs.Content>
        </div>
      </ProgressTabs>
    </div>
  )
}
