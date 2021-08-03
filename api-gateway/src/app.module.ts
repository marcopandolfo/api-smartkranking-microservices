import { Module } from '@nestjs/common';
import { CategoriasModule } from './categorias/categorias.module';
import { ProxyRMQModule } from './proxyrmq/proxyrmq.module';
import { JogadoresModule } from './jogadores/jogadores.module';
import { AwsModule } from './aws/aws.module';
import { ConfigModule } from '@nestjs/config';
import { DesafiosModule } from './desafios/desafios.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CategoriasModule,
    ProxyRMQModule,
    JogadoresModule,
    AwsModule,
    DesafiosModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
