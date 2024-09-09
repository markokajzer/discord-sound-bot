import type { Message } from "discord.js";

import { getSounds } from "~/util/SoundUtil";
import * as sounds from "~/util/db/Sounds";
import localize from "~/util/i18n/localize";

import Command from "../base/Command";

export class TagCommand extends Command {
  public readonly triggers = ["tag"];
  public readonly numberOfParameters = 1;
  public readonly usage = "Usage: !tag <sound> [<tag> ... <tagN> | clear]";
  public readonly elevated = true;

  public run(message: Message, params: string[]) {
    if (params.length < this.numberOfParameters) {
      message.channel.send(this.usage);
      return;
    }

    // biome-ignore lint/style/noNonNullAssertion: verified params above
    const sound = params.shift()!;
    if (!getSounds().includes(sound)) {
      message.channel.send(localize.t("commands.tag.notFound", { sound }));
      return;
    }

    if (!params.length) {
      const tags = sounds.listTags(sound).join(", ");
      message.author.send(localize.t("commands.tag.found", { sound, tags }));
      return;
    }

    if (params[0] === "clear") {
      sounds.clearTags(sound);
      return;
    }

    sounds.addTags(sound, params);
  }
}
