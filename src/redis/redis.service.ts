import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);

  private host: string;
  private port: string;
  private client: RedisClientType;

  constructor() {
    this.host = process.env.REDIS_HOST;
    this.port = process.env.REDIS_PORT;

    this.client = createClient({
      url: `redis://${this.host}:${this.port}/0`,
    });
  }

  async append(key: string, record: { key: string; value: string }) {
    this.client.hSet(key, record);
  }

  async set(key: string, value: string) {
    this.logger.verbose(`setting key`, {
      key,
      value,
    });
    return this.client.set(key, value);
  }

  async clear(key: string) {
    this.logger.verbose(`clear key`, { key });
    return this.client.del(key);
  }

  async get<T>(key: string): Promise<T> {
    const value = await this.client.get(key);
    this.logger.verbose('get value', { key, value });
    return value as T;
  }

  async onModuleInit() {
    return await this.client.connect();
  }

  async onModuleDestroy() {
    return await this.client.disconnect();
  }
}
