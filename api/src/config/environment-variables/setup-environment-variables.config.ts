import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      cache: true,
      validationSchema: Joi.object({
        API_PORT: Joi.number().required(),
        PG_TYPE: Joi.string().required(),
        HOST: Joi.string().required(),
        PG_PORT: Joi.number().required(),
        DB_USER: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_USE_SSL: Joi.boolean().required(),
        DATABASE: Joi.string().required(),
        TWILIO_ACCOUNT_SID: Joi.string().required(),
        TWILIO_AUTH_TOKEN: Joi.string().required(),
        WHATSAPP_TOKEN: Joi.string().required(),
        WHATSAPP_VERIFY_TOKEN: Joi.string().required(),
        WHATSAPP_PHONE_NUMBER_ID: Joi.number().required(),
      }),
    }),
  ],
})
export class AppModule {}
