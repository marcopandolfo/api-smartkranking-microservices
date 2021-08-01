import { Module } from '@nestjs/common';
import { CategoriasController } from './categorias.controller';
import { ProxyrmqModule } from 'src/proxyrmq/proxyrmq.module';

@Module({
  imports: [ProxyrmqModule],
  controllers: [CategoriasController],
  providers: [],
})
export class CategoriasModule {}
