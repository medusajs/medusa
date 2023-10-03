import { Reflection } from 'typedoc';

export class NavigationItem {
  title: string;
  url: string;
  dedicatedUrls?: string[];
  parent?: NavigationItem;
  children?: NavigationItem[];
  isLabel?: boolean;
  isVisible?: boolean;
  isCurrent?: boolean;
  isModules?: boolean;
  isInPath?: boolean;
  reflection?: Reflection;

  constructor(
    title?: string,
    url?: string,
    parent?: NavigationItem,
    reflection?: Reflection,
  ) {
    this.title = title || '';
    this.url = url || '';
    this.parent = parent;
    this.reflection = reflection;

    if (!url) {
      this.isLabel = true;
    }

    if (this.parent) {
      if (!this.parent.children) {
        this.parent.children = [];
      }
      this.parent.children.push(this);
    }
  }

  static create(
    reflection: Reflection,
    parent?: NavigationItem,
    useShortNames?: boolean,
  ) {
    let name: string;
    if (useShortNames || (parent && parent.parent)) {
      name = reflection.name;
    } else {
      name = reflection.getFullName();
    }

    name = name.trim();

    return new NavigationItem(name, reflection.url, parent, reflection);
  }
}
