import {Inject, Injectable} from '@nestjs/common';
import {ConfigType} from '@nestjs/config';
import {ExcludeService} from '../exclude/exclude.service';
import {OpenBDService} from '../openbd/openbd.service';
import {RakutenService} from '../rakuten/rakuten.service';
import {RedisCacheService} from '../redis-cache/redis-cache.service';
import {BooksConfig} from './books.config';

@Injectable()
export class BooksService {
  constructor(
    @Inject(BooksConfig.KEY)
    private config: ConfigType<typeof BooksConfig>,
    private cache: RedisCacheService,

    private readonly excludeService: ExcludeService,

    private readonly oepnBDService: OpenBDService,
    private readonly rakutenService: RakutenService,
  ) {}

  async getFromISBN(isbn: string): Promise<string | null> {
    const dehyphenized = isbn.replace(/-/g, '');
    const cachedKey = `isbn:${dehyphenized}`;

    const cached = await this.cache.get<string>(cachedKey);
    if (cached) return cached;

    const openBD = await this.oepnBDService.getBookCover(dehyphenized);
    if (openBD && !(await this.excludeService.canExcludeFromUrl(openBD))) {
      await this.cache.set(cachedKey, openBD);
      return openBD;
    }

    const rakuten = await this.rakutenService.getBookCover(dehyphenized);
    if (rakuten && !(await this.excludeService.canExcludeFromUrl(rakuten))) {
      await this.cache.set(cachedKey, rakuten);
      return rakuten;
    }

    return null;
  }

  async getCover({isbn}: {isbn?: string}): Promise<string | null> {
    return (isbn && (await this.getFromISBN(isbn))) || null;
  }

  urlProxy(url: string): string {
    return new URL(`/${url}`, this.config.imageproxyBaseUrl).toString();
  }
}
