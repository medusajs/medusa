import { InjectionZone, Widget, WidgetExtension } from "./types"

type Widgets = Map<InjectionZone, Widget[]>

class WidgetRegistry {
  private widgets: Widgets = new Map()

  public registerWidget(origin: string, widget: WidgetExtension) {
    const { zone } = widget.config

    const widgets = this.widgets.get(zone) || []
    widgets.push({ origin, Widget: widget.Component })

    this.widgets.set(zone, widgets)
  }

  public getWidgets(zone: InjectionZone) {
    return this.widgets.get(zone) || []
  }
}

export default WidgetRegistry
