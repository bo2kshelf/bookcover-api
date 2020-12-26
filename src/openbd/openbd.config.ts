import {registerAs} from '@nestjs/config';

export default registerAs('oepnbd', () => ({
  endpoint: process.env.OPENBD_API_ENDPOINT || 'https://api.openbd.jp/v1/get',
}));
