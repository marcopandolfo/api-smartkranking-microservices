import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Partida } from './interfaces/partida.interface';
import { Desafio } from '../desafios/interfaces/desafio.interface';
import { RpcException } from '@nestjs/microservices';
import { ClientProxySmartRanking } from '../proxyrmq/client-proxy';

@Injectable()
export class PartidasService {
  constructor(
    @InjectModel('Partida') private readonly partidaModel: Model<Partida>,
    private clientProxySmartRanking: ClientProxySmartRanking,
  ) {}

  private readonly logger = new Logger(PartidasService.name);
  private clientDesafios = this.clientProxySmartRanking.getClientProxyDesafiosInstance();

  async criarPartida(partida: Partida): Promise<Partida> {
    try {
      const partidaCriada = new this.partidaModel(partida);
      const result = await partidaCriada.save();
      const idPartida = result._id;

      const desafio: Desafio = await this.clientDesafios
        .send('consultar-desafios', { idJogador: '', _id: partida.desafio })
        .toPromise();

      return await this.clientDesafios
        .emit('atualizar-desafio-partida', { idPartida: idPartida, desafio: desafio })
        .toPromise();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }
}
