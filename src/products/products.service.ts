import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Product, ProductPicture } from '@prisma/client';
@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}
  create(createProductDto: CreateProductDto): Promise<Product> {
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
        ProductPicture: {
          select: {
            url: true,
          },
        },
      },
    });
  }

  findOne(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  async stat(sellerId: number) {
    const products = await this.findAll(sellerId);
    let totalSales: number = 0;
    const totalProducts: number = products.length;
    let soldProducts: number = 0;
    let stockProducts: number = 0;
    products.forEach((product) => {
      if (product.isSold) {
        totalSales = totalSales + product.price;
        soldProducts++;
      } else {
        stockProducts++;
      }
    });
    return { totalSales, totalProducts, soldProducts, stockProducts };
  }

  getTypes() {
    return this.prisma.produtType.findMany();
  }

  getTech(type: string) {
    if (type === 'Stack')
      return this.prisma.stack.findMany({
        select: {
          tech: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    if (type === 'Framework')
      return this.prisma.framework.findMany({
        select: {
          tech: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    if (type === 'Language')
      return this.prisma.language.findMany({
        select: {
          tech: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
  }

  createProductPictures(
    data: Prisma.ProductPictureUncheckedCreateInput,
  ): Promise<ProductPicture> {
    return this.prisma.productPicture.create({
      data,
    });
  }
  search(value: string) {
    return this.prisma.product.findMany({
      where: {
        name: {
          contains: value,
        },
      },
      select: {
        id: true,
        name: true,
      },
    });
  }
  // update(id: number, updateProductDto: UpdateProductDto) {
  //   return this.prisma;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} product`;
  // }
}
