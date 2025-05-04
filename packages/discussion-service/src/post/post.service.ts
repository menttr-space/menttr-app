import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Post } from "src/common/entities/post.entity";
import { Repository } from "typeorm";
import { GetPostsDto } from "./dtos/get-posts.dto";
import { CreatePostDto } from "./dtos/create-post.dto";
import { AuthContext } from "src/auth/auth-context.type";

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getPosts({ cursor }: GetPostsDto) {
    return this.postRepository.find();
  }

  async createPost(
    { title, content, createdAt }: CreatePostDto,
    ctx: AuthContext,
  ) {
    const post = this.postRepository.create({
      userId: ctx.user.id,
      title,
      content,
      createdAt,
    });

    return this.postRepository.save(post);
  }
}
