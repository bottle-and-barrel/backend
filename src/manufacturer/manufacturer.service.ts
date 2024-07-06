import { Injectable, Logger } from '@nestjs/common';
import { CreateManufacturerDto } from './dto/create-manufacturer.dto';
import { UpdateManufacturerDto } from './dto/update-manufacturer.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { uuidv7 } from 'uuidv7';
import { Manufacturer } from './entities/manufacturer.entity';
import { NotFoundError } from 'src/lib/errors/notfound';

@Injectable()
export class ManufacturerService {
  private readonly logger = new Logger(ManufacturerService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateManufacturerDto): Promise<Manufacturer> {
    const id = uuidv7();

    const manufacturer = await this.prisma.manufacturer.create({
      data: {
        id: id,
        name: dto.name,
        address: dto.address,
      },
    });

    return {
      id: manufacturer.id,
      name: manufacturer.name,
      address: manufacturer.address,
      created_at: manufacturer.createdAt,
      updated_at: manufacturer.updatedAt,
    };
  }

  async findAll(): Promise<Manufacturer[]> {
    const mm = await this.prisma.manufacturer.findMany();
    return mm.map((m) => ({
      id: m.id,
      name: m.name,
      address: m.address,
      created_at: m.createdAt,
      updated_at: m.updatedAt,
    }));
  }

  async findOne(id: string): Promise<Manufacturer> {
    const manufacturer = await this.prisma.manufacturer.findUnique({
      where: {
        id,
      },
    });

    if (!manufacturer) {
      throw new NotFoundError('Manufacturer', `id=${id}`);
    }

    return {
      id: manufacturer.id,
      name: manufacturer.name,
      address: manufacturer.address,
      created_at: manufacturer.createdAt,
      updated_at: manufacturer.updatedAt,
    };
  }

  async update(id: string, dto: UpdateManufacturerDto) {
    const m = await this.prisma.manufacturer.update({
      where: { id },
      data: {
        ...dto,
        updatedAt: new Date(),
      },
    });

    return m;
  }

  async remove(id: string) {
    return await this.prisma.manufacturer.delete({ where: { id } });
  }
}
