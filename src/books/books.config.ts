import {registerAs} from '@nestjs/config';

export const BooksConfig = registerAs('books', () => ({
  imageproxy: {url: process.env.IMAGEPROXY_URL!},
}));
