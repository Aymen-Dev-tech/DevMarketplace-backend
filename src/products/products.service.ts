import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Product, ProductPicture } from '@prisma/client';
import { UpdateProductDto } from './dto/update-product.dto';
@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}
  async create(createProductDto: CreateProductDto): Promise<Product> {
    const body = { name: createProductDto.name };
    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    };

    try {
      // Await the fetch request to ChargilyPay
      const response = await fetch(
        'https://pay.chargily.net/test/api/v2/products',
        options,
      );
      if (!response.ok) {
        throw new Error('Error when creating product in Chargliy pay');
      }
      const responseData = await response.json();
      const priceBody = {
        amount: createProductDto.price,
        currency: 'dzd',
        product_id: responseData.id,
      };
      const priceOptions = {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(priceBody),
      };
      const priceResponse = await fetch(
        'https://pay.chargily.net/test/api/v2/prices',
        priceOptions,
      );
      if (!priceResponse.ok) {
        throw new Error('Error when creating price in Chargliy pay');
      }
      const priceJson = await priceResponse.json();
      console.log('price respons:', priceJson);

      // Assign the fetched ID to the DTO
      createProductDto.ChargilyPayId = responseData.id;
      createProductDto.ChargilyPayPriceId = priceJson.id;

      // Save the product to the database only after the ChargilyPayId is set
      return this.prisma.product.create({
        data: createProductDto,
      });
    } catch (err) {
      console.error(err);
    }
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
      include: {
        Seller: {
          select: {
            user: {
              select: {
                name: true,
                profilePicture: true,
                email: true,
                phoneNumber: true,
              },
            },
            exp: true,
          },
        },
      },
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
  update(id: number, data: UpdateProductDto) {
    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.product.delete({
      where: { id },
    });
  }
}
