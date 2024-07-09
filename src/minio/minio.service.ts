import { Injectable, Logger } from '@nestjs/common';
import * as Minio from 'minio';
import { uuidv7 } from 'uuidv7';

@Injectable()
export class MinioService {
  private readonly logger = new Logger(MinioService.name);
  private readonly client: Minio.Client;
  private readonly bucket: string;

  constructor() {
    this.client = new Minio.Client({
      endPoint: process.env.MINIO_ENDPOINT,
      port: Number(process.env.MINIO_PORT),
      accessKey: process.env.MINIO_ACCESS_KEY,
      secretKey: process.env.MINIO_SECRET_KEY,
      useSSL: false,
    });

    this.bucket = process.env.MINIO_BUCKET_NAME;
  }

  async createBucketIfNotExists() {
    const bucketExists = await this.client.bucketExists(this.bucket);

    if (!bucketExists) {
      this.logger.verbose(`creating a '${this.bucket}' bucket`);
      await this.client.makeBucket(this.bucket);
    }
  }

  async uploadFile(
    file: Express.Multer.File,
  ): Promise<{ id: string; ext: string; fileName: string }> {
    const id = uuidv7();
    const ext = file.mimetype.split('/')[1];

    const fileName = id + '.' + ext;

    this.logger.verbose('uploading a ', { fileName });
    try {
      await this.client.putObject(
        this.bucket,
        fileName,
        file.buffer,
        file.size,
      );
    } catch (error) {
      if (error.code && error.code === 'NoSuchBucket') {
        this.logger.warn(`bucket ${this.bucket} doesnt exists`);
        await this.createBucketIfNotExists();
        return await this.uploadFile(file);
      }
      this.logger.error('error putting object', { error });
      throw new Error();
    }
    return { id, ext, fileName };
  }

  async getFileUrl(fileName: string) {
    return await this.client.presignedUrl('GET', this.bucket, fileName);
  }

  async deleteFile(fileName: string) {
    await this.client.removeObject(this.bucket, fileName);
  }
}
