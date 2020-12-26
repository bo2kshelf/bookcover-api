import {HttpService} from '@nestjs/common';
import {Test, TestingModule} from '@nestjs/testing';
import {of} from 'rxjs';
import openbdConfig from '../../openbd.config';
import {OpenBDService} from '../../openbd.service';

describe(OpenBDService.name, () => {
  let module: TestingModule;

  let httpService: HttpService;
  let openBDService: OpenBDService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        OpenBDService,
        {
          provide: openbdConfig.KEY,
          useValue: {endpoint: ''},
        },
        {
          provide: HttpService,
          useValue: {get() {}},
        },
      ],
    }).compile();

    httpService = module.get<HttpService>(HttpService);
    openBDService = module.get<OpenBDService>(OpenBDService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(openBDService).toBeDefined();
  });

  describe('getBookCover()', () => {
    it('openBD側から正常な値を取得出来た場合それを返す', async () => {
      jest.spyOn(httpService, 'get').mockImplementationOnce(() =>
        of({
          headers: {},
          config: {},
          status: 200,
          statusText: 'OK',
          data: [
            {
              summary: {
                isbn: '9784781618968',
                cover: 'https://cover.openbd.jp/9784781618968.jpg',
              },
            },
          ],
        }),
      );

      const actual = await openBDService.getBookCover('9784781618968');
      expect(actual).toBe('https://cover.openbd.jp/9784781618968.jpg');
    });

    it('openBD側からcoverにnullが入っていた場合nullを返す', async () => {
      jest.spyOn(httpService, 'get').mockImplementationOnce(() =>
        of({
          headers: {},
          config: {},
          status: 200,
          statusText: 'OK',
          data: [
            {
              summary: {
                isbn: '9784781618968',
                cover: null,
              },
            },
          ],
        }),
      );

      const actual = await openBDService.getBookCover('9784781618968');
      expect(actual).toBeNull();
    });

    it('openBD側からnull配列が返ってきた場合nullを返す', async () => {
      jest.spyOn(httpService, 'get').mockImplementationOnce(() =>
        of({
          headers: {},
          config: {},
          status: 200,
          statusText: 'OK',
          data: [null],
        }),
      );

      const actual = await openBDService.getBookCover('9784781618968');
      expect(actual).toBeNull();
    });
  });
});
