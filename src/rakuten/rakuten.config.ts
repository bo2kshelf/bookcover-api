import {registerAs} from '@nestjs/config';

export const RakutenConfig = registerAs('rakuten', () => ({
  endpoint: `https://app.rakuten.co.jp/services/api/BooksBook/Search/20170404`,
  applicationId: process.env.RAKUTEN_APPLICATION_ID,
}));
