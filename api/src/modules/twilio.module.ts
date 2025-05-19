import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';

import { TwilioWebhookController } from 'src/controllers/twilio.controller';
import { ExpenseModule } from './expense.module';
import { UsersModule } from './users.module';

@Global()
@Module({
  imports: [ConfigModule, ExpenseModule, UsersModule],
  providers: [
    {
      provide: 'TWILIO_CLIENT',
      useFactory: (cfg: ConfigService) =>
        new Twilio(cfg.get('TWILIO_ACCOUNT_SID'), cfg.get('TWILIO_AUTH_TOKEN')),
      inject: [ConfigService],
    },
  ],
  exports: ['TWILIO_CLIENT'],
  controllers: [TwilioWebhookController],
})
export class TwilioModule {}
