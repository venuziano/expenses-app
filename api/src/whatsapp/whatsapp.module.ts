import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

import { ExpenseModule } from '../modules/expense.module';
import { WhatsAppService } from 'src/whatsapp/services/whatsapp.service';
import { WhatsAppWebhookController } from 'src/whatsapp/whatsapp.controller';
import { UsersModule } from '../modules/users.module';
// import { ExpenseService } from 'src/services/expense.service';
// import { UsersService } from 'src/services/users.service';
import { MessageRouterService } from './services/message-router.service';
import { ExpenseEntryHandler } from './handlers/expense-entry.handler';
import { SpendQueryHandler } from './handlers/spend-query.handler';
import { CategoryModule } from 'src/modules/category.module';

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    ExpenseModule,
    UsersModule,
    CategoryModule,
  ],
  controllers: [WhatsAppWebhookController],
  providers: [
    // ExpenseService,
    // UsersService,
    WhatsAppService,
    MessageRouterService,
    ExpenseEntryHandler,
    SpendQueryHandler,
    {
      provide: 'WHATSAPP_HANDLERS',
      useFactory: (
        expenseEntry: ExpenseEntryHandler,
        spendQuery: SpendQueryHandler,
      ) => [expenseEntry, spendQuery],
      inject: [ExpenseEntryHandler, SpendQueryHandler],
    },
  ],
})
export class WhatsAppModule {}
