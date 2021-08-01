import { Module } from '@nestjs/common';
import { CategoriasModule } from './categorias/categorias.module';
import { ProxyrmqModule } from './proxyrmq/proxyrmq.module';
import { JogadoresModule } from './jogadores/jogadores.module';

@Module({
  imports: [CategoriasModule, ProxyrmqModule, JogadoresModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
