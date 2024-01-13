import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BuyersService {
  constructor(private prisma: PrismaService) {}
  async create(userId: number) {
    return this.prisma.buyer.create({
      data: {
        userId,
      },
    });
  }
}
