import {registerAs} from '@nestjs/config';

export const BooksConfig = registerAs('books', () => ({
  imageproxyBaseUrl: process.env.IMAGEPROXY_BASE_URL!,
}));
