import { Module } from '@nestjs/common';
import { CategoriasModule } from './categorias/categorias.module';
import { ProxyrmqModule } from './proxyrmq/proxyrmq.module';

@Module({
  imports: [CategoriasModule, ProxyrmqModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
