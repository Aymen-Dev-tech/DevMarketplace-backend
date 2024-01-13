import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SellersService {
  constructor(private prisma: PrismaService) {}
  async create(userId: number) {
    return this.prisma.seller.create({
      data: { userId },
    });
  }
}
