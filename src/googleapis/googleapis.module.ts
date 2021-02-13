import {HttpModule, Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {GoogleAPIsConfig} from './googleapis.config';
import {GoogleAPIsService} from './googleapis.service';

@Module({
  imports: [ConfigModule.forFeature(GoogleAPIsConfig), HttpModule],
  providers: [GoogleAPIsService],
  exports: [GoogleAPIsService],
})
export class GoogleAPIsModule {}
