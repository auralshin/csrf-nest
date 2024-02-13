import {
  DynamicModule,
  MiddlewareConsumer,
  Module,
  NestModule,
  Type,
} from '@nestjs/common';
import { CsrfMiddleware } from './csrf.middleware';
import { CsrfService } from './csrf.service';
import { RouteInfo } from '@nestjs/common/interfaces';

interface CsrfModuleOptions {
  forRoutes?: (string | Type<any> | RouteInfo)[];
  tokenGenerationUrl?: string;
}

@Module({})
export class CsrfModule implements NestModule {
  private static options: CsrfModuleOptions = {};

  static forRoot(options: CsrfModuleOptions = {}): DynamicModule {
    CsrfModule.options = options;
    return {
      module: CsrfModule,
      providers: [CsrfService],
      exports: [CsrfService],
    };
  }

  static getOptions(): CsrfModuleOptions {
    return CsrfModule.options;
  }

  configure(consumer: MiddlewareConsumer) {
    if (CsrfModule.options.forRoutes) {
      consumer.apply(CsrfMiddleware).forRoutes(...CsrfModule.options.forRoutes);
    } else {
      consumer.apply(CsrfMiddleware).forRoutes('*'); // or any default you prefer
    }
  }
}
