import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';
import { EnvironmentVariables } from './types/environmentVariables';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const port = app.get(ConfigService<EnvironmentVariables>).get<number>('API_PORT') || 3000;
  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${port}`);
  await app.listen(port);
}
bootstrap();
