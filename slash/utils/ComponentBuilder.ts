import {
  ButtonStyle,
  ComponentActionRow,
  ComponentButton,
  ComponentButtonLink,
  ComponentSelectMenu,
  ComponentType,
} from "slash-create";

export class ActionRow {
  components: (Button | LinkButton | SelectRow)[];
  constructor(...components: (Button | LinkButton | SelectRow)[]) {
    this.components = components;
  }

  component(component: Button | LinkButton | SelectRow): ActionRow {
    this.components.push(component);
    return this;
  }

  toJSON(): ComponentActionRow {
    return {
      type: ComponentType.ACTION_ROW,
      components: this.components.map((c) => c.toJSON()),
    };
  }
}

export class Button {
  constructor(private base: Partial<ComponentButton> = {}) {}

  customID(id: string): Button {
    this.base.custom_id = id;
    return this;
  }

  disabled(isDisabled = true): Button {
    this.base.disabled = isDisabled;
    return this;
  }

  emoji(name: string, id?: string, animated?: boolean): Button;
  emoji(name: string, ...others: [string, boolean]): Button {
    this.base.emoji = others.length
      ? { name, id: others[0], animated: others[1] }
      : { name };
    return this;
  }

  label(label: string): Button {
    this.base.label = label;
    return this;
  }

  style(style: Exclude<ButtonStyle, ButtonStyle.LINK>): Button {
    this.base.style = style;
    return this;
  }

  toJSON(): ComponentButton {
    return { ...(this.base as ComponentButton), type: ComponentType.BUTTON };
  }
}

export class LinkButton {
  constructor(private base: Partial<ComponentButtonLink> = {}) {}

  link(url: string): LinkButton {
    this.base.url = url;
    return this;
  }

  label(label: string): LinkButton {
    this.base.label = label;
    return this;
  }

  toJSON(): ComponentButtonLink {
    return {
      ...(this.base as ComponentButtonLink),
      type: ComponentType.BUTTON,
      style: ButtonStyle.LINK,
    };
  }
}

// Placeholder for now
export class SelectRow {
  toJSON(): ComponentSelectMenu {
    return {
      type: ComponentType.SELECT,
      custom_id: "whatever",
      options: [],
    };
  }
}
