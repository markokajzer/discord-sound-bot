import { Message } from 'discord.js';

import BaseCommand from '../base/BaseCommand';

import DatabaseAdapter from '../../db/DatabaseAdapter';

export class MostPlayedCommand extends BaseCommand {
  private db: DatabaseAdapter;

  constructor(message: Message, db: DatabaseAdapter) {
    super(message);
    this.db = db;
  }

  public run() {
    this.message.channel.send(this.getMostPlayedSounds());
  }

  private getMostPlayedSounds() {
    const sounds = this.db.getMostPlayedSounds();
    return this.prepareMessageFromSounds(sounds);
  }

  private prepareMessageFromSounds(sounds: Array<{ name: string, count: number }>) {
    const longestSound = this.findLongestWord(sounds.map(sound => sound.name));
    const longestCount = this.findLongestWord(sounds.map(sound => String(sound.count)));

    const message = ['```'];
    sounds.forEach(sound => {
      const spacesForSound = ' '.repeat(longestSound.length - sound.name.length + 1);
      const spacesForCount = ' '.repeat(longestCount.length - String(sound.count).length);
      message.push(`${sound.name}:${spacesForSound}${spacesForCount}${sound.count}`);
    });
    message.push('```');
    return message.join('\n');
  }

  private findLongestWord(array: Array<string>) {
    return array.reduce((a, b) => a.length > b.length ? a : b);
  }
}
