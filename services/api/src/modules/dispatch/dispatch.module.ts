import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DispatchController } from './dispatch.controller';
import { DispatchService } from './dispatch.service';
import { DispatchAssignmentEntity } from './entities/dispatch-assignment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DispatchAssignmentEntity])],
  controllers: [DispatchController],
  providers: [DispatchService],
  exports: [DispatchService],
})
export class DispatchModule {}
