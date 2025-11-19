import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { NotificationModule } from './notifications/notification.module';

@Module({
  imports: [ConfigModule.forRoot(), CoreModule, NotificationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
