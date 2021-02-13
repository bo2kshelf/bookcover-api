import {registerAs} from '@nestjs/config';

export const GoogleAPIsConfig = registerAs('googleapis', () => ({
  endpoint: `https://www.googleapis.com/books/v1/volumes`,
}));
