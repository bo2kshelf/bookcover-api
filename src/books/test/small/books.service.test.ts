import {Test, TestingModule} from '@nestjs/testing';
import {ExcludeService} from '../../../exclude/exclude.service';
import {OpenBDService} from '../../../openbd/openbd.service';
import {RakutenService} from '../../../rakuten/rakuten.service';
import {RedisCacheService} from '../../../redis-cache/redis-cache.service';
import {BooksService} from '../../books.service';

jest.mock('../../../openbd/openbd.service');
jest.mock('../../../rakuten/rakuten.service');
jest.mock('../../../exclude/exclude.service');
jest.mock('../../../redis-cache/redis-cache.service');

describe(BooksService.name, () => {
  let module: TestingModule;

  let booksService: BooksService;

  let cacheManager: RedisCacheService;
  let excludeService: ExcludeService;
  let openbdService: OpenBDService;
  let rakutenService: RakutenService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        RedisCacheService,
        ExcludeService,
        BooksService,
        OpenBDService,
        RakutenService,
      ],
    }).compile();

    booksService = module.get<BooksService>(BooksService);

    cacheManager = module.get<RedisCacheService>(RedisCacheService);
    excludeService = module.get<ExcludeService>(ExcludeService);
    openbdService = module.get<OpenBDService>(OpenBDService);
    rakutenService = module.get<RakutenService>(RakutenService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(booksService).toBeDefined();
  });

  describe('getCover()', () => {
    it.each([
      [
        // openBDを優先
        'https://cover.openbd.jp/9784781618968.jpg',
        'https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/2460/9784832272460.jpg',
        'https://cover.openbd.jp/9784781618968.jpg',
      ],
      [
        null,
        'https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/2460/9784832272460.jpg',
        'https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/2460/9784832272460.jpg',
      ],
      [
        'https://cover.openbd.jp/9784781618968.jpg',
        null,
        'https://cover.openbd.jp/9784781618968.jpg',
      ],
      [null, null, null],
    ])('未キャッシュ(%#)', async (openBD, rakuten, expected) => {
      jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(undefined);
      jest.spyOn(excludeService, 'canExcludeFromUrl').mockResolvedValue(false);

      const set = jest.fn((isbn, result) => result);
      jest.spyOn(cacheManager, 'set').mockImplementationOnce(set);

      jest.spyOn(openbdService, 'getBookCover').mockResolvedValueOnce(openBD);
      jest.spyOn(rakutenService, 'getBookCover').mockResolvedValueOnce(rakuten);

      const actual = await booksService.getCover({isbn: '9784781618968'});

      expect(actual).toBe(expected);
      if (expected) expect(set).toHaveBeenCalled();
    });

    it('キャッシュ済み', async () => {
      const expected = 'https://cover.openbd.jp/9784781618968.jpg';

      jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(expected);

      const set = jest.fn();
      jest.spyOn(cacheManager, 'set').mockImplementationOnce(set);

      const actual = await booksService.getCover({isbn: '9784781618968'});

      expect(actual).toBe(expected);
    });
  });
});
