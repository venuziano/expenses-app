import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

import { CreateSubscriptionPlanDto } from 'src/dto/subscription-plan/create-subscription-plan.dto';
import { UpdateSubscriptionPlanDto } from 'src/dto/subscription-plan/update-subscription-plan.dto';
import { SubscriptionPlansService } from 'src/services/subscription-plans.service';

@Controller('subscription-plans')
export class SubscriptionPlansController {
  constructor(
    private readonly subscriptionPlansService: SubscriptionPlansService,
  ) {}

  @Post()
  create(@Body() createSubscriptionPlanDto: CreateSubscriptionPlanDto) {
    return this.subscriptionPlansService.create(createSubscriptionPlanDto);
  }

  @Get()
  findAll() {
    return this.subscriptionPlansService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subscriptionPlansService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubscriptionPlanDto: UpdateSubscriptionPlanDto,
  ) {
    return this.subscriptionPlansService.update(+id, updateSubscriptionPlanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subscriptionPlansService.remove(+id);
  }
}
