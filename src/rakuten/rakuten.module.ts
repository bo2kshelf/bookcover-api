import {HttpModule, Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {RakutenConfig} from './rakuten.config';
import {RakutenService} from './rakuten.service';

@Module({
  imports: [ConfigModule.forFeature(RakutenConfig), HttpModule],
  providers: [RakutenService],
  exports: [RakutenService],
})
export class RakutenModule {}
