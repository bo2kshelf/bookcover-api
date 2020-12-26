import {HttpModule, Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import openbdConfig from './openbd.config';
import {OpenBDService} from './openbd.service';

@Module({
  imports: [ConfigModule.forFeature(openbdConfig), HttpModule],
  providers: [OpenBDService],
  exports: [OpenBDService],
})
export class OpenBDModule {}
