import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Res,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

import { ExpenseService } from 'src/services/expense.service';
import { WhatsAppService } from 'src/whatsapp/services/whatsapp.service';
import { AppEnvConfigService } from 'src/config/environment-variables/app-env.config';
import { UsersService } from 'src/services/users.service';
import { MessageRouterService } from './services/message-router.service';

class WebhookVerifyDto {
  'hub.mode': string;
  'hub.verify_token': string;
  'hub.challenge': string;
}

class WhatsAppWebhookBody {
  entry: Array<{
    changes: Array<{
      value: {
        messages?: Array<{
          from: string; // e.g. "5511999990000"
          text?: { body: string };
        }>;
      };
    }>;
  }>;
}

@Controller('whatsapp')
export class WhatsAppWebhookController {
  private readonly logger = new Logger(WhatsAppWebhookController.name);

  constructor(
    private readonly expenseService: ExpenseService,
    private readonly userService: UsersService,
    private readonly whatsappService: WhatsAppService,
    private readonly messageRouterService: MessageRouterService,
    private readonly config: AppEnvConfigService,
  ) {}

  /** Verification handshake */
  @Get()
  verify(@Query() query: WebhookVerifyDto, @Res() res: Response) {
    if (
      query['hub.mode'] === 'subscribe' &&
      query['hub.verify_token'] === this.config.whatsappVerifyToken
    ) {
      this.logger.log('Webhook verified');
      return res.status(200).send(query['hub.challenge']);
    } else {
      return res.status(403).send('Forbidden');
    }
  }

  /** Incoming messages */
  @Post()
  async receive(@Body() body: WhatsAppWebhookBody, @Res() res: Response) {
    const changes = body.entry?.[0]?.changes?.[0]?.value;
    const msg = changes?.messages?.[0];
    if (!msg || !msg.text) {
      return res.sendStatus(200); // nothing to do
    }

    const from = `whatsapp:${msg.from}`; // restore the prefix
    const text = msg.text.body.trim();
    console.log('from', from);
    this.logger.log(`Incoming WhatsApp from ${from}: "${text}"`);

    const user = await this.userService.findByWhatsAppNumber(from);

    if (!user) throw new Error('User not found');

    try {
      // await this.expenseService.create(dto);
      // 2) Acknowledge
      await this.messageRouterService.route(text, user.id);
      await this.whatsappService.sendText(from, '✅ Expense recorded!');
    } catch (e) {
      this.logger.error('Error saving expense', e);
      await this.whatsappService.sendText(
        from,
        '❌ Oops, something went wrong.',
      );
    }

    return res.sendStatus(200);
  }
}
