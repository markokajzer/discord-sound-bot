import fs from 'fs';

import { Message, Permissions } from 'discord.js';

import BaseCommand from '../base/BaseCommand';

import SoundUtil from '../../util/SoundUtil';

export class RemoveCommand extends BaseCommand {
  protected readonly USAGE = 'Usage: !remove <sound>';
  private readonly input: Array<string>;

  constructor(message: Message, input: Array<string>) {
    super(message);
    this.input = input;
  }

  public run() {
    if (!this.message.member.hasPermission(Permissions.FLAGS.ADMINISTRATOR!)) return;

    if (this.input.length !== 1) {
      this.message.channel.send(this.USAGE);
      return;
    }

    const sound = this.input[0];
    if (!SoundUtil.soundExists(sound)) {
      this.message.channel.send(`${sound} not found!`);
      return;
    }

    const file = SoundUtil.getPathForSound(sound);
    fs.unlinkSync(file);
    this.message.channel.send(`${sound} removed!`);
  }
}
