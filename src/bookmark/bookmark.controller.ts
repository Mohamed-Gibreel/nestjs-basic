import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { User } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';
import { ApiBearerAuth, ApiNoContentResponse, ApiTags } from '@nestjs/swagger';

@Controller('bookmarks')
@UseGuards(JwtGuard)
@ApiTags('bookmarks')
@ApiBearerAuth()
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @Post()
  async createBookmark(
    @User('id') userId: number,
    @Body() dto: CreateBookmarkDto,
  ) {
    return await this.bookmarkService.createBookmark(userId, dto);
  }

  @Get()
  getBookmarks(@User('id') userId: number) {
    return this.bookmarkService.getBookmarks(userId);
  }

  @Get(':id')
  getBookmarkById(
    @User('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookmarkService.getBookmarkById(userId, bookmarkId);
  }

  @Patch(':id')
  editBookmarkById(
    @Param('id', ParseIntPipe) bookmarkId: number,
    @User('id') userId: number,
    @Body() dto: EditBookmarkDto,
  ) {
    return this.bookmarkService.editBookmarkById(bookmarkId, userId, dto);
  }

  @Delete(':id')
  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteBookmarkById(
    @User('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookmarkService.deleteBookmarkById(userId, bookmarkId);
  }
}
