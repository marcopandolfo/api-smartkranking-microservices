import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ClientProxySmartRanking {
  private RABBITMQ_USER: string;
  private RABBITMQ_URL: string;
  private RABBITMQ_PASSWORD: string;

  constructor(private readonly configService: ConfigService) {
    this.RABBITMQ_USER = this.configService.get<string>('RABBITMQ_USER');
    this.RABBITMQ_PASSWORD = this.configService.get<string>('RABBITMQ_PASSWORD');
    this.RABBITMQ_URL = this.configService.get<string>('RABBITMQ_URL');
  }

  getClientProxyAdminBackendInstance(): ClientProxy {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${this.RABBITMQ_USER}:${this.RABBITMQ_PASSWORD}@${this.RABBITMQ_URL}`],
        queue: 'admin-backend',
      },
    });
  }

  getClientProxyDesafiosInstance(): ClientProxy {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${this.RABBITMQ_USER}:${this.RABBITMQ_PASSWORD}@${this.RABBITMQ_URL}`],
        queue: 'desafios',
      },
    });
  }
}
