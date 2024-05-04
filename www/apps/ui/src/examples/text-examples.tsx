import { Text } from "@medusajs/ui"

export default function TextExamples() {
  return (
    <div className="flex flex-col items-start gap-y-2">
      <Text size="base" weight="regular" family="sans">
        Base Size, Regular Weight, Sans-Serif
      </Text>
      <Text size="base" weight="plus" family="sans">
        Base Size, Plus Weight, Sans-Serif
      </Text>
      <Text size="large" weight="regular" family="sans">
        Large Size, Regular Weight, Sans-Serif
      </Text>
      <Text size="large" weight="plus" family="sans">
        Large Size, Plus Weight, Sans-Serif
      </Text>
      <Text size="xlarge" weight="regular" family="sans">
        XLarge Size, Regular Weight, Sans-Serif
      </Text>
      <Text size="xlarge" weight="plus" family="sans">
        XLarge Size, Plus Weight, Sans-Serif
      </Text>
      <Text size="base" weight="regular" family="mono">
        Base Size, Regular Weight, Mono
      </Text>
      <Text size="large" weight="regular" family="mono">
        Large Size, Regular Weight, Mono
      </Text>
      <Text size="large" weight="plus" family="mono">
        Large Size, Plus Weight, Mono
      </Text>
      <Text size="xlarge" weight="regular" family="mono">
        XLarge Size, Regular Weight, Mono
      </Text>
      <Text size="xlarge" weight="plus" family="mono">
        XLarge Size, Plus Weight, Mono
      </Text>
    </div>
  )
}
