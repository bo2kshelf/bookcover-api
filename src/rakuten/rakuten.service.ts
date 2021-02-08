import {HttpService, Inject, Injectable} from '@nestjs/common';
import {ConfigType} from '@nestjs/config';
import {RakutenConfig} from './rakuten.config';

@Injectable()
export class RakutenService {
  constructor(
    @Inject(RakutenConfig.KEY)
    private configService: ConfigType<typeof RakutenConfig>,
    private readonly httpService: HttpService,
  ) {}

  async getBookCover(isbn: string): Promise<string | null> {
    return this.httpService
      .get(this.configService.endpoint, {
        params: {
          format: 'json',
          applicationId: this.configService.applicationId,
          isbn,
          booksGenreId: '001',
        },
      })
      .toPromise()
      .then(({data}) => {
        const url: string | null =
          data?.Items?.[0]?.Item?.largeImageUrl ||
          data?.Items?.[0]?.Item?.mediumImageUrl ||
          data?.Items?.[0]?.Item?.smallImageUrl ||
          null;
        if (!url) return null;

        const parsedURL = new URL(url);
        parsedURL.search = '';
        return parsedURL.toString();
      })
      .catch(() => null);
  }
}
