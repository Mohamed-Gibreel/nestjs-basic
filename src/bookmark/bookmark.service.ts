import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  async createBookmark(userId: number, createBookmarkDto: CreateBookmarkDto) {
    try {
      const bookmark = await this.prisma.bookmark.create({
        data: {
          ...createBookmarkDto,
          userId: userId,
        },
      });
      return bookmark;
    } catch (e) {
      throw e;
    }
  }

  async getBookmarks(userId: number) {
    try {
      const bookmarks = await this.prisma.bookmark.findMany({
        where: {
          userId: userId,
        },
      });
      return bookmarks;
    } catch (e) {
      throw e;
    }
  }

  async getBookmarkById(userId: number, bookmarkId: number) {
    try {
      const bookmark = await this.prisma.bookmark.findUnique({
        where: {
          id: bookmarkId,
        },
      });
      if (!bookmark || bookmark.userId != userId) {
        throw new NotFoundException();
      }
      return bookmark;
    } catch (e) {
      throw e;
    }
  }

  async editBookmarkById(
    bookmarkId: number,
    userId: number,
    dto: EditBookmarkDto,
  ) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });
    if (!bookmark || bookmark.userId != userId) {
      throw new NotFoundException();
    }
    const editedBookmark = await this.prisma.bookmark.update({
      where: {
        id: bookmarkId,
        userId: userId,
      },
      data: {
        ...dto,
      },
    });

    return editedBookmark;
  }

  async deleteBookmarkById(userId: number, bookmarkId: number) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });
    if (!bookmark || bookmark.userId != userId) {
      throw new NotFoundException();
    }
    await this.prisma.bookmark.delete({
      where: {
        id: bookmarkId,
        userId: userId,
      },
    });

    return true;
  }
}
