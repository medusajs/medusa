const Radio = ({ checked, 'data-testid': dataTestId }: { checked: boolean, 'data-testid'?: string }) => {
  return (
    <>
      <button
        type="button"
        role="radio"
        aria-checked="true"
        data-state={checked ? "checked" : "unchecked"}
        className="group relative flex h-5 w-5 items-center justify-center outline-none"
        data-testid={dataTestId || 'radio-button'}
      >
        <div className="shadow-borders-base group-hover:shadow-borders-strong-with-shadow bg-ui-bg-base group-data-[state=checked]:bg-ui-bg-interactive group-data-[state=checked]:shadow-borders-interactive group-focus:!shadow-borders-interactive-with-focus group-disabled:!bg-ui-bg-disabled group-disabled:!shadow-borders-base flex h-[14px] w-[14px] items-center justify-center rounded-full transition-all">
          {checked && (
            <span
              data-state={checked ? "checked" : "unchecked"}
              className="group flex items-center justify-center"
            >
              <div className="bg-ui-bg-base shadow-details-contrast-on-bg-interactive group-disabled:bg-ui-fg-disabled rounded-full group-disabled:shadow-none h-1.5 w-1.5"></div>
            </span>
          )}
        </div>
      </button>
    </>
  )
}

export default Radio
