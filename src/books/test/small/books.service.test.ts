import {Test, TestingModule} from '@nestjs/testing';
import {ExcludeService} from '../../../exclude/exclude.service';
import {GoogleAPIsService} from '../../../googleapis/googleapis.service';
import {OpenBDService} from '../../../openbd/openbd.service';
import {RakutenService} from '../../../rakuten/rakuten.service';
import {RedisCacheService} from '../../../redis-cache/redis-cache.service';
import {BooksConfig} from '../../books.config';
import {BooksService} from '../../books.service';

jest.mock('../../../openbd/openbd.service');
jest.mock('../../../rakuten/rakuten.service');
jest.mock('../../../googleapis/googleapis.service');

jest.mock('../../../exclude/exclude.service');
jest.mock('../../../redis-cache/redis-cache.service');

describe(BooksService.name, () => {
  let module: TestingModule;

  let booksService: BooksService;

  let cacheManager: RedisCacheService;
  let excludeService: ExcludeService;

  let openbdService: OpenBDService;
  let rakutenService: RakutenService;
  let googleApisService: GoogleAPIsService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        {
          provide: BooksConfig.KEY,
          useValue: {imageproxyBaseUrl: `http://localhost:8080`},
        },
        RedisCacheService,
        ExcludeService,
        BooksService,
        OpenBDService,
        RakutenService,
        GoogleAPIsService,
      ],
    }).compile();

    booksService = module.get<BooksService>(BooksService);

    cacheManager = module.get<RedisCacheService>(RedisCacheService);
    excludeService = module.get<ExcludeService>(ExcludeService);

    openbdService = module.get<OpenBDService>(OpenBDService);
    rakutenService = module.get<RakutenService>(RakutenService);
    googleApisService = module.get<GoogleAPIsService>(GoogleAPIsService);
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
      [{openBD: 'openBD'}, 'openBD'],
      [{rakuten: 'rakuten'}, 'rakuten'],
      [{googleAPIs: 'googleAPIs'}, 'googleAPIs'],
      [
        {openBD: 'openBD', rakuten: 'rakuten', googleAPIs: 'googleAPIs'},
        'openBD',
      ],
      [{rakuten: 'rakuten', googleAPIs: 'googleAPIs'}, 'rakuten'],
      [{}, null],
    ])(
      '未キャッシュ(%#)',
      async (
        mock: {openBD?: string; rakuten?: string; googleAPIs?: string},
        expected,
      ) => {
        jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(undefined);
        jest
          .spyOn(excludeService, 'canExcludeFromUrl')
          .mockResolvedValue(false);

        const set = jest.fn((isbn, result) => result);
        jest.spyOn(cacheManager, 'set').mockImplementationOnce(set);

        jest
          .spyOn(openbdService, 'getBookCover')
          .mockResolvedValueOnce(mock.openBD || null);
        jest
          .spyOn(rakutenService, 'getBookCover')
          .mockResolvedValueOnce(mock.rakuten || null);
        jest
          .spyOn(googleApisService, 'getBookCover')
          .mockResolvedValueOnce(mock.googleAPIs || null);

        const actual = await booksService.getCover({isbn: '9784781618968'});

        expect(actual).toBe(expected);
        if (expected) expect(set).toHaveBeenCalled();
      },
    );

    it('キャッシュ済み', async () => {
      const expected = 'openBD';

      jest.spyOn(cacheManager, 'get').mockResolvedValueOnce(expected);

      const set = jest.fn();
      jest.spyOn(cacheManager, 'set').mockImplementationOnce(set);

      const actual = await booksService.getCover({isbn: '9784781618968'});

      expect(actual).toBe(expected);
    });
  });
});
