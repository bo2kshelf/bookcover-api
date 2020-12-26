import {Test, TestingModule} from '@nestjs/testing';
import {OpenBDService} from '../../../openbd/openbd.service';
import {BooksService} from '../../books.service';

describe(BooksService.name, () => {
  let module: TestingModule;

  let booksService: BooksService;

  let openbdService: OpenBDService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: OpenBDService,
          useValue: {
            getBookCover() {},
          },
        },
      ],
    }).compile();

    booksService = module.get<BooksService>(BooksService);
    openbdService = module.get<OpenBDService>(OpenBDService);
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
    it('OpenBDServiceが正常な値を返却した場合それを返す', async () => {
      jest
        .spyOn(openbdService, 'getBookCover')
        .mockResolvedValueOnce('https://cover.openbd.jp/9784781618968.jpg');

      const actual = await booksService.getCover({isbn: '9784781618968'});
      expect(actual).toBe('https://cover.openbd.jp/9784781618968.jpg');
    });

    it('OpenBDServiceがnullを返却した場合nullを返す', async () => {
      jest.spyOn(openbdService, 'getBookCover').mockResolvedValueOnce(null);

      const actual = await booksService.getCover({isbn: '9784781618968'});
      expect(actual).toBeNull();
    });
  });
});
