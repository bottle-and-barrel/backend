import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { ManufacturerService } from './manufacturer.service';
import { CreateManufacturerDto } from './dto/create-manufacturer.dto';
import { UpdateManufacturerDto } from './dto/update-manufacturer.dto';
import { NotFoundError } from 'src/lib/errors/notfound';
import { ApiTags } from '@nestjs/swagger';

@Controller('manufacturer')
@ApiTags('Производители')
export class ManufacturerController {
  constructor(private readonly manufacturerService: ManufacturerService) {}

  @Post()
  create(@Body() dto: CreateManufacturerDto) {
    return this.manufacturerService.create(dto);
  }

  @Get()
  findAll() {
    return this.manufacturerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.manufacturerService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new NotFoundException();
      }
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateManufacturerDto) {
    return this.manufacturerService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.manufacturerService.remove(id);
  }
}
