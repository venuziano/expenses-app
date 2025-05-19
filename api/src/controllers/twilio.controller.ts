import { Controller, Post, Res, Logger, Body } from '@nestjs/common';
import { Response } from 'express';
import { twiml } from 'twilio';

import { ExpenseService } from 'src/services/expense.service';
import { CreateExpenseDto } from 'src/dto/expense/create-expense.dto';
import { UsersService } from 'src/services/users.service';

export class TwilioWebhookDto {
  From: string;
  Body: string;
  // you can add other Twilio payload fields here if needed
}

@Controller('twilio')
export class TwilioWebhookController {
  private readonly logger = new Logger(TwilioWebhookController.name);

  constructor(
    private readonly expensesService: ExpenseService,
    private readonly usersService: UsersService,
  ) {}

  @Post('webhook')
  async handleIncoming(
    @Body() payload: TwilioWebhookDto,
    @Res() res: Response,
  ) {
    const from = payload.From;
    const body = payload.Body;
    console.log('from', from);
    console.log('body', body);
    this.logger.log(`Incoming WhatsApp from ${from}: "${body}"`);

    const user = await this.usersService.findByWhatsAppNumber(from);

    const dto: CreateExpenseDto = { message: body, userId: user!.id };

    try {
      await this.expensesService.create(dto);
    } catch (err) {
      this.logger.error('Error processing expense', err);
    }

    const reply = new twiml.MessagingResponse();
    reply.message(
      `👍 Entendi, ${user!.firstname}! Sua despesa foi registrada com sucesso.`,
    );
    return res.type('text/xml').send(reply.toString());
  }
}
