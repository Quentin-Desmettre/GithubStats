import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from './types/environmentVariables';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = app.get(ConfigService<EnvironmentVariables>).get<number>('PORT');
  await app.listen(port || 3000);
}
bootstrap();
