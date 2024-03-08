import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';
import { EnvironmentVariables } from './types/environmentVariables';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const port = app.get(ConfigService<EnvironmentVariables>).get<number>('PORT');
  await app.listen(port || 3000);
}
bootstrap();
