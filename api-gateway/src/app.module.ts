import { Module } from '@nestjs/common';
import { CategoriasModule } from './categorias/categorias.module';
import { ProxyrmqModule } from './proxyrmq/proxyrmq.module';
import { JogadoresModule } from './jogadores/jogadores.module';
import { AwsModule } from './aws/aws.module';

@Module({
  imports: [CategoriasModule, ProxyrmqModule, JogadoresModule, AwsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
