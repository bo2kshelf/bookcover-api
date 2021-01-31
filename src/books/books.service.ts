import {CACHE_MANAGER, Inject, Injectable} from '@nestjs/common';
import {Cache} from 'cache-manager';
import {promisify} from 'util';
import {OpenBDService} from '../openbd/openbd.service';
import {RakutenService} from '../rakuten/rakuten.service';

@Injectable()
export class BooksService {
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,

    private readonly oepnBDService: OpenBDService,
    private readonly rakutenService: RakutenService,
  ) {}

  async getCachedByISBN(isbn: string): Promise<string | null> {
    return promisify<string, string | undefined>(this.cacheManager.get)(isbn)
      .then((value) => value || null)
      .catch(() => null);
  }

  async getCover({isbn}: {isbn?: string}): Promise<string | null> {
    if (isbn) {
      const cached = await this.getCachedByISBN(isbn);
      if (cached) return cached;

      const fetched =
        (await this.oepnBDService.getBookCover(isbn)) ||
        (await this.rakutenService.getBookCover(isbn)) ||
        null;

      if (fetched)
        return this.cacheManager.set(isbn, fetched, {ttl: 60 * 60 * 24 * 7});
    }
    return null;
  }
}
