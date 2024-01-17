import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}
  create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({
      data: createProductDto,
    });
  }

  findAll(sellerId: number) {
    return this.prisma.product.findMany({
      where: {
        sellerId,
      },
      select: {
        id: true,
        name: true,
        price: true,
        isSold: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  // update(id: number, updateProductDto: UpdateProductDto) {
  //   return this.prisma;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} product`;
  // }
}
