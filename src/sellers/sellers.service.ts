import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

type seller = {
  userId: number;
  exp: string;
};
@Injectable()
export class SellersService {
  constructor(private prisma: PrismaService) {}
  async create(data: seller) {
    return this.prisma.seller.create({
      data,
    });
  }
}
