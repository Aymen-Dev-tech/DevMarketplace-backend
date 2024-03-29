import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async findOne(email: string): Promise<any> {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findOneById(id: number): Promise<any> {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        Seller: {
          select: {
            id: true,
            exp: true,
          },
        },
        Buyer: {
          select: {
            id: true,
          },
        },
      },
    });
  }

  async update(id: number, data: UpdateUserDto) {
    return this.prisma.user.update({
      where: {
        id,
      },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
