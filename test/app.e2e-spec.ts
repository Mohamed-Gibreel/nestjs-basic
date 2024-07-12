import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { AuthDto } from '../src/auth/dto';
import { EditUserDto } from '../src/user/dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const baseUrl = 'http://localhost:3000';

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    prisma = app.get(PrismaService);
    pactum.request.setBaseUrl(baseUrl);
    await prisma.cleanDatabase();

    await app.init();
    await app.listen(3000);
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const authDto: AuthDto = {
      email: 'mohamed@gibreel.dev',
      firstName: 'Mohamed',
      password: 'password',
    };

    describe('Sign up', () => {
      it('Should throw error, since email is empty', () => {
        return pactum
          .spec()
          .post(`/auth/register`)
          .withBody({
            password: authDto.password,
          })
          .expectStatus(400);
      });

      it('Should throw error, since password is empty', () => {
        return pactum
          .spec()
          .post(`/auth/register`)
          .withBody({
            email: authDto.email,
          })
          .expectStatus(400);
      });

      it('Should throw error, since body is empty', () => {
        return pactum.spec().post(`/auth/register`).expectStatus(400);
      });

      it('Should sign up', () => {
        return pactum
          .spec()
          .post(`/auth/register`)
          .withBody(authDto)
          .expectStatus(201);
      });
    });

    describe('Sign in', () => {
      it('Should throw error, since email is empty', () => {
        return pactum
          .spec()
          .post(`/auth/login`)
          .withBody({
            password: authDto.password,
          })
          .expectStatus(400);
      });

      it('Should throw error, since password is empty', () => {
        return pactum
          .spec()
          .post(`/auth/login`)
          .withBody({
            email: authDto.email,
          })
          .expectStatus(400);
      });

      it('Should throw error, since body is empty', () => {
        return pactum.spec().post(`/auth/login`).expectStatus(400);
      });

      it('Should sign in', () => {
        return pactum
          .spec()
          .post(`/auth/login`)
          .withBody(authDto)
          .expectStatus(200)
          .stores('userAt', 'access_token');
      });
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it('Should get current user', () => {
        return pactum
          .spec()
          .get(`/users/me`)
          .withBearerToken('$S{userAt}')
          .expectStatus(200)
          .stores('userId', 'id');
      });
    });

    describe('Edit User', () => {
      it('Should edit user', () => {
        const editUserDto: EditUserDto = {
          firstName: 'Ghadeer',
          email: 'ghadeer@lenadorsystems.com',
        };
        return pactum
          .spec()
          .patch(`/users/$S{userId}`)
          .withBearerToken('$S{userAt}')
          .withBody(editUserDto)
          .expectStatus(200)
          .expectBodyContains(editUserDto.email)
          .expectBodyContains(editUserDto.firstName)
          .inspect();
      });
    });
  });

  describe('Bookmark', () => {
    describe('Create bookmark', () => {});
    describe('Get bookmarks', () => {});
    describe('Get bookmarks by id', () => {});
    describe('Edit bookmark', () => {});
    describe('Delete bookmark', () => {});
  });
});
