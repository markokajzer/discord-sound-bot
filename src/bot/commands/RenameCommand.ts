import fs from 'fs';

import { Message } from 'discord.js';

import * as soundsDb from '@util/db/Sounds';
import localize from '@util/i18n/localize';
import { getExtensionForSound, getSounds } from '@util/SoundUtil';
import Config from '@config/Config';
import Command from './base/Command';
import userHasElevatedRole from './helpers/userHasElevatedRole';

export default class RenameCommand implements Command {
  public readonly TRIGGERS = ['rename'];
  public readonly NUMBER_OF_PARAMETERS = 2;
  public readonly USAGE = 'Usage: !rename <old> <new>';

  private readonly config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  public run(message: Message, params: string[]) {
    if (!message.member) return;

    const allowedToRunCommand = userHasElevatedRole(message.member);
    if (!allowedToRunCommand) return;

    if (params.length !== this.NUMBER_OF_PARAMETERS) {
      message.channel.send(this.USAGE);
      return;
    }

    const [oldName, newName] = params;
    const sounds = getSounds();

    if (!sounds.includes(oldName)) {
      message.channel.send(localize.t('commands.rename.notFound', { oldName }));
      return;
    }

    if (sounds.includes(newName)) {
      message.channel.send(localize.t('commands.rename.exists', { newName }));
      return;
    }

    const extension = getExtensionForSound(oldName);
    const oldFile = `sounds/${oldName}.${extension}`;
    const newFile = `sounds/${newName}.${extension}`;
    fs.renameSync(oldFile, newFile);
    soundsDb.rename(oldName, newName);

    message.channel.send(localize.t('commands.rename.success', { oldName, newName }));
  }
}
