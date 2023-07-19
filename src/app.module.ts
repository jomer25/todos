import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule, CacheModuleOptions } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { TodosModule } from './todos/todos.module';
import { CaslModule } from './casl/casl.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI')
      }),
      inject: [ConfigService]
    }),
    CacheModule.registerAsync({
      useFactory: async (configService: ConfigService): Promise<CacheModuleOptions> => ({
        store: typeof redisStore,
        host: configService.get<string>('REDIS_HOST', 'redis'),
        port: configService.get<number>('REDIS_PORT', 6379),
        ttl: 3600,
      }),
      inject: [ConfigService]
    }),
    TodosModule,
    CaslModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
