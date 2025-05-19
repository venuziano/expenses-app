import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

import { AppEnvConfigService } from 'src/config/environment-variables/app-env.config';
import { formatWhatsappNumber } from 'src/helpers/whatsappNumberHelper';

@Injectable()
export class WhatsAppService {
  private readonly logger = new Logger(WhatsAppService.name);
  private token: string;
  private phoneNumberId: string;
  private apiUrl: string;
  private readonly apiVersion = 'v22.0';

  constructor(
    private readonly http: HttpService,
    private readonly config: AppEnvConfigService,
  ) {
    this.token = this.config.whatsappToken!;
    this.phoneNumberId = this.config.whatsappPhoneNumberID!;
    this.apiUrl = `https://graph.facebook.com/${this.apiVersion}/${this.phoneNumberId}/messages`;
  }

  async sendText(to: string, text: string) {
    const payload = {
      messaging_product: 'whatsapp',
      to: formatWhatsappNumber(to),
      text: { body: text },
    };

    const headers = {
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    };

    try {
      const resp = await lastValueFrom(
        this.http.post(this.apiUrl, payload, { headers }),
      );
      this.logger.log(`WhatsApp sent to ${to}: ${resp.data.messages[0].id}`);
    } catch (err) {
      this.logger.error('Failed to send WhatsApp message', err);
    }
  }
}
