import { Module } from '@nestjs/common';
import { JogadoresController } from './jogadores.controller';
import { ProxyrmqModule } from 'src/proxyrmq/proxyrmq.module';
import { AwsModule } from 'src/aws/aws.module';

@Module({
  imports: [ProxyrmqModule, AwsModule],
  controllers: [JogadoresController],
})
export class JogadoresModule {}
