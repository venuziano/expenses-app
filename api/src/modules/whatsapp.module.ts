import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

import { ExpenseModule } from './expense.module';
import { WhatsAppService } from 'src/services/whatsapp.service';
import { WhatsAppWebhookController } from 'src/controllers/whatsapp.controller';
import { UsersModule } from './users.module';

@Global()
@Module({
  imports: [ConfigModule, HttpModule, ExpenseModule, UsersModule],
  providers: [WhatsAppService],
  controllers: [WhatsAppWebhookController],
  exports: [WhatsAppService],
})
export class WhatsAppModule {}
