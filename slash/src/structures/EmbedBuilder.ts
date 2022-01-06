import { MessageEmbedOptions } from "slash-create";

export class EmbedBuilder {
  constructor(private base: MessageEmbedOptions = {}) {}

  title(title: string): EmbedBuilder {
    this.base.title = title;
    return this;
  }

  URL(url: string): EmbedBuilder {
    this.base.url = url;
    return this;
  }

  description(description: string): EmbedBuilder {
    this.base.description = description;
    return this;
  }

  color(color: number): EmbedBuilder {
    this.base.color = color;
    return this;
  }

  author(name: string, icon?: string, url?: string): EmbedBuilder {
    this.base.author = { name, icon_url: icon, url };
    return this;
  }

  timestamp(time: number | string | Date): EmbedBuilder {
    this.base.timestamp = new Date(time).toISOString();
    return this;
  }

  footer(text: string, icon: string): EmbedBuilder {
    this.base.footer = { text, icon_url: icon };
    return this;
  }

  field(name: string, value: string, inline = false): EmbedBuilder {
    if (!this.base.fields || !this.base.fields.length) {
      this.base.fields = [];
    }
    this.base.fields.push({ name, value, inline });
    return this;
  }

  blankField(inline = false): EmbedBuilder {
    return this.field("\u200B", "\u200B", inline);
  }

  image(url: string): EmbedBuilder {
    this.base.image = { url };
    return this;
  }

  thumbnail(url: string): EmbedBuilder {
    this.base.thumbnail = { url };
    return this;
  }

  toJSON(): MessageEmbedOptions {
    return this.base;
  }
}
