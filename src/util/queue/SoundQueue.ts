import { VoiceConnection } from 'discord.js';

import Config from '@config/Config';
import DatabaseAdapter from '@util/db/DatabaseAdapter';
import SoundUtil from '@util/SoundUtil';
import QueueItem from './QueueItem';

export default class SoundQueue {
  private readonly config: Config;
  private readonly db: DatabaseAdapter;
  private queue: Array<QueueItem>;
  private currentSound: QueueItem | null;

  constructor(config: Config, db: DatabaseAdapter) {
    this.config = config;
    this.db = db;
    this.queue = [];
    this.currentSound = null;
  }

  public add(item: QueueItem) {
    this.queue.push(item);
    if (this.isStartable()) this.playNext();
  }

  public items(): Array<QueueItem> {
    return this.queue;
  }

  public clear() {
    this.queue = [];
  }

  private isStartable() {
    return this.currentSound === null;
  }

  private playNext() {
    this.currentSound = this.queue.shift()!;
    const sound = SoundUtil.getPathForSound(this.currentSound.name);

    this.currentSound.channel.join()
      .then(connection => this.deafen(connection))
      .then(connection => this.playSound(connection, sound))
      .then(connection => this.onFinishedPlayingSound(connection as VoiceConnection))
      .catch(error => console.error('Error occured!', '\n', error));
  }

  private deafen(connection: VoiceConnection) {
    // Can only deafen when in a channel, therefore need connection
    connection.channel.guild.me.setDeaf(this.config.deafen);
    return Promise.resolve(connection);
  }

  private playSound(connection: VoiceConnection, name: string) {
    return new Promise(resolve =>
      connection.playFile(name, { volume: this.config.volume })
                .on('end', () => resolve(connection))
    );
  }

  private onFinishedPlayingSound(connection: VoiceConnection) {
    this.db.sounds.incrementCount(this.currentSound!.name);
    if (this.config.deleteMessages && this.currentSound!.message) {
      this.currentSound!.message!.delete();
    }

    if (!this.isEmpty()) {
      this.playNext();
      return;
    }

    this.currentSound = null;
    if (!this.config.stayInChannel) connection.disconnect();
  }

  private isEmpty() {
    return this.queue.length === 0;
  }
}
