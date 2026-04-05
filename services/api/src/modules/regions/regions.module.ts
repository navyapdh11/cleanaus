import { Module } from '@nestjs/common';
import { RegionsController } from './regions.controller';
import { RegionsService } from './regions.service';

@Module({
  // TypeORM disabled for demo mode
  controllers: [RegionsController],
  providers: [RegionsService],
  exports: [RegionsService],
})
export class RegionsModule {}
