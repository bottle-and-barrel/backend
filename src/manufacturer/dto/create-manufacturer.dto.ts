import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateManufacturerDto {
  @ApiProperty({ example: 'villa krim' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Республика Крым' })
  @IsString()
  address: string;
}
