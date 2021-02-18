import {HttpService} from '@nestjs/common';
import {Test, TestingModule} from '@nestjs/testing';
import {of} from 'rxjs';
import {RakutenConfig} from '../../rakuten.config';
import {RakutenService} from '../../rakuten.service';

describe(RakutenService.name, () => {
  let module: TestingModule;

  let httpService: HttpService;
  let rakutenService: RakutenService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        RakutenService,
        {
          provide: RakutenConfig.KEY,
          useValue: {
            endpoint: `https://app.rakuten.co.jp/services/api/BooksBook/Search/20170404`,
            applicationId: 'example',
          },
        },
        {
          provide: HttpService,
          useValue: {get() {}},
        },
      ],
    }).compile();

    httpService = module.get<HttpService>(HttpService);
    rakutenService = module.get<RakutenService>(RakutenService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(rakutenService).toBeDefined();
  });

  describe('getBookCover()', () => {
    it('楽天API側から正常な値を取得出来た場合それを返す', async () => {
      jest.spyOn(httpService, 'get').mockImplementationOnce(() =>
        of({
          headers: {},
          config: {},
          status: 200,
          statusText: 'OK',
          data: {
            Items: [
              {
                Item: {
                  largeImageUrl:
                    'https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/2460/9784832272460.jpg?_ex=200x200',
                  mediumImageUrl:
                    'https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/2460/9784832272460.jpg?_ex=120x120',
                  smallImageUrl:
                    'https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/2460/9784832272460.jpg?_ex=64x64',
                },
              },
            ],
          },
        }),
      );

      const actual = await rakutenService.getBookCover('9784832272460');
      expect(actual).toBe(
        'https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/2460/9784832272460.jpg',
      );
    });

    it.each([
      [400, 'Bad Request'],
      [404, 'Not Found'],
      [429, 'Too Many Requests'],
      [500, 'Internal Server Error'],
      [503, 'Service Unavailable'],
    ])(
      '楽天API側から%iエラーが返ってきた場合はnullを返す',
      async (status, statusText) => {
        jest.spyOn(httpService, 'get').mockImplementationOnce(() =>
          of({
            headers: {},
            config: {},
            status,
            statusText,
            data: {},
          }),
        );

        const actual = await rakutenService.getBookCover('9784832272460');
        expect(actual).toBeNull();
      },
    );
  });
});
