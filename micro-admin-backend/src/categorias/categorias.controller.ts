import { Controller, Logger } from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import {
  Payload,
  EventPattern,
  MessagePattern,
  Ctx,
  RmqContext,
} from '@nestjs/microservices';
import { Categoria } from './interfaces/categoria.interface';

const ackErrors = ['E11000']; // mongodb duplicated index

@Controller()
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  private readonly logger = new Logger(CategoriasController.name);

  @EventPattern('criar-categoria')
  async criarCategoria(
    @Payload() categoria: Categoria,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    this.logger.log(`Categoria: ${JSON.stringify(categoria)}`);

    try {
      await this.categoriasService.criarCategoria(categoria);
      await channel.ack(originalMessage);
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error)}`);

      const filteredAckError = ackErrors.filter(ackError =>
        error.message.includes(ackError),
      );

      if (filteredAckError) {
        await channel.ack(originalMessage);
      }
    }
  }

  @MessagePattern('consultar-categorias')
  async consultarCategorias(
    @Payload() _id: string,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      if (_id) {
        return await this.categoriasService.consultarCategoriaPeloId(_id);
      }

      return await this.categoriasService.consultarTodasCategorias();
    } finally {
      await channel.ack(originalMessage);
    }
  }

  @EventPattern('atualizar-categoria')
  async atualizarCategoria(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    // this.logger.log(`data: ${JSON.stringify(data)}`);

    try {
      const _id: string = data.id;
      const categoria: Categoria = data.categoria;

      await this.categoriasService.atualizarCategoria(_id, categoria);
      await channel.ack(originalMessage);
    } catch (error) {
      const filteredAckError = ackErrors.filter(ackError =>
        error.message.includes(ackError),
      );

      if (filteredAckError) {
        await channel.ack(originalMessage);
      }
    }
  }
}
