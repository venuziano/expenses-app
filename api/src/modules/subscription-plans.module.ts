import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SubscriptionPlansController } from 'src/controllers/subscription-plans.controller';
import { SubscriptionPlan } from 'src/entities/subscription-plan.entity';
import { SubscriptionPlansService } from 'src/services/subscription-plans.service';

@Module({
  imports: [TypeOrmModule.forFeature([SubscriptionPlan])],
  controllers: [SubscriptionPlansController],
  providers: [SubscriptionPlansService],
})
export class SubscriptionPlansModule {}
