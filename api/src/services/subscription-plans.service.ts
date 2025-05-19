import { Injectable } from '@nestjs/common';

import { CreateSubscriptionPlanDto } from 'src/dto/subscription-plan/create-subscription-plan.dto';
import { UpdateSubscriptionPlanDto } from 'src/dto/subscription-plan/update-subscription-plan.dto';

@Injectable()
export class SubscriptionPlansService {
  create(createSubscriptionPlanDto: CreateSubscriptionPlanDto) {
    return 'This action adds a new subscriptionPlan';
  }

  findAll() {
    return `This action returns all subscriptionPlans`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subscriptionPlan`;
  }

  update(id: number, updateSubscriptionPlanDto: UpdateSubscriptionPlanDto) {
    return `This action updates a #${id} subscriptionPlan`;
  }

  remove(id: number) {
    return `This action removes a #${id} subscriptionPlan`;
  }
}
