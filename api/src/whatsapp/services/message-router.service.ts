import { Injectable, Inject } from '@nestjs/common';

import { MessageHandler } from 'src/interfaces/whatsapp-message-handler.interface';

@Injectable()
export class MessageRouterService {
  constructor(
    @Inject('WHATSAPP_HANDLERS')
    private readonly handlers: MessageHandler[],
  ) {}

  async route(text: string, userId: number): Promise<string> {
    const handler = this.handlers.find((h) => h.canHandle(text));
    if (!handler) {
      return '❓ Desculpe, não entendi. Tente “gastei 50 em uber” ou “quanto eu gastei de mercado hoje?”.';
    }
    return handler.handle(text, userId);
  }
}
