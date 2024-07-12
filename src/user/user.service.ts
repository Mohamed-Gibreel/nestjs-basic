import { Injectable, NotFoundException } from '@nestjs/common';
import { EditUserDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async editUser(userId: number, editUserDto: EditUserDto) {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...editUserDto,
      },
    });
    if (!user) {
      throw new NotFoundException();
    }
    delete user.hash;
    return user;
  }
}
