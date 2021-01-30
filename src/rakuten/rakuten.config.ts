import {registerAs} from '@nestjs/config';

export const RakutenConfig = registerAs('rakuten', () => ({
  applicationId: process.env.RAKUTEN_APPLICATION_ID,
}));
