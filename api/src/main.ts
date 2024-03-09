import * as fs from 'fs';

import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { INestApplication } from '@nestjs/common';

import { AppModule } from './app.module';
import { EnvironmentVariables } from './types/environmentVariables';

config();

async function bootstrap(): Promise<void> {
  let app: INestApplication;

  if (process.env.SSL_KEY_PATH && process.env.SSL_CERT_PATH) {
    const httpsOptions = {
      key: fs.readFileSync(process.env.SSL_KEY_PATH),
      cert: fs.readFileSync(process.env.SSL_CERT_PATH),
    };
    app = await NestFactory.create(AppModule, { httpsOptions });
  } else {
    app = await NestFactory.create(AppModule);
  }

  const port = app.get(ConfigService<EnvironmentVariables>).get<number>('API_PORT') || 3000;
  await app.listen(port);

  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${port}`);
}
bootstrap();
