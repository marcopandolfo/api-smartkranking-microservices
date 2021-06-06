import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Categoria } from './interfaces/categorias/categoria.interface';
import { Jogador } from './interfaces/jogadores/jogador.interface';
import { Model } from 'mongoose';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(
    @InjectModel('Categoria') private readonly categoriaModel: Model<Categoria>,
    @InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>,
  ) {}

  private readonly logger = new Logger(AppService.name);

  async criarCategoria(categoria: Categoria): Promise<Categoria> {
    try {
      const categoriaCriada = new this.categoriaModel(categoria);
      return categoriaCriada.save();
    } catch (error) {
      this.logger.error(`Error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async consultarTodasCategorias(): Promise<Categoria[]> {
    try {
      return this.categoriaModel
        .find()
        .populate('jogadores')
        .exec();
    } catch (error) {
      this.logger.error(`Error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async consultarCategoriaPeloId(categoria: string): Promise<Categoria> {
    try {
      return this.categoriaModel.findOne({ categoria }).exec();
    } catch (error) {
      this.logger.error(`Error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }
}
