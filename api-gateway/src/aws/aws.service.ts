import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsService {
  constructor(private readonly configService: ConfigService) {}

  public async uploadArquivo(file: any, id: string) {
    const AWS_S3_BUCKET = this.configService.get<string>('AWS_S3_BUCKET');
    const AWS_REGION = this.configService.get<string>('AWS_REGION');
    const AWS_ACCESS_KEY_ID = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const AWS_SECRET_ACCESS_KEY = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');

    const s3 = new AWS.S3({
      region: AWS_REGION,
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
    });

    const fileExt: string = file.originalname.split('.')[1];
    const urlKey = `${id}.${fileExt}`;

    const params = {
      Body: file.buffer,
      Bucket: AWS_S3_BUCKET,
      Key: urlKey,
    };

    const data = s3
      .putObject(params)
      .promise()
      .then(
        () => {
          return {
            url: `https://smartranking.s3-us-east-1.amazonaws.com/${urlKey}`,
          };
        },
        err => {
          console.error(err);
          return err;
        },
      );

    return data;
  }
}
