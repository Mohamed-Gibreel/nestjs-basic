import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { AuthDto } from '../src/auth/dto';
import { EditUserDto } from '../src/user/dto';
import { CreateBookmarkDto, EditBookmarkDto } from 'src/bookmark/dto';

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
      it('Should throw 401, since no token is passed', () => {
        return pactum.spec().get(`/users/me`).expectStatus(401);
      });

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
      const editUserDto: EditUserDto = {
        firstName: 'Ghadeer',
      };
      it('Should edit user', () => {
        return pactum
          .spec()
          .patch(`/users/$S{userId}`)
          .withBearerToken('$S{userAt}')
          .withBody(editUserDto)
          .expectStatus(200)
          .expectBodyContains(editUserDto.firstName);
      });
    });
  });

  describe('Bookmark', () => {
    describe('Create bookmark', () => {
      const bookmark: CreateBookmarkDto = {
        title: 'First bookmark',
        description: 'Sample description',
        link: 'https://google.com',
      };
      it('Should throw 400, since incomplete body was sent', () => {
        return pactum
          .spec()
          .post('/bookmarks/')
          .withBearerToken('$S{userAt}')
          .withBody({
            title: bookmark.title,
          })
          .expectStatus(400);
      });

      it('Should create a new bookmark', () => {
        return pactum
          .spec()
          .post('/bookmarks/')
          .withBearerToken('$S{userAt}')
          .withBody(bookmark)
          .expectStatus(201)
          .expectBodyContains(bookmark.title)
          .expectBodyContains(bookmark.description)
          .stores('bookmarkId', 'id');
      });
    });

    describe('Get bookmarks', () => {
      it('Should get all my bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withBearerToken('$S{userAt}')
          .expectStatus(200)
          .expectBodyContains('$S{userId}')
          .expectBodyContains('$S{bookmarkId}')
          .expectJsonLength(1);
      });
      it('Should get throw 404 since an invalid bookmark id is provided', () => {
        return pactum
          .spec()
          .get('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}123')
          .withBearerToken('$S{userAt}')
          .expectStatus(404);
      });
      it('Should get one bookmark', () => {
        return pactum
          .spec()
          .get('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withBearerToken('$S{userAt}')
          .expectStatus(200)
          .expectBodyContains('$S{userId}')
          .expectBodyContains('$S{bookmarkId}');
      });
    });

    describe('Get bookmarks by id', () => {});
    describe('Edit bookmark', () => {
      const editBookmarkDto: EditBookmarkDto = {
        title: 'Hello bossman',
      };

      it('Should get throw 404 since an invalid bookmark id is provided', () => {
        return pactum
          .spec()
          .patch('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}123')
          .withBearerToken('$S{userAt}')
          .withBody(editBookmarkDto)
          .expectStatus(404);
      });

      it('Should get edit bookmark', () => {
        return pactum
          .spec()
          .patch('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withBearerToken('$S{userAt}')
          .expectStatus(200)
          .withBody(editBookmarkDto)
          .expectBodyContains('$S{userId}')
          .expectBodyContains('$S{bookmarkId}')
          .expectBodyContains(editBookmarkDto.title);
      });

      it('Should return edited bookmark with new title', () => {
        return pactum
          .spec()
          .get('/bookmarks/$S{bookmarkId}')
          .withBearerToken('$S{userAt}')
          .expectStatus(200)
          .expectBodyContains('$S{userId}')
          .expectBodyContains('$S{bookmarkId}')
          .expectBodyContains(editBookmarkDto.title);
      });
    });
    describe('Delete bookmark', () => {
      it('Should throw 404, since invalid bookmark id was thrown', () => {
        return pactum
          .spec()
          .delete('/bookmarks/$S{bookmarkId}123980')
          .withBearerToken('$S{userAt}')
          .expectStatus(404);
      });

      it('Should delete bookmark and return 204 response', () => {
        return pactum
          .spec()
          .delete('/bookmarks/$S{bookmarkId}')
          .withBearerToken('$S{userAt}')
          .expectStatus(204);
      });

      it('Should get empty bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withBearerToken('$S{userAt}')
          .expectStatus(200)
          .expectJsonLength(0);
      });
    });
  });
});
