import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PricingController } from './pricing.controller';
import { PricingService } from './pricing.service';
import { PricingRuleEntity } from './entities/pricing-rule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PricingRuleEntity])],
  controllers: [PricingController],
  providers: [PricingService],
  exports: [PricingService],
})
export class PricingModule {}
