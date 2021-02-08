import {registerAs} from '@nestjs/config';

export const ExcludeConfig = registerAs('exclude', () => ({
  minPercentageSizePerDataSize: 7.5 / 100,
  ttl: 60 * 60 * 24,
}));
