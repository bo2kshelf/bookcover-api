import {Test, TestingModule} from '@nestjs/testing';
import {OpenBDService} from '../../../openbd/openbd.service';
import {RakutenService} from '../../../rakuten/rakuten.service';
import {BooksService} from '../../books.service';

jest.mock('../../../openbd/openbd.service');
jest.mock('../../../rakuten/rakuten.service');

describe(BooksService.name, () => {
  let module: TestingModule;

  let booksService: BooksService;

  let openbdService: OpenBDService;
  let rakutenService: RakutenService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [BooksService, OpenBDService, RakutenService],
    }).compile();

    booksService = module.get<BooksService>(BooksService);
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
    ])('%#', async (openBD, rakuten, expected) => {
      jest.spyOn(openbdService, 'getBookCover').mockResolvedValueOnce(openBD);
      jest.spyOn(rakutenService, 'getBookCover').mockResolvedValueOnce(rakuten);

      const actual = await booksService.getCover({isbn: '9784781618968'});
      expect(actual).toBe(expected);
    });
  });
});
