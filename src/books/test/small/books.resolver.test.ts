import {Test, TestingModule} from '@nestjs/testing';
import {BooksResolver} from '../../books.resolver';
import {BooksService} from '../../books.service';

jest.mock('../../books.service');

describe(BooksResolver.name, () => {
  let module: TestingModule;

  let booksResolver: BooksResolver;

  let booksService: BooksService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [BooksResolver, BooksService],
    }).compile();

    booksResolver = module.get<BooksResolver>(BooksResolver);

    booksService = module.get<BooksService>(BooksService);
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

  describe('cover()', () => {
    let urlProxyMockFn: jest.Mock;
    beforeEach(() => {
      urlProxyMockFn = jest.fn((url: string): string => url);
      jest.spyOn(booksService, 'urlProxy').mockImplementation(urlProxyMockFn);
    });

    it('BooksServiceが正常な値を返却した場合それを返す', async () => {
      jest
        .spyOn(booksService, 'getCover')
        .mockResolvedValueOnce('https://cover.openbd.jp/9784781618968.jpg');

      const actual = await booksResolver.cover({
        title: 'ダンピアのおいしい冒険(1)',
        isbn: '9784781618968',
      });
      expect(actual).toBe('https://cover.openbd.jp/9784781618968.jpg');
      expect(urlProxyMockFn).toHaveBeenCalled();
    });

    it('BooksServiceがnullを返却した場合nullを返す', async () => {
      jest.spyOn(booksService, 'getCover').mockResolvedValueOnce(null);

      const actual = await booksResolver.cover({
        title: 'ダンピアのおいしい冒険(1)',
        isbn: '9784781618968',
      });
      expect(actual).toBeNull();
      expect(urlProxyMockFn).not.toHaveBeenCalled();
    });
  });
});
