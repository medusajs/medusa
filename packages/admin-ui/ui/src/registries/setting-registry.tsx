import { Card, Setting, SettingExtension } from "../types/extensions"

class SettingRegistry {
  private settings: Record<string, Setting>
  private cards: Card[]

  constructor() {
    this.settings = {}
    this.cards = []
  }

  register(origin: string, { Component, config }: SettingExtension) {
    const { path, card } = config

    if (this.settings[path] !== undefined) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          `Settings page with path ${path} already registered by ${this.settings[path].origin}.`
        )
      }

      return
    }

    this.settings[path] = {
      origin,
      path: path,
      Page: Component,
    }

    this.cards.push({
      path: path,
      label: card.label,
      description: card.description,
      icon: card.icon,
    })
  }

  /**
   * Returns an array of settings sorted by path
   * @returns {Setting[]} An array of settings sorted by path
   */
  getSettings(): Setting[] {
    return Object.values(this.settings).sort((a, b) => {
      return a.path.localeCompare(b.path)
    })
  }

  /**
   * Returns an array of cards sorted by path
   * @returns {Card[]} An array of cards sorted by path
   */
  getCards(): Card[] {
    return this.cards.sort((a, b) => {
      return a.path.localeCompare(b.path)
    })
  }
}

export default SettingRegistry
