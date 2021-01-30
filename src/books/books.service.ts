import {Injectable} from '@nestjs/common';
import {OpenBDService} from '../openbd/openbd.service';
import {RakutenService} from '../rakuten/rakuten.service';

@Injectable()
export class BooksService {
  constructor(
    private readonly oepnBDService: OpenBDService,
    private readonly rakutenService: RakutenService,
  ) {}

  async getCover({isbn}: {isbn?: string}): Promise<string | null> {
    if (isbn) {
      return (
        (await this.oepnBDService.getBookCover(isbn)) ||
        this.rakutenService.getBookCover(isbn)
      );
    }
    return null;
  }
}
