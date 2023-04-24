import { FC, useMemo } from "react"
import { Controller, useFormContext } from "react-hook-form"
import Tooltip from "../../../../../../../../../components/atoms/tooltip"
import Button from "../../../../../../../../../components/fundamentals/button"
import InfoIcon from "../../../../../../../../../components/fundamentals/icons/info-icon"
import { FileInput } from "../../../../../../../../../components/molecules/file-input"
import Select from "../../../../../../../../../components/molecules/select/next-select/select"
import TextArea from "../../../../../../../../../components/molecules/textarea"
import { useGetSiteSettings } from "../../../../../../../../../hooks/admin"
import {
  backgroundPositionOptions,
  backgroundRepeatOptions,
  backgroundSizeOptions,
  backgroundTypeOptions,
  blendModeOptions,
  getColorOptions,
  textAlignOptions,
} from "./helpers"
import { ColorSelect } from "./inputs/color-select"
import { SpacingInputGroup } from "./inputs/spacing-input-group"
import Input from "../../../../../../../../../components/molecules/input"
import { videoURLRegex } from "../../helpers/is-video-url"

export interface StylesFormProps {
  type: "default" | "mobile"
}

export const StylesForm: FC<StylesFormProps> = ({ type }) => {
  const { control, register, setValue, watch } = useFormContext()
  const { site_settings } = useGetSiteSettings()
  const colorOptions = useMemo(
    () => (site_settings ? getColorOptions(site_settings) : []),
    [site_settings]
  )

  const getInputName = (name: string) => `styles.${type}.${name}`

  const backgroundType = watch(getInputName("background_type"))

  return (
    <div className="flex flex-col gap-4">
      <h3 className="inter-base-semibold mb-0">Background</h3>

      <ColorSelect
        label="Color"
        placeholder="Default"
        name={getInputName("background_color")}
        options={colorOptions}
      />

      <Controller
        name={getInputName("background_type")}
        control={control}
        render={({ field: { name, value } }) => (
          <Select
            label="Media"
            placeholder="Select one"
            isMulti={false}
            isClearable={true}
            options={backgroundTypeOptions}
            value={backgroundTypeOptions.find(
              (option) => option.value === value
            )}
            onChange={(newValue) =>
              setValue(name, newValue?.value || "", { shouldDirty: true })
            }
          />
        )}
      />

      {backgroundType === "image" && (
        <>
          <FileInput label="Image" name={getInputName("background_image")} />

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1">
              <Controller
                name={getInputName("background_position")}
                control={control}
                render={({ field: { name, value } }) => (
                  <Select
                    label="Position"
                    placeholder="Default"
                    isMulti={false}
                    isClearable={true}
                    options={backgroundPositionOptions}
                    value={backgroundPositionOptions.find(
                      (option) => option.value === value
                    )}
                    onChange={(newValue) =>
                      setValue(name, newValue?.value || "", {
                        shouldDirty: true,
                      })
                    }
                  />
                )}
              />
            </div>

            <div className="col-span-1">
              <Controller
                name={getInputName("background_size")}
                control={control}
                render={({ field: { name, value } }) => (
                  <Select
                    label="Size"
                    placeholder="Default"
                    isMulti={false}
                    isClearable={true}
                    options={backgroundSizeOptions}
                    value={backgroundSizeOptions.find(
                      (option) => option.value === value
                    )}
                    onChange={(newValue) =>
                      setValue(name, newValue?.value || "", {
                        shouldDirty: true,
                      })
                    }
                  />
                )}
              />
            </div>
          </div>

          <Controller
            name={getInputName("background_repeat")}
            control={control}
            render={({ field: { name, value } }) => (
              <Select
                label="Tile"
                placeholder="Default"
                isMulti={false}
                isClearable={true}
                options={backgroundRepeatOptions}
                value={backgroundRepeatOptions.find(
                  (option) => option.value === value
                )}
                onChange={(newValue) =>
                  setValue(name, newValue?.value || "", { shouldDirty: true })
                }
              />
            )}
          />
        </>
      )}

      {backgroundType === "video" && (
        <>
          <Input
            label="Video URL"
            placeholder="https://youtu.be/your-video-id"
            tooltipContent="YouTube and Vimeo URLs are supported."
            {...register(getInputName("background_video.url"), {
              pattern: {
                value: videoURLRegex,
                message: "Enter a valid YouTube or Vimeo URL.",
              },
            })}
          />

          <FileInput
            label="Video thumbnail"
            tooltipContent="An image to replace the default thumbnail that displays while video loads."
            name={getInputName("background_video.thumbnail")}
          />
        </>
      )}

      <hr className="my-4" />

      <h3 className="inter-base-semibold">Background Overlay</h3>

      <div className="flex flex-col gap-4">
        <ColorSelect
          label="Color"
          placeholder="Default"
          name={getInputName("background_overlay.color")}
          options={colorOptions}
        />

        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              label="Opacity"
              type="number"
              placeholder="Default"
              step="0.1"
              max="1"
              min="0"
              {...register(getInputName("background_overlay.opacity"))}
            />
          </div>
          <div className="flex-1">
            <Controller
              name={getInputName("background_overlay.blend_mode")}
              control={control}
              render={({ field: { name, value, onBlur } }) => (
                <Select
                  label="Blend mode"
                  placeholder="Default"
                  isMulti={false}
                  isClearable={true}
                  options={blendModeOptions}
                  value={blendModeOptions.find(
                    (option) => option.value === value
                  )}
                  onBlur={onBlur}
                  onChange={(newValue) =>
                    setValue(name, newValue?.value || "", { shouldDirty: true })
                  }
                />
              )}
            />
          </div>
        </div>

        <Input
          label="Blur"
          type="number"
          placeholder="Default"
          step="1"
          min="0"
          {...register(getInputName("background_overlay.blur"))}
        />
      </div>

      <hr className="my-4" />

      <h3 className="inter-base-semibold mb-0">Text</h3>

      <ColorSelect
        label="Color"
        placeholder="Default"
        name={getInputName("color")}
        options={colorOptions}
      />

      {/* TODO: Figure out how to apply this across sections. */}
      <Controller
        name={getInputName("text_align")}
        control={control}
        render={({ field: { name, value, onBlur } }) => (
          <Select
            label="Align"
            placeholder="Default"
            isMulti={false}
            isClearable={true}
            options={textAlignOptions}
            value={textAlignOptions.find((option) => option.value === value)}
            onBlur={onBlur}
            onChange={(newValue) =>
              setValue(name, newValue?.value || "", { shouldDirty: true })
            }
          />
        )}
      />

      <hr className="my-4" />

      <h3 className="inter-base-semibold">Padding</h3>

      <SpacingInputGroup name={getInputName("padding")} direction="vertical" />

      <SpacingInputGroup
        name={getInputName("padding")}
        direction="horizontal"
      />

      <hr className="my-4" />

      <h3 className="inter-base-semibold">Margins</h3>

      <SpacingInputGroup name={getInputName("margin")} direction="vertical" />

      <SpacingInputGroup name={getInputName("margin")} direction="horizontal" />

      <hr className="my-4" />

      <h3 className="inter-base-semibold flex justify-between items-center relative z-50">
        <span>Custom CSS</span>
        <Tooltip
          className="min-w-[240px]"
          side="top"
          content={
            <div className="flex flex-col gap-3 p-1 py-2">
              <p>
                All CSS rules supplied here will be prefixed with a
                section-specific CSS selector for scoping purposes.
              </p>
              <p>
                To apply CSS directly to the section wrapper use the{" "}
                <code className="inline-block px-1 bg-grey-10 rounded-md font-mono">
                  &amp;
                </code>{" "}
                selector. For reference, see the example below.
              </p>
              <pre className="block p-2 bg-grey-10 rounded-md font-mono overflow-x-auto">
                {`& {
  /* Will be applied to the section element. */
}

h2 {
  /* Will be applied to h2 tags within the section. */
}

.button {
  /* Will be applied to elements with the class "button" within the section. */
}
`}
              </pre>
            </div>
          }
        >
          <Button variant="ghost" className="p-0 w-7 h-7 text-grey-40">
            <InfoIcon className="w-5 h-5" />
          </Button>
        </Tooltip>
      </h3>

      <TextArea
        rows={6}
        label=""
        placeholder="CSS added here will apply to this section only"
        {...register(getInputName("custom_css"))}
      />
    </div>
  )
}
