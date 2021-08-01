import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class AwsService {
  public async uploadArquivo(file: any, id: string) {
    const s3 = new AWS.S3({
      region: 'us-east-1',
      accessKeyId: '',
      secretAccessKey: '',
    });

    const fileExt: string = file.originalname.split('.')[1];
    const urlKey = `${id}.${fileExt}`;

    const params = {
      Body: file.buffer,
      Bucket: 'smartranking',
      Key: urlKey,
    };

    const data = s3
      .putObject(params)
      .promise()
      .then(
        data => {
          return data;
        },
        err => {
          console.error(err);
          return err;
        },
      );

    return data;
  }
}
