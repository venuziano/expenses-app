import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users.module';
import { DatabaseModule } from './database/database.module';
import { SubscriptionPlansModule } from './modules/subscription-plans.module';
import { SubscriptionModule } from './modules/subscription.module';
import { CategoryModule } from './modules/category.module';
import { ExpenseModule } from './modules/expense.module';
import { TwilioModule } from './modules/twilio.module';
import { WhatsAppModule } from './whatsapp/whatsapp.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    SubscriptionPlansModule,
    SubscriptionModule,
    CategoryModule,
    ExpenseModule,
    TwilioModule,
    WhatsAppModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
