import { Message } from 'discord.js';

import ICommand from './base/ICommand';

import QueueItem from '@util/queue/QueueItem';
import SoundQueue from '@util/queue/SoundQueue';
import SoundUtil from '@util/SoundUtil';
import VoiceChannelFinder from './helpers/VoiceChannelFinder';

export default class RandomCommand implements ICommand {
  public readonly TRIGGERS = ['random'];

  private readonly soundUtil: SoundUtil;
  private readonly queue: SoundQueue;
  private readonly voiceChannelFinder: VoiceChannelFinder;

  constructor(soundUtil: SoundUtil, queue: SoundQueue, voiceChannelFinder: VoiceChannelFinder) {
    this.soundUtil = soundUtil;
    this.queue = queue;
    this.voiceChannelFinder = voiceChannelFinder;
  }

  public run(message: Message, _: Array<string>) {
    const voiceChannel = this.voiceChannelFinder.getVoiceChannelFromMessageAuthor(message);
    if (!voiceChannel) return;

    const sounds = this.soundUtil.getSounds();
    const random = sounds[Math.floor(Math.random() * sounds.length)];

    this.queue.add(new QueueItem(random, voiceChannel, message));
  }
}
