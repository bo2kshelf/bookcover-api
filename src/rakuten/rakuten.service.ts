import {HttpService, Inject, Injectable} from '@nestjs/common';
import {ConfigType} from '@nestjs/config';
import {stringify} from 'querystringify';
import {RakutenConfig} from './rakuten.config';

@Injectable()
export class RakutenService {
  constructor(
    @Inject(RakutenConfig.KEY)
    private configService: ConfigType<typeof RakutenConfig>,
    private readonly httpService: HttpService,
  ) {}

  async getBookCover(isbn: string): Promise<string | null> {
    const query = stringify(
      {
        format: 'json',
        isbn,
        booksGenreId: '001',
        applicationId: this.configService.applicationId,
      },
      true,
    );
    return this.httpService
      .get(
        `https://app.rakuten.co.jp/services/api/BooksBook/Search/20170404${query}`,
      )
      .toPromise()
      .then(({data}) => {
        return (
          data?.Items?.[0]?.Item?.largeImageUrl ||
          data?.Items?.[0]?.Item?.mediumImageUrl ||
          data?.Items?.[0]?.Item?.smallImageUrl ||
          null
        );
      })
      .catch(() => null);
  }
}
