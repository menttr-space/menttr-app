import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { PostService } from "./post.service";
import { GetPostsDto } from "./dtos/get-posts.dto";
import { AuthGuard } from "@nestjs/passport";
import { AuthUser } from "src/auth/auth-user.decorator";
import { CreatePostDto } from "./dtos/create-post.dto";
import { AuthContext } from "src/auth/auth-context.type";

@Controller("posts")
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  getPosts(@Query() query: GetPostsDto) {
    return this.postService.getPosts(query);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post()
  createPost(
    @AuthUser() ctx: AuthContext,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postService.createPost(createPostDto, ctx);
  }
}
