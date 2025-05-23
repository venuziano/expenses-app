import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppEnvConfigService } from 'src/config/environment-variables/app-env.config';
import { ConfigModule } from 'src/config/app-custom-module.config';

const isRds: boolean = process.env.DB_USE_SSL === 'true';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Import the module that provides AppConfigService
      useFactory: (config: AppEnvConfigService) => ({
        type: 'postgres',
        port: config.pgDBPort,
        host: config.dbHost,
        username: config.dbUsername,
        password: config.dbPassword,
        database: config.dbName,
        autoLoadEntities: true,
        synchronize: false,
        // synchronize: config.dbSynchronize,
        // logging: true,
        ssl: isRds,

        // pg-specific extras
        extra: isRds ? { ssl: { rejectUnauthorized: false } } : {},
      }),
      inject: [AppEnvConfigService], // Inject AppConfigService
    }),
  ],
})
export class DatabaseModule {}
