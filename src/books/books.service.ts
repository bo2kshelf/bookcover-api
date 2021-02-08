import {Injectable} from '@nestjs/common';
import {OpenBDService} from '../openbd/openbd.service';
import {RakutenService} from '../rakuten/rakuten.service';
import {RedisCacheService} from '../redis-cache/redis-cache.service';

@Injectable()
export class BooksService {
  constructor(
    private cache: RedisCacheService,

    private readonly oepnBDService: OpenBDService,
    private readonly rakutenService: RakutenService,
  ) {}

  async getFromISBN(isbn: string): Promise<string | null> {
    const key = isbn.replace(/-/g, '');

    const cached = await this.cache.get<string>(key);
    if (cached) {
      await this.cache.set(key, cached);
      return cached;
    }

    const openBD = await this.oepnBDService.getBookCover(key);
    if (openBD) {
      await this.cache.set(key, openBD);
      return openBD;
    }

    const rakuten = await this.rakutenService.getBookCover(key);
    if (rakuten) {
      await this.cache.set(key, rakuten);
      return rakuten;
    }

    return null;
  }

  async getCover({isbn}: {isbn?: string}): Promise<string | null> {
    return (isbn && (await this.getFromISBN(isbn))) || null;
  }
}
