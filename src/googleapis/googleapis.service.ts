import {HttpService, Inject, Injectable} from '@nestjs/common';
import {ConfigType} from '@nestjs/config';
import {GoogleAPIsConfig} from './googleapis.config';

export interface APIPayload {
  items?: {
    volumeInfo?: {
      imageLinks?: {
        smallThumbnail?: string;
        thumbnail?: string;
      };
    };
  }[];
}

@Injectable()
export class GoogleAPIsService {
  constructor(
    @Inject(GoogleAPIsConfig.KEY)
    private configService: ConfigType<typeof GoogleAPIsConfig>,
    private readonly httpService: HttpService,
  ) {}

  async getBookCover(isbn: string): Promise<string | null> {
    return this.httpService
      .get<APIPayload>(this.configService.endpoint, {
        params: {
          // eslint-disable-next-line id-length
          q: `isbn:${isbn}`,
        },
      })
      .toPromise()
      .then(({data}) => {
        return (
          data?.items?.[0]?.volumeInfo?.imageLinks?.thumbnail ||
          data?.items?.[0]?.volumeInfo?.imageLinks?.smallThumbnail ||
          null
        );
      })
      .catch(() => null);
  }
}
