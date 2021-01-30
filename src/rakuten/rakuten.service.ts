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
          isbn: isbn.replace(/-/g, ''),
          booksGenreId: '001',
        },
      })
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
