import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  UsePipes,
  ValidationPipe,
  Param,
  Put,
  BadRequestException,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { ValidacaoParametrosPipe } from '../common/pipes/validacao-parametros.pipe';
import { AtualizarJogadorDto } from './dtos/atualizar-jogador.dto';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy';
import { Observable } from 'rxjs';
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsService } from 'src/aws/aws.service';

@Controller('api/v1/jogadores')
export class JogadoresController {
  constructor(
    private readonly clientProxySmartRanking: ClientProxySmartRanking,
    private readonly awsService: AwsService,
  ) {}

  private readonly clientAdminBackend = this.clientProxySmartRanking.getClientProxyAdminBackendInstance();

  @Post()
  @UsePipes(ValidationPipe)
  async criarJogador(@Body() criarJogadorDto: CriarJogadorDto) {
    const categoria = await this.clientAdminBackend
      .send('consultar-categorias', criarJogadorDto.categoria)
      .toPromise();

    if (categoria) {
      this.clientAdminBackend.emit('criar-jogador', criarJogadorDto);
      return;
    }

    throw new BadRequestException('Categoria não encontrada');
  }

  @Post('/:_id/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadArquivo(@UploadedFile() file, @Param('_id') _id: string) {
    const jogador = await this.clientAdminBackend
      .send('consultar-jogadores', _id)
      .toPromise();

    if (!jogador) {
      throw new BadRequestException('Jogador não cadastrado');
    }

    const urlFotoJogador = await this.awsService.uploadArquivo(file, _id);

    const atualizarJogadorDto: AtualizarJogadorDto = {};
    atualizarJogadorDto.urlFotoJogador = urlFotoJogador.url;

    this.clientAdminBackend.emit('atualizar-jogador', {
      id: _id,
      jogador: atualizarJogadorDto,
    });

    return this.clientAdminBackend.send('consultar-jogadores', _id);
  }

  @Get()
  consultarJogadores(@Query('idJogador') _id: string): Observable<any> {
    return this.clientAdminBackend.send('consultar-jogadores', _id ?? '');
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async atualizarJogador(
    @Body() atualizarJogadorDto: AtualizarJogadorDto,
    @Param('_id', ValidacaoParametrosPipe) _id: string,
  ) {
    const categoria = await this.clientAdminBackend
      .send('consultar-categorias', atualizarJogadorDto.categoria)
      .toPromise();

    if (categoria) {
      this.clientAdminBackend.emit('atualizar-jogador', {
        id: _id,
        jogador: atualizarJogadorDto,
      });
      return;
    }

    throw new BadRequestException('Categoria não encontrada');
  }

  @Delete('/:_id')
  async deletarJogador(@Param('_id', ValidacaoParametrosPipe) _id: string) {
    this.clientAdminBackend.emit('deletar-jogador', { _id });
  }
}
