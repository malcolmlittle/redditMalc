import { Query, Resolver } from "type-graphql";

@Resolver()
export class HelloResolver {
    // graphQL query
    @Query(() => String)
    hello() {
        return "hello world"
    }
}