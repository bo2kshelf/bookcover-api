import {HttpService, Inject, Injectable} from '@nestjs/common';
import {ConfigType} from '@nestjs/config';
import openbdConfig from './openbd.config';

export interface APIPayload {
  summary: {
    isbn: string;
    cover?: string;
  };
}

@Injectable()
export class OpenBDService {
  constructor(
    @Inject(openbdConfig.KEY)
    private configService: ConfigType<typeof openbdConfig>,

    private readonly httpService: HttpService,
  ) {}

  async getBookCover(isbn: string): Promise<string | null> {
    return this.httpService
      .get<(APIPayload | null)[]>(this.configService.endpoint, {
        params: {isbn},
      })
      .toPromise()
      .then(({data}) => data?.[0]?.summary.cover || null);
  }
}
