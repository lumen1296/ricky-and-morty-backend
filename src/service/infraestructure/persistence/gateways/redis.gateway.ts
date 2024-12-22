import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { Redis as RedisClient } from 'ioredis';
import { Character } from 'src/service/application-core/character/entity/character.entity';

@Injectable()
export class RedisService {
  private redisClient: RedisClient;

  constructor() {
    this.redisClient = new Redis({
      host: 'localhost',
      port: 6379,
      db: 0,
    });
  }

  async setValue(key: string, characters:  Character[]): Promise<void> {
    await this.redisClient.set(key, JSON.stringify(characters));
  }

  async getValue(key: string): Promise<any> {
    return await this.redisClient.get(key);
  }

  async delValue(key: string): Promise<void> {
    await this.redisClient.del(key);
  }

  async getLastValue(key: string): Promise<any> {
    const lastValue = await this.redisClient.lrange(key, -1, -1);
    return lastValue[0];
  }

  
}
