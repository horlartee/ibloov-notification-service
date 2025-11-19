import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ExceptionFilter } from './helpers/rcp-exception.filter';

async function bootstrap() {
  const port = process.env.PORT ? Number(process.env.PORT) : 1223;

  const microservicesOptions: any = {
    transport: Transport.RMQ,
    options: {
      urls: process.env.RABBITMQ_URL,
      queue: 'service.hoshistech-notification',
    },
  };

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    microservicesOptions,
  );

  app.useGlobalFilters(new ExceptionFilter());

  await app.listen();

  Logger.log(`Notification microservice running on port: ${port}`);
}
bootstrap();
