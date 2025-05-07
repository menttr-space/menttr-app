import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Post } from "src/common/entities/post.entity";
import { In, Repository } from "typeorm";
import { GetPostsDto } from "./dtos/get-posts.dto";
import { CreatePostDto } from "./dtos/create-post.dto";
import { AuthContext } from "src/auth/auth-context.type";
import { ClientProxy } from "@nestjs/microservices";
import { SEARCH_SERVICE } from "src/clients/clients.constants";

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @Inject(SEARCH_SERVICE) private readonly rmqClient: ClientProxy,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getPosts({ cursor }: GetPostsDto) {
    return this.postRepository.find();
  }

  async getPostsByIds(ids: string[]) {
    return this.postRepository.find({
      where: { id: In(ids) },
    });
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

    const savedPost = await this.postRepository.save(post);

    this.rmqClient.emit("discussion.created", {
      id: savedPost.id,
      type: "post",
      title: savedPost.title,
      content: savedPost.content,
      postId: savedPost.id,
      upvotesCount: 0,
      commentsCount: 0,
      createdAt: savedPost.createdAt,
    });

    return savedPost;
  }
}
