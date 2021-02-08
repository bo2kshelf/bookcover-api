import {HttpService, Inject, Injectable} from '@nestjs/common';
import {ConfigType} from '@nestjs/config';
import imageSize from 'image-size';
import {RedisCacheService} from '../redis-cache/redis-cache.service';
import {ExcludeConfig} from './exclude.config';

@Injectable()
export class ExcludeService {
  constructor(
    @Inject(ExcludeConfig.KEY)
    private readonly config: ConfigType<typeof ExcludeConfig>,

    private readonly httpService: HttpService,
    private readonly cache: RedisCacheService,
  ) {}

  createRedisKey(key: string): string {
    return `proper-bookcover:${key}`;
  }

  async checkFromCache(key: string): Promise<boolean> {
    return this.cache
      .get<string>(this.createRedisKey(key))
      .then((value) => Boolean(value && value === 'true'))
      .catch(() => false);
  }

  checkSizePerDataSize(width: number, height: number, length: number): boolean {
    return length <= width * height * this.config.minPercentageSizePerDataSize;
  }

  async canExcludeFromUrl(url: string): Promise<boolean> {
    if (await this.checkFromCache(url)) return true;

    const canExclude = await this.httpService
      .get(url, {responseType: 'arraybuffer'})
      .toPromise()
      .then(({data}) => {
        const {width, height} = imageSize(data);
        const byteLength = data.byteLength;
        return Boolean(
          width &&
            height &&
            byteLength &&
            this.checkSizePerDataSize(width, height, byteLength),
        );
      });

    if (canExclude) {
      await this.cache.set(this.createRedisKey(url), 'true', {
        ttl: this.config.ttl,
      });
      return true;
    }
    return false;
  }
}
