import { Post } from "../entities/Post";
import { MyContext } from "src/types";
import { Arg, Ctx, Int, Query, Resolver } from "type-graphql";

@Resolver()
export class PostResolver {
    // graphQL query - CRUD - read
    @Query(() => [Post])
    posts(@Ctx() {em}: MyContext): Promise<Post[]> {
        return em.find(Post, {});
    }

    // graphQL query - CRUD - read by id
    @Query(() => Post, {nullable: true})
    post(
        @Arg("id", () => Int) id: number,
        @Ctx() {em}: MyContext): Promise<Post | null> {
        return em.findOne(Post, { id });
    }
}