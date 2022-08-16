import { Post } from "../entities/Post";
import { MyContext } from "src/types";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { RequiredEntityData } from "@mikro-orm/core";

@Resolver()
export class PostResolver {
    // graphQL query - CRUD - read
    @Query(() => [Post])
    posts(@Ctx() { em }: MyContext): Promise<Post[]> {
        return em.find(Post, {});
    }

    // graphQL query - CRUD - read by id
    @Query(() => Post, {nullable: true})
    post(
        @Arg("id") id: number,
        @Ctx() { em }: MyContext): Promise<Post | null> {
        return em.findOne(Post, { id });
    }

    // graphQL query - CRUD - create
    @Mutation(() => Post)
    async createPost(
        @Arg("title") title: string,
        @Ctx() { em }: MyContext): Promise<Post> {
        // alias to fix error "Argument of type '{ title: string; }' is not assignable to parameter of type 'RequiredEntityData<Post>"
        const post = em.create(Post, { title } as RequiredEntityData<Post>);
        await em.persistAndFlush(post);
        return post;
    }

    // graphQL query - CRUD - update
    @Mutation(() => Post, { nullable: true })
    async updatePost(
        @Arg("id") id: number,
        @Arg("title", () => String, { nullable: true }) title: string,
        @Ctx() { em }: MyContext): Promise<Post | null> {
        const post = await em.findOne(Post, { id });
        if (!post) {
            return null;
        }
        if (typeof title !== "undefined") {
            post.title = title;
            await em.persistAndFlush(post);
        }
        return post;
    }
}