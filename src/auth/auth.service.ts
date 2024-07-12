import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthDto, SignInDto } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from './../prisma/prisma.service';

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signIn({ email, password }: SignInDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: email,
        },
      });
      if (!user) throw new NotFoundException();
      const isPasswordValid = await argon.verify(user.hash, password);
      if (!isPasswordValid)
        throw new BadRequestException({
          message: ['Invalid password'],
          errorCode: '123',
          statusCode: 404,
        });

      return await this.signToken(user.id, user.email);
    } catch (e) {
      throw e;
    }
  }

  async signUp({ email, firstName, password }: AuthDto) {
    try {
      const hash = await argon.hash(password);
      const user = await this.prisma.user.create({
        data: {
          email: email,
          firstName: firstName,
          hash: hash,
        },
      });

      return await this.signToken(user.id, user.email);
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new BadRequestException({
            message: ['Email is already taken. Please use another email'],
            errorCode: e.code,
            statusCode: 404,
          });
        }
        throw e;
      }
      throw e;
    }
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{
    access_token: string;
  }> {
    const payload = {
      sub: userId,
      email: email,
    };
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: this.config.get('JWT_SECRET'),
    });
    return {
      access_token: token,
    };
  }

  async validateUser({ sub, email }: { sub: number; email: string }) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
        id: sub,
      },
    });
    if (!user) {
      throw new ForbiddenException();
    }
    delete user.hash;
    return user;
  }
}
