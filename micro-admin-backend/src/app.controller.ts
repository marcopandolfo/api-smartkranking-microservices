import { Controller, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { Payload, EventPattern, MessagePattern } from '@nestjs/microservices';
import { Categoria } from './interfaces/categorias/categoria.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  private readonly logger = new Logger(AppController.name);

  @EventPattern('criar-categoria')
  async criarCategoria(@Payload() categoria: Categoria) {
    this.logger.log(`Categoria: ${JSON.stringify(categoria)}`);
    await this.appService.criarCategoria(categoria);
  }

  @MessagePattern('consultar-categorias')
  async consultarCategorias(@Payload() _id: string) {
    if (_id) {
      return this.appService.consultarCategoriaPeloId(_id);
    }

    return this.appService.consultarTodasCategorias();
  }
}
