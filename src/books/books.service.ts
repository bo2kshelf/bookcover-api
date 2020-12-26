import {Injectable} from '@nestjs/common';
import {OpenBDService} from '../openbd/openbd.service';

@Injectable()
export class BooksService {
  constructor(private readonly oepnBDService: OpenBDService) {}

  async getCover({isbn}: {isbn?: string}): Promise<string | null> {
    if (isbn) return this.oepnBDService.getBookCover(isbn);
    return null;
  }
}
